# Tasks: Epoch Timestamp Transform to Human-Readable Format

## 1. Epoch Detection and Transformation
- [x] Detect Unix epoch timestamps (10/13 digit numbers) in JSON values
- [x] Convert detected epoch values to human-readable date/time using a date library

## 2. Integration with Transformed Values Panel
- [x] Add transformed epoch values to the Transformed Values panel (path, type, original, transformed)
- [x] Ensure base64 and other transforms still work as before

## 3. UI/UX
- [x] Clearly indicate "Epoch" type in the Transformed Values panel
- [x] Do not affect the raw JSON view

## 4. Documentation
- [ ] Document the new transform type and its appearance in the UI
- [ ] Add usage instructions for the feature

## 5. Optional Enhancements
- [ ] Allow users to configure the date/time format
- [ ] Support additional timestamp formats in the future 