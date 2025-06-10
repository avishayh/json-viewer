import { ref, computed } from 'vue'

export type PatternType = 'DSSE' | 'SIGSTORE' | 'INTOTO' | 'UNKNOWN'

export interface PatternInfo {
  type: PatternType
  confidence: number
  metadata: {
    // DSSE specific
    payloadType?: string
    signatureCount?: number
    // Sigstore specific
    mediaType?: string
    tlogEntryCount?: number
    hasCertificateChain?: boolean
    hasTimestamp?: boolean
    hasVerificationMaterial?: boolean
    // In-toto specific
    statementType?: string
    subjectCount?: number
    predicateType?: string
    hasMaterials?: boolean
    hasProducts?: boolean
  }
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
      patternInfo.metadata = {
        payloadType: json.payloadType,
        signatureCount: json.signatures.length
      }

      // Check if DSSE contains in-toto
      try {
        const decoded = decodeURIComponent(escape(atob(json.payload)))
        const parsed = JSON.parse(decoded)
        if (isInTotoStatement(parsed)) {
          // Keep DSSE as the primary type, but add in-toto metadata
          patternInfo.metadata = {
            ...patternInfo.metadata,
            statementType: parsed._type,
            subjectCount: parsed.subject?.length || 0,
            predicateType: parsed.predicateType,
            hasMaterials: !!parsed.predicate?.materials,
            hasProducts: !!parsed.predicate?.products
          }
        }
      } catch {
        // If payload decoding fails, keep DSSE pattern
      }
    }
    // Check for Sigstore pattern
    else if (json.mediaType && json.mediaType.includes('sigstore.bundle')) {
      patternInfo.type = 'SIGSTORE'
      patternInfo.confidence = 0.9
      patternInfo.metadata = {
        mediaType: json.mediaType,
        tlogEntryCount: json.tlogEntries?.length || 0,
        hasCertificateChain: !!json.verificationMaterial?.x509CertificateChain,
        hasTimestamp: !!json.verificationMaterial?.timestampVerificationData,
        hasVerificationMaterial: !!json.verificationMaterial
      }
    }
    // Check for direct in-toto pattern
    else if (isInTotoStatement(json)) {
      patternInfo.type = 'INTOTO'
      patternInfo.confidence = 0.95
      patternInfo.metadata = {
        statementType: json._type,
        subjectCount: json.subject?.length || 0,
        predicateType: json.predicateType,
        hasMaterials: !!json.predicate?.materials,
        hasProducts: !!json.predicate?.products
      }
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