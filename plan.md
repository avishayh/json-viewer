# Feature Plan: Epoch Timestamp Transform to Human-Readable Format

## 1. Goal
Add a transform option that detects Unix epoch timestamps (10 or 13 digit numbers) in JSON values and converts them to a human-readable date/time format. When a value is transformed, it should be added to the Transformed Values panel on the right, similar to how base64 transforms are handled.

---

## 2. Requirements
- Detect Unix epoch timestamps (seconds or milliseconds) in JSON values.
- Transform detected epoch values to a human-readable date/time string (e.g., "2024-06-29 17:00:41").
- Add each transformation to the Transformed Values panel, showing the original and transformed value.
- Do not affect other transforms (e.g., base64, JSON string) or interfere with the raw view.
- Allow for easy extension to support other timestamp formats in the future.

---

## 3. Implementation Steps

a. **Epoch Detection and Transformation**
- Enhance the value processing logic to detect 10/13 digit numbers as epoch timestamps.
- Convert detected values to a formatted date/time string using a date library (e.g., dayjs).

b. **Integration with Transformed Values Panel**
- When a value is transformed, add an entry to the Transformed Values panel, including the path, type ("Epoch"), original value, and transformed value.

c. **UI/UX**
- Clearly indicate in the Transformed Values panel which values were transformed from epoch timestamps.
- Ensure the transformation does not affect the original JSON structure in the raw view.

---

## 4. Documentation
- Document the new transform type and how it appears in the UI.
- Add usage instructions for the feature.

---

## 5. Optional Enhancements
- Allow users to configure the date/time format.
- Support additional timestamp formats (e.g., ISO 8601) in the future. 