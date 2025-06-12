import { ref, computed } from 'vue'

export type PatternType = 'DSSE' | 'SIGSTORE' | 'INTOTO' | 'UNKNOWN'

interface DsseMetadata {
  payloadType?: string
  signatureCount?: number
  digest?: string
  subjectName?: string
  predicate?: any
  signatures?: Array<{
    keyid?: string
    hasCert?: boolean
  }>
}

interface SigstoreMetadata {
  mediaType?: string
  tlogEntryCount?: number
  hasCertificateChain?: boolean
  hasRekorEntry?: boolean
  hasBundle?: boolean
  hasProducts?: boolean
}

interface InTotoMetadata {
  statementType?: string
  subjectCount?: number
  subjectName?: string
  digest?: string
  predicateType?: string
  predicate?: any
}

type PatternMetadata = DsseMetadata | SigstoreMetadata | InTotoMetadata

export interface PatternInfo {
  type: PatternType
  confidence: number
  metadata: PatternMetadata
}

export function usePatternRecognizer() {
  const currentPattern = ref<PatternInfo>({
    type: 'UNKNOWN',
    confidence: 0,
    metadata: {}
  })

  const recognizePattern = (json: any): PatternInfo => {
    // Reset pattern info
    const patternInfo: PatternInfo = {
      type: 'UNKNOWN',
      confidence: 0,
      metadata: {}
    }

    // Check for DSSE pattern
    if (json.payload && json.payloadType && json.signatures) {
      patternInfo.type = 'DSSE'
      patternInfo.confidence = 0.9
      const metadata: DsseMetadata = {
        payloadType: json.payloadType,
        signatureCount: json.signatures.length,
        signatures: json.signatures.map((sig: any) => ({
          keyid: sig.keyid,
          hasCert: !!sig.cert
        }))
      }

      // Try to decode payload to get additional metadata
      try {
        const decoded = decodeURIComponent(escape(atob(json.payload)))
        const parsed = JSON.parse(decoded)
        if (isInTotoStatement(parsed)) {
          // Extract digest and subject name if available
          if (parsed.subject?.[0]?.digest) {
            metadata.digest = Object.values(parsed.subject[0].digest)[0] as string
          }
          if (parsed.subject?.[0]?.name) {
            metadata.subjectName = parsed.subject[0].name
          }
          // Store the predicate for display
          if (parsed.predicate) {
            metadata.predicate = parsed.predicate
          }
        }
      } catch {
        // If payload decoding fails, keep basic DSSE metadata
      }

      patternInfo.metadata = metadata
    }
    // Check for Sigstore pattern
    else if (json.mediaType && json.mediaType.includes('sigstore.bundle')) {
      patternInfo.type = 'SIGSTORE'
      patternInfo.confidence = 0.9
      patternInfo.metadata = {
        mediaType: json.mediaType,
        tlogEntryCount: json.tlogEntries?.length || 0,
        hasCertificateChain: !!json.verificationMaterial?.x509CertificateChain,
        hasRekorEntry: !!json.tlogEntries?.length,
        hasBundle: true,
        hasProducts: !!json.verificationMaterial?.products
      }
    }
    // Check for direct in-toto pattern
    else if (isInTotoStatement(json)) {
      patternInfo.type = 'INTOTO'
      patternInfo.confidence = 0.95
      const metadata: InTotoMetadata = {
        statementType: json._type,
        subjectCount: json.subject?.length || 0,
        predicateType: json.predicateType,
        predicate: json.predicate
      }

      // Extract subject name and digest if available
      if (json.subject?.[0]) {
        metadata.subjectName = json.subject[0].name
        if (json.subject[0].digest) {
          metadata.digest = Object.values(json.subject[0].digest)[0] as string
        }
      }

      patternInfo.metadata = metadata
    }

    currentPattern.value = patternInfo
    return patternInfo
  }

  const isInTotoStatement = (json: any): boolean => {
    return (
      (json._type === 'https://in-toto.io/Statement/v0.1' || json._type === 'https://in-toto.io/Statement/v1') &&
      Array.isArray(json.subject) &&
      typeof json.predicateType === 'string' &&
      typeof json.predicate === 'object'
    )
  }

  return {
    currentPattern,
    recognizePattern
  }
} 