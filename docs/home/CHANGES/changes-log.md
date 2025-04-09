<<<<<<< HEAD
# Changes

### 04/05/2025 - Jacob Leon

- I changed the folder layout to match other screen branches for easy merge

# QUESTIONS/INFORMATION FROM JACOB

- What are the cards used for currently?
- Also check BUGS.md for current bugs, I added important information in this file please read.
- The current folder layout wont work with testing branch, the assets folder is a public folder so it should be in the root of the project. Also this would cause FS/testing branch to have two assets folders.
- The Header.tsx and TabBar.tsx will have to be either removed or added to existing files since FS/testing will have it's own header, etc.
- I had to change the folder screens to be, /src/screens/dashboard/home/ -> this is where the other main pages will go in, --- E.x. the screen profile will go inside, /src/screens/dashboard/ProfileScreen.tsx.
- The components folder is for re-useable components, E.x. button.tsx this would be used accross the app. Since you have cards in the components folder this should be okay for now!
- With the Header.tsx and TabBar.tsx being in the components folder these will be removed as stated above. [ #REMEMBER THIS# ].
- Also check all new files you've made and make sure they're using TypeScript! [ #CHECK BUGS.md# ].

# IMPORTANT DESIGN UPDATE

- The current dashboard isn't like the Figma file, there's currently extra elements which aren't needed currently. The current state of the dashboard is similar but not close. Looks good but just wrong design!
- The hamburger menu top left isn't needed since the bottom nav is the menu, the welcome text should be placed there.
- No need for a profile icon in top navigation since there's a page for the profile.

# EXPO CURRENTLY RUNNING ON JSX

- JSX and TSX are basically the same, the EXPO app is running because a .JSX file can run with a .TSX extension!
=======
# Add any changes here.

## Make sure to document your name, current date, and what you changed in this branch.

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

# Change Log

## April 6, 2025
### Developer: Jacob Leon

### Feature: Dashboard Messaging Screen Implementation

#### Changes Made:
- Created new MessagesScreen component in `src/screens/dashboard/MessagesScreen.tsx`
- Updated navigation structure to incorporate the messaging screen into the dashboard
- Created `DashboardNavigator.tsx` to handle dashboard-related navigation
- Updated main navigation index to use the dashboard navigator when authenticated
- Implemented UI based on Figma design with:
  - Dark theme
  - Top navigation bar with back button and "Messages" title
  - Floating bottom navigation bar with rounded corners as shown in design
  - Navigation icons (home, calendar, messages, map, profile)
  - Highlighted "messages" icon in orange to indicate active screen

#### Technical Implementation:
- Used FontAwesome icons for consistent design 
- Implemented proper navigation typing with TypeScript
- Created floating bottom navigation with shadows and rounded corners
- Set up navigation structure for integration with existing app
- Added placeholder for message list (to be populated with Firebase data later)

#### Files Added:
- `src/screens/dashboard/MessagesScreen.tsx` - Main messaging screen UI
- `src/navigation/DashboardNavigator.tsx` - Dashboard navigation management
- Updated `src/navigation/index.tsx` - To include the Dashboard Navigator

#### Next Steps:
- Connect to Firebase for real message data
- Implement message creation functionality
- Add message list component to display messages from Firebase
- Implement real-time updates with Socket.io
- Add loading states and error handling
>>>>>>> origin/feature/dashboard-map
