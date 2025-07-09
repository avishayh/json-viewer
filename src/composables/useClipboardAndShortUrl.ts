import { compress, compressToBase64, compressToEncodedURIComponent, compressToUTF16, decompress, decompressFromBase64, decompressFromEncodedURIComponent } from 'lz-string'

// Utility for copying text to clipboard
export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    // fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
    } finally {
      document.body.removeChild(textarea)
    }
    return Promise.resolve()
  }
}

export function compressJsonForUrl(json: string): string {
  // Use compressToEncodedURIComponent for safe URL encoding
  return compressToEncodedURIComponent(json)
}

export function decompressJsonFromUrl(compressed: string): string {
  // Use decompressFromEncodedURIComponent for safe URL decoding
  return decompressFromEncodedURIComponent(compressed)
}

export function isCompressedUrlTooLong(json: string, maxLength = 2000): boolean {
  // Compose a fake url to check total length
  const baseUrl = 'https://example.com/?json='
  return (baseUrl.length + compressJsonForUrl(json).length) > maxLength
}
