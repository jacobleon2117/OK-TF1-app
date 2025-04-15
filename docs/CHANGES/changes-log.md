# Changelog

All notable changes to this project will be documented in this file.

## [NEXT STEPS] - Upcoming

### Role-Based Access Implementation
- Implement role-based permissions in Schedule screen using roleUtils
- Add conditional rendering based on user permissions
- Create shift creation form for coordinator users only
- Filter shifts display based on user role

### Firebase Integration 
- Complete createShift function implementation in shiftUtils.ts
- Add robust error handling for database operations
- Implement real-time updates for shift changes

### UI Enhancements
- Add visual indicators for days with scheduled shifts on the calendar
- Create shift detail view modal for selected shifts
- Add proper loading states and error messages

### Utilities Framework Completion
- Implement MessagesScreen utilities (messageDataUtils, conversationUtils)
- Implement MissionReportScreen utilities (reportDataUtils, reportFilterUtils)
- Apply business logic separation pattern to all screens

### Testing & Documentation
- Test role-based access with different user accounts
- Document role permission system for team reference
- Improve inline code documentation for utility functions

## [2025-04-09] - Jacob Leon

### Added
- Created utility folders structure for screen-specific business logic
- Added profileUtils with separated settings, data and UI functions
- Added roleUtils for role-based permissions in the scheduling screen
- Comprehensive navigation type declarations for React Navigation
- Updated TypeScript configuration for better module resolution
- Created enhanced type safety for navigation across screens
- Improved type declarations in `@types` folder
- Added module augmentation for React Navigation types

### Changed
- Refactored Profile screen to use utility functions
- Refactored navigation type imports in screen components
- Updated Babel configuration to support path aliases
- Modified `tsconfig.json` to improve TypeScript module resolution
- Updated React Navigation type declarations

### Fixed
- Separated business logic from UI components for better maintainability
- Established role-based access control framework
- Resolved TypeScript errors in navigation type imports
- Corrected module resolution for React Navigation types
- Fixed type safety issues in navigation prop usage
- Improved type declarations for screen navigation

### Comments
- Enhanced type safety and developer experience for navigation
- Established consistent typing approach for React Navigation
- Simplified navigation type imports across the application
- Improved overall TypeScript configuration for the project
- Created foundation for role-based access control

## [2025-04-01] - Jacob Leon

### Added
- Created new folder structure `/src/services/firebase/` for better organization
- Added new TypeScript file `/src/services/firebase/auth.ts` for authentication services
- Created/Updated documentation files:
  - README.md
  - FIREBASE-SETUP.md
  - CONTRIBUTING.md
  - DB-MAPPING.md
  - CHANGELOG.md
  - INSTALLATION.md

### Changed
- Changed file extension for `firebase.js` to `firebase.ts`
- Moved `firebase.ts` to `/src/services/firebase/firebase.ts`
- Updated `src/config/firebase.ts` to initialize and export Firestore db

### Fixed
- Established proper file organization for future development

### Comments
- This restructuring creates a more maintainable TypeScript codebase
- The new documentation establishes clear workflow and standards for the team
- The file extension change helps with TypeScript integration