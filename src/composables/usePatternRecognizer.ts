import { ref, computed } from 'vue'

export type PatternType = 'DSSE' | 'SIGSTORE' | 'UNKNOWN'

export interface PatternInfo {
  type: PatternType
  confidence: number
  metadata: Record<string, any>
}

export function usePatternRecognizer() {
  const currentPattern = ref<PatternInfo>({
    type: 'UNKNOWN',
    confidence: 0,
    metadata: {}
  })

  const recognizePattern = (json: any): PatternInfo => {
    // Reset pattern
    currentPattern.value = {
      type: 'UNKNOWN',
      confidence: 0,
      metadata: {}
    }

    if (!json || typeof json !== 'object') {
      return currentPattern.value
    }

    // Check for DSSE pattern
    if (isDssePattern(json)) {
      currentPattern.value = {
        type: 'DSSE',
        confidence: 1,
        metadata: extractDsseMetadata(json)
      }
      return currentPattern.value
    }

    // Check for Sigstore pattern
    if (isSigstorePattern(json)) {
      currentPattern.value = {
        type: 'SIGSTORE',
        confidence: 1,
        metadata: extractSigstoreMetadata(json)
      }
      return currentPattern.value
    }

    return currentPattern.value
  }

  const isDssePattern = (json: any): boolean => {
    return (
      typeof json === 'object' &&
      'payload' in json &&
      'payloadType' in json &&
      'signatures' in json &&
      Array.isArray(json.signatures)
    )
  }

  const isSigstorePattern = (json: any): boolean => {
    return (
      typeof json === 'object' &&
      'mediaType' in json &&
      typeof json.mediaType === 'string' &&
      json.mediaType.includes('sigstore.bundle')
    )
  }

  const extractDsseMetadata = (json: any): Record<string, any> => {
    return {
      payloadType: json.payloadType,
      signatureCount: json.signatures?.length || 0,
      signatures: json.signatures?.map((sig: any) => ({
        keyid: sig.keyid,
        hasCert: !!sig.cert
      }))
    }
  }

  const extractSigstoreMetadata = (json: any): Record<string, any> => {
    return {
      mediaType: json.mediaType,
      hasVerificationMaterial: !!json.verificationMaterial,
      tlogEntryCount: json.verificationMaterial?.tlogEntries?.length || 0,
      hasCertificateChain: !!json.verificationMaterial?.x509CertificateChain,
      hasTimestamp: !!json.verification?.signedTimestamp
    }
  }

  return {
    currentPattern,
    recognizePattern
  }
} 