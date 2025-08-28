# Feature Request: Enhanced Certificate Parsing for Sigstore View

## Overview
Currently, the Certificates tab in the Sigstore view shows basic certificate information (type, length, base64 data). This task aims to implement proper X.509 certificate parsing to display human-readable certificate details.

## Current State
- ✅ Certificates tab added to Sigstore view
- ✅ Basic certificate detection (supports both certificate chains and single certificates)
- ✅ Visual certificate chain display with type indicators
- ❌ **No actual certificate parsing** - shows placeholder data
- ❌ **Misleading validation status** - hardcoded as "Valid" without verification

## Target State
Display human-readable certificate information like:
```
Subject: CN=github.com, O=GitHub, Inc., L=San Francisco, ST=California, C=US
Issuer: CN=DigiCert Inc, O=DigiCert Inc, C=US
Valid From: Jan 15, 2024 10:53:55 UTC
Valid Until: Jan 15, 2025 11:03:55 UTC
Key Algorithm: RSA 2048-bit
Signature Algorithm: SHA256 with RSA
Status: ⚠️ Expired (if applicable) or ✅ Valid (if verified)
```

## Technical Challenges
1. **DER Format Parsing**: Certificates are in binary DER format, not text PEM
2. **ASN.1 Structure**: Need to parse complex ASN.1 certificate structure
3. **Browser Limitations**: Limited crypto APIs for certificate parsing
4. **Performance**: Certificate parsing can be computationally expensive

## Implementation Options

### Option 1: Use Certificate Parsing Library
- **Library**: `node-forge`, `pkijs`, or similar
- **Pros**: Robust parsing, handles all certificate formats
- **Cons**: Additional bundle size, dependency management

### Option 2: Web Crypto API + Manual Parsing
- **Approach**: Use `crypto.subtle.importKey()` for basic operations
- **Pros**: Native browser API, no dependencies
- **Cons**: Limited to basic operations, complex ASN.1 parsing needed

### Option 3: Hybrid Approach
- **Basic Info**: Use Web Crypto API for dates and basic validation
- **Advanced Info**: Use library for full certificate details
- **Pros**: Balance of performance and functionality
- **Cons**: More complex implementation

## Implementation Plan

### Phase 1: Basic Certificate Parsing
1. **Add certificate parsing library** (recommend `node-forge`)
2. **Implement DER to PEM conversion**
3. **Extract basic fields**: Subject, Issuer, Validity dates
4. **Remove misleading validation status**

### Phase 2: Enhanced Validation
1. **Date validation**: Check if certificate is currently valid
2. **Basic signature verification**: Verify certificate signature
3. **Chain validation**: Verify certificate chain integrity
4. **Algorithm validation**: Check for weak algorithms

### Phase 3: Advanced Features
1. **Subject Alternative Names**: Display DNS names, IP addresses
2. **Certificate policies**: Show OIDs and policy names
3. **Key usage**: Display permitted key operations
4. **Revocation checking**: Basic CRL/OCSP support

## Files to Modify
- `src/components/PatternTabs/SigstoreView.vue` - Certificate parsing logic
- `package.json` - Add certificate parsing dependency
- `vite.config.ts` - Configure library bundling

## Success Criteria
- [ ] Certificates display human-readable Subject/Issuer information
- [ ] Validity dates are shown in readable format
- [ ] Validation status reflects actual certificate state
- [ ] No misleading "Valid" indicators without verification
- [ ] Performance remains acceptable (< 500ms parsing time)

## Testing
- Test with Sigstore example (single certificate)
- Test with certificate chains (multiple certificates)
- Test with expired certificates
- Test with invalid certificates
- Test performance with large certificate chains

## Notes
- Consider lazy loading certificate parsing to improve initial load time
- Add error handling for malformed certificates
- Consider caching parsed certificate data
- Ensure accessibility for certificate information display
