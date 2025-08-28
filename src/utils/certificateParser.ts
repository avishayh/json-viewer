import { X509Certificate } from '@peculiar/x509'

export interface CertificateInfo {
  subject: string
  issuer: string
  notBefore: string
  notAfter: string
  isValid: boolean
  keyAlgorithm: string
  keySize: string
  signatureAlgorithm: string
  type: string
  certLength: number
  serialNumber: string
}

export interface ParsedCertificate {
  index: number
  subject: string
  issuer: string
  notBefore: string
  notAfter: string
  isValid: boolean
  keySize: string
  keyAlgorithm: string
  signatureAlgorithm: string
  serialNumber: string
}

export class CertificateParser {
  private debugMode: boolean = true

  constructor(debugMode: boolean = true) {
    this.debugMode = debugMode
  }

  private log(...args: any[]) {
    if (this.debugMode) {
      console.log('[CertificateParser]', ...args)
    }
  }

  private logError(...args: any[]) {
    if (this.debugMode) {
      console.error('[CertificateParser]', ...args)
    }
  }

  /**
   * Parse a base64-encoded certificate using @peculiar/x509
   */
  parseCertificate(certBase64: string, index: number = 0): ParsedCertificate {
    this.log('=== Starting certificate parsing with @peculiar/x509 ===')
    this.log('Certificate index:', index)
    this.log('Certificate length:', certBase64.length)

    if (!certBase64 || certBase64.trim() === '') {
      this.logError('Empty certificate provided')
      return this.createFallbackCertificate(certBase64, index)
    }

    try {
      // Convert base64 to buffer - handle both Node.js and browser environments
      let certBuffer: Uint8Array
      if (typeof Buffer !== 'undefined') {
        // Node.js environment
        certBuffer = Buffer.from(certBase64, 'base64')
      } else {
        // Browser environment - use TextEncoder/TextDecoder
        const binaryString = atob(certBase64)
        certBuffer = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          certBuffer[i] = binaryString.charCodeAt(i)
        }
      }
      this.log('Certificate buffer length:', certBuffer.length)

      // Parse certificate using @peculiar/x509
      const cert = new X509Certificate(certBuffer)
      this.log('Certificate parsed successfully with @peculiar/x509')

      // Check validity
      const now = new Date()
      const isValid = now >= cert.notBefore && now <= cert.notAfter

      this.log('Validity check:', {
        now: now.toISOString(),
        notBefore: cert.notBefore.toISOString(),
        notAfter: cert.notAfter.toISOString(),
        isValid
      })

      // Extract subject and issuer information
      this.log('Raw certificate data:', {
        subject: cert.subject,
        issuer: cert.issuer,
        subjectType: typeof cert.subject,
        issuerType: typeof cert.issuer
      })
      
      const subjectStr = this.formatName(cert.subject)
      const issuerStr = this.formatName(cert.issuer)

      this.log('Name extraction:', {
        subject: subjectStr,
        issuer: issuerStr
      })

      // Extract key information
      const keyAlgorithm = cert.publicKey.algorithm.name
      const keySize = this.getKeySize(cert.publicKey)

      this.log('Key information:', {
        algorithm: keyAlgorithm,
        size: keySize
      })

      const result: ParsedCertificate = {
        index,
        subject: subjectStr,
        issuer: issuerStr,
        notBefore: cert.notBefore.toLocaleString(),
        notAfter: cert.notAfter.toLocaleString(),
        isValid: isValid,
        keySize: keySize,
        keyAlgorithm: keyAlgorithm,
        signatureAlgorithm: cert.signatureAlgorithm.name,
        serialNumber: cert.serialNumber
      }

      this.log('Certificate parsing completed successfully')
      return result

    } catch (error) {
      this.logError('Error parsing certificate:', error)
      return this.createFallbackCertificate(certBase64, index)
    }
  }

  /**
   * Format certificate name (subject or issuer)
   */
  private formatName(name: any): string {
    try {
      // The @peculiar/x509 library returns the name as a string
      if (typeof name === 'string') {
        return name
      }

      // If it's an object, try to extract properties
      const parts = []

      // Extract common name
      if (name.commonName) {
        parts.push(`CN=${name.commonName}`)
      }

      // Extract organization
      if (name.organizationName) {
        parts.push(`O=${name.organizationName}`)
      }

      // Extract organizational unit
      if (name.organizationalUnitName) {
        parts.push(`OU=${name.organizationalUnitName}`)
      }

      // Extract locality
      if (name.localityName) {
        parts.push(`L=${name.localityName}`)
      }

      // Extract state
      if (name.stateOrProvinceName) {
        parts.push(`ST=${name.stateOrProvinceName}`)
      }

      // Extract country
      if (name.countryName) {
        parts.push(`C=${name.countryName}`)
      }

      return parts.length > 0 ? parts.join(', ') : 'Empty Name'
    } catch (error) {
      this.logError('Error formatting name:', error)
      return 'Unknown Name'
    }
  }

  /**
   * Get key size information
   */
  private getKeySize(publicKey: any): string {
    try {
      if (publicKey.algorithm.name === 'RSA') {
        return publicKey.algorithm.modulusLength.toString()
      } else if (publicKey.algorithm.name === 'ECDSA') {
        return publicKey.algorithm.namedCurve || 'Unknown'
      } else {
        return 'Unknown'
      }
    } catch (error) {
      this.logError('Error getting key size:', error)
      return 'Unknown'
    }
  }

  /**
   * Create fallback certificate when parsing fails
   */
  private createFallbackCertificate(_certBase64: string, index: number): ParsedCertificate {
    this.log('Creating fallback certificate due to parsing failure')
    
    return {
      index,
      subject: 'Error parsing certificate',
      issuer: 'Unknown',
      notBefore: 'Unknown',
      notAfter: 'Unknown',
      isValid: false,
      keySize: 'Unknown',
      keyAlgorithm: 'Unknown',
      signatureAlgorithm: 'Unknown',
      serialNumber: 'Unknown'
    }
  }

  /**
   * Parse multiple certificates
   */
  parseCertificates(certificates: string[]): ParsedCertificate[] {
    this.log('Parsing multiple certificates:', certificates.length)
    
    return certificates.map((cert, index) => {
      this.log(`Parsing certificate ${index + 1}/${certificates.length}`)
      return this.parseCertificate(cert, index)
    })
  }
}
