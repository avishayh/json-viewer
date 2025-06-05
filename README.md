# JSON Viewer

A modern web-based JSON viewer built with Vite and TypeScript that provides an intuitive interface for viewing and interacting with JSON data. Specifically designed for working with DSSE (Dead Simple Signing Envelope) and In-toto specifications.

## Features

- Clean and modern user interface
- Real-time JSON data visualization
- Automatic base64 decoding of encoded fields
- Specialized support for DSSE and In-toto specifications
- Version tracking through `version.json`
- Built with TypeScript for type safety
- Fast development server with hot module replacement
- History panel with persistent storage
  - Stores up to 20 recent JSON entries
  - Individual item deletion
  - Automatic loading of previous entries
  - Clear all history option
  - Persists across page reloads

## Use Cases

This viewer is particularly useful for:
- Viewing and validating DSSE envelopes
- Working with In-toto attestations and metadata
- Decoding base64-encoded payloads automatically
- Inspecting signed metadata and attestations
- Maintaining a history of recently viewed JSON documents

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd json-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

This project uses:
- Vite for fast development and building
- TypeScript for type safety
- Modern web technologies for optimal performance
- Local Storage for persistent data
- Vue.js for reactive UI components

## Version Control

The project maintains version information in `version.json`, which tracks:
- Current version number
- Last update timestamp

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here] 