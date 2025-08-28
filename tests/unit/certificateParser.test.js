#!/usr/bin/env node

/**
 * Unit Tests for Certificate Parser
 * Run with: node tests/unit/certificateParser.test.js
 * 
 * This follows Node.js testing best practices:
 * - Tests are in tests/unit/ directory
 * - Uses fixtures from tests/fixtures/
 * - Clear test descriptions and assertions
 * - Proper error handling
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { X509Certificate } from '@peculiar/x509';
import { TEST_CERTIFICATES, EXPECTED_RESULTS } from '../fixtures/certificates.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CertificateParserV3 {
  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }

  parseCertificate(certBase64, index) {
    if (!certBase64 || certBase64.trim() === '') {
      return this.createFallbackCertificate(certBase64, index);
    }

    try {
      // Convert base64 to buffer
      const certBuffer = Buffer.from(certBase64, 'base64');
      
      // Parse certificate using @peculiar/x509
      const cert = new X509Certificate(certBuffer);
      
      if (this.debugMode) {
        console.log('Certificate parsed successfully');
        console.log('Subject:', cert.subject);
        console.log('Issuer:', cert.issuer);
        console.log('Valid from:', cert.notBefore);
        console.log('Valid to:', cert.notAfter);
        console.log('Serial number:', cert.serialNumber);
        console.log('Public key algorithm:', cert.publicKey.algorithm.name);
      }
      
      // Check validity
      const now = new Date();
      const isValid = now >= cert.notBefore && now <= cert.notAfter;
      
      // Extract subject and issuer information
      const subjectStr = this.formatName(cert.subject);
      const issuerStr = this.formatName(cert.issuer);
      
      // Extract key information
      const keyAlgorithm = cert.publicKey.algorithm.name;
      const keySize = this.getKeySize(cert.publicKey);
      

      
      return {
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
      };
    } catch (error) {
      console.error('Error parsing certificate:', error.message);
      return this.createFallbackCertificate(certBase64, index);
    }
  }

  formatName(name) {
    try {
      // The @peculiar/x509 library returns the name as a string
      if (typeof name === 'string') {
        return name;
      }

      // If it's an object, try to extract properties
      const parts = [];

      // Extract common name
      if (name.commonName) {
        parts.push(`CN=${name.commonName}`);
      }

      // Extract organization
      if (name.organizationName) {
        parts.push(`O=${name.organizationName}`);
      }

      // Extract organizational unit
      if (name.organizationalUnitName) {
        parts.push(`OU=${name.organizationalUnitName}`);
      }

      // Extract locality
      if (name.localityName) {
        parts.push(`L=${name.localityName}`);
      }

      // Extract state
      if (name.stateOrProvinceName) {
        parts.push(`ST=${name.stateOrProvinceName}`);
      }

      // Extract country
      if (name.countryName) {
        parts.push(`C=${name.countryName}`);
      }

      return parts.length > 0 ? parts.join(', ') : 'Empty Name';
    } catch (error) {
      console.error('Error formatting name:', error.message);
      return 'Unknown Name';
    }
  }

  getKeySize(publicKey) {
    try {
      if (publicKey.algorithm.name === 'RSA') {
        return publicKey.algorithm.modulusLength.toString();
      } else if (publicKey.algorithm.name === 'ECDSA') {
        return publicKey.algorithm.namedCurve || 'Unknown';
      } else {
        return 'Unknown';
      }
    } catch (error) {
      return 'Unknown';
    }
  }

  createFallbackCertificate(certBase64, index) {
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
    };
  }

  parseCertificates(certificates) {
    return certificates.map((cert, index) => this.parseCertificate(cert, index));
  }
}

// Test suite
class CertificateParserTestSuite {
  constructor() {
    this.parser = new CertificateParserV3(false); // No debug output for tests
    this.results = [];
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('=== Certificate Parser Unit Tests ===\n');
    
    // Test individual certificates
    await this.testGitHubActionsCertificate();
    await this.testSigstoreCertificate();
    
    // Test multiple certificates
    await this.testMultipleCertificates();
    
    // Test error handling
    await this.testErrorHandling();
    
    // Test Sigstore example from file
    await this.testSigstoreExampleFromFile();
    
    this.printTestSummary();
    return this.results;
  }

  /**
   * Test GitHub Actions certificate
   */
  async testGitHubActionsCertificate() {
    console.log('--- Test 1: GitHub Actions Certificate ---');
    
    try {
      const cert = TEST_CERTIFICATES.githubActions;
      const expected = EXPECTED_RESULTS.githubActions;
      
      const result = this.parser.parseCertificate(cert, 0);
      
      // Assertions
      const assertions = [
        { name: 'Subject', actual: result.subject, expected: expected.subject },
        { name: 'Issuer', actual: result.issuer, expected: expected.issuer },
        { name: 'Key Algorithm', actual: result.keyAlgorithm, expected: expected.keyAlgorithm },
        { name: 'Key Size', actual: result.keySize, expected: expected.keySize },
        { name: 'Signature Algorithm', actual: result.signatureAlgorithm, expected: expected.signatureAlgorithm },
        { name: 'Serial Number', actual: result.serialNumber, expected: expected.serialNumber }
      ];
      
      let passed = 0;
      let total = assertions.length;
      
      assertions.forEach(assertion => {
        const isMatch = assertion.actual === assertion.expected;
        if (isMatch) {
          passed++;
          console.log(`  ✅ ${assertion.name}: ${assertion.actual}`);
        } else {
          console.log(`  ❌ ${assertion.name}: Expected "${assertion.expected}", got "${assertion.actual}"`);
        }
      });
      
      const success = passed === total;
      this.addTestResult('GitHub Actions Certificate', success, {
        passed,
        total,
        assertions
      });
      
    } catch (error) {
      this.addTestResult('GitHub Actions Certificate', false, { error: error.message });
    }
  }

  /**
   * Test Sigstore certificate
   */
  async testSigstoreCertificate() {
    console.log('\n--- Test 2: Sigstore Certificate ---');
    
    try {
      const cert = TEST_CERTIFICATES.sigstore;
      const expected = EXPECTED_RESULTS.sigstore;
      
      const result = this.parser.parseCertificate(cert, 0);
      
      // Assertions
      const assertions = [
        { name: 'Subject', actual: result.subject, expected: expected.subject },
        { name: 'Issuer', actual: result.issuer, expected: expected.issuer },
        { name: 'Key Algorithm', actual: result.keyAlgorithm, expected: expected.keyAlgorithm },
        { name: 'Key Size', actual: result.keySize, expected: expected.keySize },
        { name: 'Signature Algorithm', actual: result.signatureAlgorithm, expected: expected.signatureAlgorithm },
        { name: 'Serial Number', actual: result.serialNumber, expected: expected.serialNumber }
      ];
      
      let passed = 0;
      let total = assertions.length;
      
      assertions.forEach(assertion => {
        const isMatch = assertion.actual === assertion.expected;
        if (isMatch) {
          passed++;
          console.log(`  ✅ ${assertion.name}: ${assertion.actual}`);
        } else {
          console.log(`  ❌ ${assertion.name}: Expected "${assertion.expected}", got "${assertion.actual}"`);
        }
      });
      
      const success = passed === total;
      this.addTestResult('Sigstore Certificate', success, {
        passed,
        total,
        assertions
      });
      
    } catch (error) {
      this.addTestResult('Sigstore Certificate', false, { error: error.message });
    }
  }

  /**
   * Test multiple certificates
   */
  async testMultipleCertificates() {
    console.log('\n--- Test 3: Multiple Certificates ---');
    
    try {
      const certificates = [TEST_CERTIFICATES.githubActions, TEST_CERTIFICATES.sigstore];
      const results = this.parser.parseCertificates(certificates);
      
      const success = results.length === 2 && 
                     results.every(cert => cert.subject !== 'Error parsing certificate');
      
      console.log(`  Found ${results.length} certificates`);
      results.forEach((cert, index) => {
        console.log(`  Certificate ${index + 1}: ${cert.issuer}`);
      });
      
      this.addTestResult('Multiple Certificates', success, {
        certificateCount: results.length,
        certificates: results.map(c => ({ issuer: c.issuer, subject: c.subject }))
      });
      
    } catch (error) {
      this.addTestResult('Multiple Certificates', false, { error: error.message });
    }
  }

  /**
   * Test error handling
   */
  async testErrorHandling() {
    console.log('\n--- Test 4: Error Handling ---');
    
    try {
      // Test empty certificate
      const emptyResult = this.parser.parseCertificate('', 0);
      const emptySuccess = emptyResult.subject === 'Error parsing certificate';
      
      // Test invalid certificate
      const invalidResult = this.parser.parseCertificate('invalid-data', 0);
      const invalidSuccess = invalidResult.subject === 'Error parsing certificate';
      
      const success = emptySuccess && invalidSuccess;
      
      console.log(`  Empty certificate handling: ${emptySuccess ? '✅' : '❌'}`);
      console.log(`  Invalid certificate handling: ${invalidSuccess ? '✅' : '❌'}`);
      
      this.addTestResult('Error Handling', success, {
        emptySuccess,
        invalidSuccess
      });
      
    } catch (error) {
      this.addTestResult('Error Handling', false, { error: error.message });
    }
  }

  /**
   * Test Sigstore example from file
   */
  async testSigstoreExampleFromFile() {
    console.log('\n--- Test 5: Sigstore Example from File ---');
    
    try {
      const sigstoreExamplePath = path.join(__dirname, '..', '..', 'src', 'examples', 'sigstore.json');
      const sigstoreExample = JSON.parse(fs.readFileSync(sigstoreExamplePath, 'utf8'));
      
      const verificationMaterial = sigstoreExample.verificationMaterial;
      const certificates = [];
      
      if (verificationMaterial.certificate?.rawBytes) {
        certificates.push(verificationMaterial.certificate.rawBytes);
      }
      
      if (certificates.length === 0) {
        this.addTestResult('Sigstore Example from File', false, { error: 'No certificates found' });
        return;
      }
      
      const results = this.parser.parseCertificates(certificates);
      
      const success = results.length === 1 && 
                     results[0].issuer.includes('sigstore.dev') &&
                     results[0].keyAlgorithm === 'ECDSA';
      
      console.log(`  Found ${results.length} certificate(s)`);
      if (results.length > 0) {
        console.log(`  Issuer: ${results[0].issuer}`);
        console.log(`  Algorithm: ${results[0].keyAlgorithm}`);
        console.log(`  Serial: ${results[0].serialNumber}`);
      }
      
      this.addTestResult('Sigstore Example from File', success, {
        certificateCount: results.length,
        issuer: results[0]?.issuer,
        algorithm: results[0]?.keyAlgorithm,
        serialNumber: results[0]?.serialNumber
      });
      
    } catch (error) {
      this.addTestResult('Sigstore Example from File', false, { error: error.message });
    }
  }

  /**
   * Add test result
   */
  addTestResult(testName, passed, details) {
    const result = {
      testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    };
    
    this.results.push(result);
    
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}`);
  }

  /**
   * Print test summary
   */
  printTestSummary() {
    console.log('\n=== Test Summary ===');
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log('\nFailed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  - ${r.testName}: ${JSON.stringify(r.details)}`);
        });
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Certificate Parser Unit Tests');
    console.log('');
    console.log('Usage:');
    console.log('  node tests/unit/certificateParser.test.js          # Run all tests');
    console.log('  node tests/unit/certificateParser.test.js --help   # Show this help');
    console.log('');
    console.log('Tests included:');
    console.log('  - GitHub Actions Certificate parsing');
    console.log('  - Sigstore Certificate parsing');
    console.log('  - Multiple certificates handling');
    console.log('  - Error handling');
    console.log('  - Sigstore example from file');
    return;
  }
  
  const testSuite = new CertificateParserTestSuite();
  await testSuite.runAllTests();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  CertificateParserV3,
  CertificateParserTestSuite
};
