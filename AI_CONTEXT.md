# AI Context - JSON Viewer Project

## Project Overview
**Purpose**: A specialized JSON viewer tool designed for developers working with JFrog's Evidence Service and supply chain security attestations.

**Target Users**: Development teams working with JFrog Artifactory's Evidence Service for supply chain security.

**Current State**: Standalone web application with GitHub Pages deployment for team sharing.

## Technical Architecture

### Core Technologies
- **Frontend**: Vue 3 with Composition API + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Custom Properties (CSS Variables) for theming
- **Date Handling**: Day.js
- **JSON Display**: vue-json-pretty

### Key Components Structure
```
src/
├── App.vue (Main application container)
├── composables/
│   ├── patternRecognizer.ts (Detects DSSE/Sigstore/In-toto patterns)
│   ├── useHistory.ts (Manages localStorage history)
│   ├── useJsonProcessor.ts (Handles JSON parsing and transformations)
│   └── useTheme.ts (Dark/light theme management)
├── components/
│   ├── HistorySidebar.vue (Left sidebar with recent JSONs)
│   ├── TransformedValuesPanel.vue (Shows automatic transformations)
│   ├── PatternTabs/ (Tab system for different views)
│   │   ├── PatternTabs.vue (Tab container)
│   │   ├── DsseView.vue (DSSE-specific view)
│   │   ├── SigstoreView.vue (Sigstore-specific view)
│   │   ├── InTotoView.vue (In-toto-specific view)
│   │   └── RawJsonView.vue (Raw JSON display)
│   └── [other components]
└── examples/ (Sample JSON files)
```

## Pattern Recognition System

### Supported Patterns
1. **DSSE (Dead Simple Signing Envelope)**
   - Detection: `json.payload && json.payloadType && json.signatures`
   - Metadata: payloadType, signature count, decoded payload info
   - Confidence: 0.9

2. **Sigstore**
   - Detection: `json.mediaType && json.mediaType.includes('sigstore.bundle')`
   - Metadata: verification material, certificates, timestamps
   - Confidence: 0.9

3. **In-toto**
   - Detection: `json._type === 'https://in-toto.io/Statement/v0.1|v1'`
   - Metadata: statement type, subjects, predicates
   - Confidence: 0.95

### Automatic Transformations
- **Base64 Decoding**: Detects and decodes base64-encoded strings
- **Epoch Timestamps**: Converts Unix timestamps to human-readable dates
- **JSON Parsing**: Attempts to parse stringified JSON within values

## Features Implemented

### Core Features
- [x] JSON parsing and validation
- [x] Pattern recognition for security attestation formats
- [x] Automatic payload decoding (base64)
- [x] Timestamp transformation (epoch to human-readable)
- [x] History management (20 items, localStorage)
- [x] Dark/light theme toggle
- [x] Transformed values panel
- [x] Copy to clipboard functionality

### UI/UX Features
- [x] Tabbed interface for different views
- [x] Responsive sidebar with history
- [x] Interactive tooltips for timestamps
- [x] Example JSON loading (moved to dropdown menu)
- [x] Path highlighting for transformed values
- [x] Clean, modern interface

### Development & Deployment
- [x] GitHub Actions CI/CD pipeline
- [x] GitHub Pages deployment
- [x] Version tracking (version.json)
- [x] TypeScript type safety
- [x] Vite build optimization

## Recent Changes Made
1. **UI Improvement**: Moved example buttons from main content area to a discrete dropdown menu in the header
2. **Space Optimization**: Freed up prime real estate in the main interface
3. **Better UX**: Examples now accessible via file icon dropdown

## Current Limitations & Future Opportunities

### Current Limitations
- Standalone tool (no backend integration)
- Manual JSON input only (paste-based)
- Limited to client-side processing
- No authentication/authorization

### Future Integration Possibilities
- **JFrog Artifactory Integration**: Direct connection to Evidence Service APIs
- **Authentication**: Support for JFrog access tokens
- **Real-time Data**: Fetch attestations directly from repositories
- **Validation**: Server-side verification of signatures and attestations

## Development Notes

### File Structure Insights
- `patternRecognizer.ts`: Core intelligence for detecting security attestation formats
- `useJsonProcessor.ts`: Handles all JSON transformations and parsing logic
- `useHistory.ts`: Manages persistent storage of recent JSON documents
- Examples in `/examples/` provide realistic test data for each supported format

### Key Code Patterns
- Composition API used throughout for better code organization
- WeakMap used for storing original values (memory efficient)
- Reactive refs for state management
- CSS custom properties for consistent theming

### Deployment
- GitHub Actions workflow publishes to GitHub Pages
- Single-file build option available via vite-plugin-singlefile
- Version tracking through version.json for user feedback

## Questions for Continued Development
1. Priority features for JFrog integration
2. Authentication requirements for Artifactory access
3. Specific Evidence Service APIs to target
4. Team collaboration features needed
5. Additional security attestation formats to support

## User Instructions & Preferences
⚠️ **IMPORTANT**: Every time the user asks for a new feature, document the request in the `/tasks/` folder with:
- Feature request details
- Implementation requirements
- Status tracking
- Files modified
- Testing notes

## Development Environment
- Node.js + npm
- Vite dev server with HMR
- TypeScript compilation
- Vue 3 development tools recommended

## Development Workflow Notes
- **Vite Dev Server**: Use `npm run dev` only once - Vite automatically reloads on file changes
- **No Need for Multiple Instances**: Avoid running multiple `npm run dev` commands as it creates unnecessary port conflicts
- **Hot Reload**: Vite provides instant hot reload when files are saved, no need to restart the server
