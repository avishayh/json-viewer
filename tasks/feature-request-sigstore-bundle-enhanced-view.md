# Feature Request: Enhanced Sigstore Bundle View with Sub-Tabbed Interface

## Request Details
**Date**: January 27, 2025  
**Requestor**: User  
**Type**: UI/UX Enhancement - Sigstore View Redesign

## Description
Transform the current Sigstore bundle view from a simple layout with navigation buttons to a comprehensive, sub-tabbed interface that displays all relevant information in a single, organized view. The new view will integrate DSSE and In-toto content directly within the Sigstore view using sub-tabs, eliminating the need for navigation buttons and providing a more intuitive user experience with better space utilization.

## Current State Analysis

### Existing Sigstore View Structure
1. **Sigstore Bundle Metadata** section
2. **DSSE Content** button (to be removed)
3. **Verification Material** section

### Current Navigation Flow
- User clicks "View DSSE Content" button
- Navigates to DSSE view
- If In-toto payload detected, shows "View In-toto Statement" button
- User clicks to navigate to In-toto view

## New Enhanced View Structure

### Proposed Sub-Tab Layout
1. **Bundle Metadata** (sub-tab)
   - Media Type, Bundle Version
2. **Verification Material** (sub-tab)
   - Certificate chain, timestamps, verification data
3. **DSSE Envelope** (sub-tab)
   - Payload Type, Signature Count, Signatures details
   - Only shown when DSSE envelope is present
4. **In-toto Statement** (sub-tab)
   - Statement Type, Subject Count, Predicate Type
   - Subjects list with digests
   - Predicate content
   - Only shown when transformations are enabled AND In-toto payload is detected

## Requirements

### Core Functionality
- [x] Remove the "View DSSE Content" button from Sigstore view
- [x] Add collapsible section headers with meaningful titles
- [x] Integrate DSSE metadata and signature information directly in Sigstore view
- [x] Conditionally show In-toto section when transformations are enabled
- [x] Maintain all existing functionality while improving UX
- [x] Ensure proper data flow and state management

### UI/UX Requirements
- [x] **Sub-Tabbed Interface**: Each section is a sub-tab within the main Sigstore tab
- [x] **Space Efficient**: Better utilization of available space compared to collapsible sections
- [x] **Clear Navigation**: Easy switching between different aspects of the Sigstore bundle
- [x] **Visual Indicators**: Clear active tab styling and hover states
- [x] **Responsive Design**: Maintain responsive layout across screen sizes
- [x] **Consistent Styling**: Match existing design patterns and theme

### Sub-Tab-Specific Requirements

#### 1. Bundle Metadata Sub-Tab
- [x] Display current metadata (Media Type, Bundle Version)
- [x] Clean, organized layout with key-value pairs
- [x] Easy to scan and understand

#### 2. Verification Material Sub-Tab
- [x] Display certificate chain, timestamps, verification data
- [x] Organized display of transparency log entries
- [x] Clear presentation of certificate information

#### 3. DSSE Envelope Sub-Tab
- [x] Extract and display DSSE metadata from envelope
- [x] Show payload type, signature count, and signature details
- [x] Only visible when DSSE envelope is present in Sigstore bundle

#### 4. In-toto Statement Sub-Tab
- [x] Parse and display In-toto statement metadata
- [x] Show subjects, predicate type, and predicate content
- [x] Only visible when:
     - Transformations are enabled (transformation toggle is ON)
     - DSSE payload contains In-toto statement
     - Payload type is "application/vnd.in-toto+json"

## Implementation Tasks

### Phase 1: Component Structure
- [x] Update `SigstoreView.vue` with new sub-tabbed layout
- [x] Implement sub-tab state management (active tab)
- [x] Create compact, efficient sub-tab components
- [x] Add smooth tab switching transitions

### Phase 2: DSSE Integration
- [x] Extract DSSE metadata from Sigstore bundle
- [x] Create DSSE section component for Sigstore view
- [x] Integrate DSSE signature display logic
- [x] Handle DSSE payload parsing and display

