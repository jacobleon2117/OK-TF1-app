# Add any changes here.

## Make sure to document your name, current date, and what you changed in this branch.

## [2025-04-06] - Jacob Leon

### Added
- Created new folder structure /src/services/firebase/ for better organization
- Added new TypeScript file /src/services/firebase/auth.ts for authentication services
- Cleaned up Firebase package dependencies
- Updated Firebase configuration to use latest Firebase SDK
- Implemented environment variable-based configuration
- Created type definitions for environment variables

### Changed
- Changed file extension for firebase.js to firebase.ts (no changes to file content)
- Moved firebase.ts to /src/services/firebase/firebase.ts
- Updated src/config/firebase.ts to initialize and export Firestore db
- Standardized Firebase package versions
- Removed conflicting Firebase package installations

### Fixed
- Resolved Firebase configuration and package version conflicts
- Established proper file organization for future development
- Implemented more robust Firebase initialization process

### Comments
- This restructuring creates a more maintainable TypeScript codebase
- The new documentation establishes clear workflow and standards for the team
- Improved Firebase configuration supports better type checking and environment management
- Simplified Firebase setup reduces potential configuration errors

## [2025-04-01] - Jacob Leon

### Added
- Created new folder structure /src/services/firebase/ for better organization
- Added new TypeScript file /src/services/firebase/auth.ts for authentication services
- Created/Updated documentation files (README.md, FIREBASE-SETUP.md, CONTRIBUTING.md, DB-MAPPING.md, CHANGELOG.md, INSTALLATION.md)

### Changed
- Changed file extension for firebase.js to firebase.ts (no changes to file content)
- Moved firebase.ts to /src/services/firebase/firebase.ts
- Updated src/config/firebase.ts to initialize and export Firestore db

### Fixed
- Established proper file organization for future development

### Comments
- This restructuring creates a more maintainable TypeScript codebase
- The new documentation establishes clear workflow and standards for the team
- The file extension change helps with TypeScript integration