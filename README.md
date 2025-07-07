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

## Live Demo

The latest version of JSON Viewer is always available at:

� [https://avishayh.github.io/json-viewer](https://avishayh.github.io/json-viewer)

- This is the official GitHub Pages site for this repository.
- The app is always up-to-date with the latest release from the `master` branch.

## Versioned Releases

Every previous release is preserved and can be accessed at:

```
https://avishayh.github.io/json-viewer/v/{version}/
```

For example, to view version `1.9`:

```
https://avishayh.github.io/json-viewer/v/1.9/
```

The latest release is always available at:

```
https://avishayh.github.io/json-viewer/latest/
```

## Release Process

- On every push to `master`, a GitHub Actions workflow builds and deploys the app to GitHub Pages.
- The workflow automatically increments the minor version (e.g., `1.9` → `1.10`) in `version.json`.
- The `latest` folder always contains the most recent release.
- The previous `latest` is backed up to `/v/{version}/` before each new release.
- The `version.json` file is present in the root, `/latest/`, and each `/v/{version}/` folder, and contains the current version in `MAJOR.MINOR` format.

## How Versioning Works

- The version is managed automatically by the release workflow.
- Only the `version` field is present in `version.json`.
- The About popup in the app displays the current version.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

## Contributing

- Clone the repo, make your changes, and open a pull request.
- All changes to `master` are automatically deployed.

[Add contribution guidelines here]

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

## Live Demo

The latest version of JSON Viewer is always available at:

👉 [https://avishayh.github.io/json-viewer](https://avishayh.github.io/json-viewer)

- This is the official GitHub Pages site for this repository.
- The app is always up-to-date with the latest release from the `master` branch.

## Versioned Releases

Every previous release is preserved and can be accessed at:

```
https://avishayh.github.io/json-viewer/v/{version}/
```

For example, to view version `1.9`:

```
https://avishayh.github.io/json-viewer/v/1.9/
```

The latest release is always available at:

```
https://avishayh.github.io/json-viewer/latest/
```

## Release Process

- On every push to `master`, a GitHub Actions workflow builds and deploys the app to GitHub Pages.
- The workflow automatically increments the minor version (e.g., `1.9` → `1.10`) in `version.json`.
- The `latest` folder always contains the most recent release.
- The previous `latest` is backed up to `/v/{version}/` before each new release.
- The `version.json` file is present in the root, `/latest/`, and each `/v/{version}/` folder, and contains the current version in `MAJOR.MINOR` format.

## How Versioning Works

- The version is managed automatically by the release workflow.
- Only the `version` field is present in `version.json`.
- The About popup in the app displays the current version.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

## Contributing

- Clone the repo, make your changes, and open a pull request.
- All changes to `master` are automatically deployed.

[Add contribution guidelines here] 