### Phase 3: In-toto Integration
- [x] Add In-toto detection logic to Sigstore view
- [x] Create In-toto section component for Sigstore view
- [x] Integrate with transformation toggle state
- [x] Handle In-toto payload parsing and display

### Phase 4: State Management
- [x] Implement sub-tab active state management
- [x] Handle conditional sub-tab visibility
- [x] Ensure proper data flow between sub-tabs
- [x] Maintain responsive design across different screen sizes

### Phase 5: UI Polish
- [x] Add visual indicators for active sub-tab states
- [x] Implement clean, organized content layouts
- [x] Ensure consistent styling with existing components
- [x] Add responsive design considerations

## Technical Implementation Details

### New Components to Create
1. **`SigstoreDsseSection.vue`**
   - DSSE-specific sub-tab content for Sigstore view
   - Extracts DSSE metadata from Sigstore bundle
   - Displays payload type, signature count, signatures

2. **`SigstoreInTotoSection.vue`**
   - In-toto-specific sub-tab content for Sigstore view
   - Conditionally rendered based on transformation toggle
   - Displays In-toto statement metadata and content

### Data Flow
```
Sigstore Bundle → Extract DSSE Envelope → Parse In-toto Payload → Display Sections
```

### State Management
- Sub-tab active state managed locally
- Transformation toggle state affects In-toto sub-tab visibility
- DSSE envelope presence determines DSSE sub-tab visibility

## Expected Behavior

### Default State
- Bundle Metadata sub-tab active by default
- DSSE sub-tab only visible when DSSE envelope present
- In-toto sub-tab only visible when transformations enabled AND In-toto payload detected

### User Interactions
- Click sub-tab to switch between different aspects of the Sigstore bundle
- Smooth transitions during tab switching
- Clear visual indication of active sub-tab

### Conditional Rendering
- DSSE sub-tab: Only when `json.dsseEnvelope` or `json.content.dsseEnvelope` exists
- In-toto sub-tab: Only when transformations enabled AND DSSE payload type is In-toto
- Verification Material sub-tab: Always visible when verification material exists

## Success Criteria
- [x] No navigation buttons required to view DSSE or In-toto content
- [x] All relevant information visible in single, organized view
- [x] Efficient sub-tabbed interface with better space utilization
- [x] Proper conditional rendering based on content and settings
- [x] Maintains all existing functionality
- [x] Responsive design across different screen sizes
- [x] Consistent with existing UI patterns and theme

## Files to Modify
- `src/components/PatternTabs/SigstoreView.vue` - Main implementation with sub-tabbed interface
- `src/components/SigstoreDsseSection.vue` - DSSE sub-tab content component
- `src/components/SigstoreInTotoSection.vue` - In-toto sub-tab content component
- Any relevant composables for state management

## Testing Notes
- [x] Test with various Sigstore bundle structures
- [x] Verify DSSE sub-tab appears/disappears correctly
- [x] Test In-toto sub-tab with transformation toggle on/off
- [x] Verify sub-tab switching functionality
- [x] Test responsive design on different screen sizes
- [x] Test with large content in sub-tabs

## Future Enhancements
- [ ] Sub-tab-specific search/filter functionality
- [ ] Export individual sub-tab content
- [ ] Custom sub-tab ordering
- [ ] Sub-tab-specific settings and preferences

---

## Recent Improvements (January 27, 2025)

### Major UX Enhancement
1. **Sub-Tabbed Interface**: Replaced collapsible sections with sub-tabs for better space utilization and cleaner navigation
2. **Improved Space Efficiency**: Much better use of available space compared to collapsible sections
3. **Cleaner Navigation**: Easy switching between different aspects of the Sigstore bundle
4. **Enhanced Content Organization**: Each sub-tab focuses on a specific aspect of the data

### Technical Improvements
- Implemented efficient sub-tab state management
- Enhanced DSSE and In-toto component layouts for tabbed interface
- Improved responsive design for better content density
- Maintained all existing functionality while improving UX

---
**Status**: ✅ **COMPLETE** - Feature implemented and tested  
**Priority**: High - Improves core user experience  
**Estimated Effort**: Medium - Significant UI restructuring required
