# Test Documentation

This directory contains all tests for the JSON Viewer application, organized following Node.js best practices.

## Directory Structure

```
tests/
├── README.md                    # This file
├── fixtures/                    # Test data and certificates
│   └── certificates.js         # Certificate test data
├── unit/                       # Unit tests
│   └── certificateParser.test.js # Certificate parser unit tests
└── integration/                # Integration tests (future)
```

## Running Tests

### Unit Tests

```bash
# Run certificate parser unit tests
node tests/unit/certificateParser.test.js

# Show help
node tests/unit/certificateParser.test.js --help
```

### Browser Tests

Open the browser console and run:

```javascript
// Test the certificate parser with provided certificates
testProvidedCertificates()

// Test with Sigstore example
showSigstoreExampleExpectedOutcome()

// Run all browser tests
runCertificateParserTests()
```

## Test Data

Test certificates are stored in `tests/fixtures/certificates.js`:

- **GitHub Actions Certificate**: Docker workflow certificate
- **Sigstore Certificate**: Your example certificate

## Test Results

The certificate parser should correctly parse:

✅ **Sigstore Certificate:**
- Issuer: `O=sigstore.dev, CN=sigstore-intermediate`
- Key Algorithm: `ECDSA`
- Key Size: `P-256`
- Signature Algorithm: `ECDSA`
- Serial Number: `7f781b85fe0470c1ae4d8adaf343888441804421`

✅ **GitHub Actions Certificate:**
- Issuer: `O=GitHub, Inc., CN=Fulcio Intermediate l2`
- Key Algorithm: `ECDSA`
- Key Size: `P-256`
- Signature Algorithm: `ECDSA`

## Best Practices

1. **Test Organization**: Tests are organized by type (unit, integration)
2. **Fixtures**: Test data is separated from test logic
3. **Clear Descriptions**: Each test has a clear description
4. **Assertions**: Tests include proper assertions and error handling
5. **Cross-Platform**: Tests work in both Node.js and browser environments
