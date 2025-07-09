# Feature Request: Shareable URL with JSON Content

## Request Details
**Date**: July 9, 2025  
**Requestor**: User  
**Type**: New Feature - Sharing/UX

## Description
Enable the application to accept a URL query parameter containing a compressed and URL-safe encoded JSON value, which will be automatically pasted into the main textarea when the page loads. This allows users to share a direct link with pre-filled JSON content, making collaboration and sharing of examples easier. The implementation uses client-side compression (lz-string) for safe and efficient sharing, with robust error handling and user feedback for large or invalid input.

## Requirements
- Parse a query parameter (e.g., ?json=) from the URL on page load.
- If present, decode and paste the JSON value into the main textarea automatically.
- Add a button or option in the top panel to generate a shareable URL containing the current textarea content as a query parameter.
- When generating the URL, compress and encode the JSON using lz-string for URL safety.
- Copy the generated URL to the clipboard for easy sharing.
- The share button is always enabled (unless input is empty); the warning for "JSON too large to share as URL" only appears after clicking the button.
- Robust error handling and user feedback for large or invalid input.
- Handle large JSONs gracefully (size limit for URL length, with user feedback if exceeded).

## Implementation Tasks
- [x] Parse and handle the ?json= query parameter on app load.
- [x] Auto-populate the textarea with the decoded JSON value if present.
- [x] Add a "Share" or "Copy Shareable Link" button to the top panel.
- [x] Implement logic to generate the URL with the current textarea content, using lz-string for compression and encoding.
- [x] Copy the generated URL to the clipboard.
- [x] Add error handling and user feedback for invalid or too-large JSON in the URL (including warning only after clicking share).
- [x] Update documentation and examples as needed.

## Expected Behavior
- When a user opens a URL with ?json= parameter, the textarea is pre-filled with the decoded JSON.
- Clicking the "Share" button generates a compressed, URL-safe link with the current JSON and copies it to the clipboard. If the JSON is too large, a warning is shown after clicking.
- Users can easily share JSON examples with teammates via a single link, with robust error handling and feedback.

## Status
� **COMPLETE** - Feature implemented, tested, and robust against large payloads and invalid input

## Files to Modify
- `/src/App.vue`
- Any relevant components for the top panel or textarea
- Utility files for URL handling and clipboard
- Documentation as needed

## Testing Notes
- Test with various JSON sizes and structures.
- Verify correct encoding/decoding and error handling.
- Confirm clipboard and short URL functionality works across browsers.
