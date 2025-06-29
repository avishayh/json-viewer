# Tasks: Tooltip for Timestamps in Raw JSON Viewer

## 1. Timestamp Detection
- [x] Identify timestamp values in JSON (ISO 8601, Unix epoch)
- [x] Optionally support custom timestamp patterns

## 2. Tooltip Component
- [x] Create or reuse a Tooltip component
- [x] Accept content and position props
- [x] Handle mouse enter/leave events

## 3. Integration with Raw JSON Viewer
- [x] Wrap detected timestamp values in a span or similar element
- [x] Show tooltip with formatted time on mouseover
- [x] Hide tooltip on mouseout

## 4. Formatting User-Friendly Time
- [x] Use a date library (e.g., date-fns, dayjs, or Intl.DateTimeFormat)
- [x] Show both relative (e.g., "2 days ago") and absolute (e.g., "April 27, 2024, 14:32") formats (optional)

## 5. Accessibility
- [ ] Ensure tooltip is accessible (keyboard navigation, ARIA attributes)

## 6. Styling
- [ ] Style tooltip to match app theme
- [ ] Ensure tooltip appears above other content and is not clipped

## 7. Documentation
- [ ] Document supported timestamp formats
- [ ] Add usage instructions for the feature

## 8. Optional Enhancements
- [ ] Allow users to configure preferred date/time format
- [ ] Support localization for different languages/time zones 