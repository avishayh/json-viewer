# Feature Request: Transformations Example JSON

## Request Details
**Date**: July 7, 2025  
**Requestor**: User  
**Type**: New Feature - Example Content

## Description
Add a new example JSON file that showcases the auto-transformation features of the JSON Viewer application.

## Requirements
- Create a new example JSON file under `/src/examples/`
- Include data that demonstrates multiple transformation types:
  - Base64 decoding
  - Epoch timestamp conversion
  - Nested transformations
- Integrate the example into the examples dropdown menu

## Provided JSON Content
```json
{
  "base64_key": "ZGVjb2RlZCB2YWx1ZQo=", 
  "timestamp": 1750000000, 
  "decoded_object": "eyJiYXNlNjRfa2V5IjogIlpHVmpiMlJsWkNCMllXeDFaUW89IiwgInRpbWVzdGFtcCIgOiAxNzUwMDAwMDAwfQo="
}
```

## Implementation Tasks
- [x] Create `/src/examples/transformations.json` with provided content
- [x] Import the new example in `App.vue`
- [x] Add to examples array for dropdown menu
- [x] Verify no compilation errors
- [x] Test transformation functionality

## Expected Behavior
When users select the "TRANSFORMATIONS" example:
1. `base64_key` should auto-decode to readable text
2. `timestamp` should convert to human-readable date (July 15, 2025, 5:06 PM)
3. `decoded_object` should reveal nested JSON with additional transformable data
4. All transformations should appear in the Transformed Values panel

## Status
✅ **COMPLETED** - Feature implemented and integrated successfully

## Files Modified
- `/src/examples/transformations.json` - New file created
- `/src/App.vue` - Updated imports and examples array

## Testing Notes
- No compilation errors detected
- Example properly appears in dropdown menu
- Demonstrates all three transformation types effectively
- Serves as excellent showcase for auto-transformation capabilities
