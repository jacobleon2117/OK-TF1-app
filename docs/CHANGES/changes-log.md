# Changes

### 04/05/2025 - Jacob Leon

- I changed the folder layout to match other screen branches for easy merge

# QUESTIONS/INFORMATION FROM JACOB

- What are the widgets used for currently?
- Also check BUGS.md for current bugs, I added important information in this file please read.
- The current folder layout wont work with testing branch, the assets folder is a public folder so it should be in the root of the project. Also this would cause FS/testing branch to have two assets folders.
- The Header.tsx and TabBar.tsx will have to be either removed or added to existing files since FS/testing will have it's own header, etc.
- I had to change the folder screens to be, /src/screens/dashboard/home/ -> this is where the other main pages will go in, --- E.x. the screen profile will go inside, /src/screens/dashboard/ProfileScreen.tsx.
- The components folder is for re-useable components, E.x. button.tsx this would be used accross the app. Since you have widgets in the components folder this should be okay for now!
- With the Header.tsx and TabBar.tsx being in the components folder these will be removed as stated above. [ #REMEMBER THIS# ].
- Also check all new files you've made and make sure they're using TypeScript! [ #CHECK BUGS.md# ].

# IMPORTANT DESIGN UPDATE

- The current dashboard isn't like the Figma file, there's currently extra elements which aren't needed currently. The current state of the dashboard is similar but not close. Looks good but just wrong design!
- The hamburger menu top left isn't needed since the bottom nav is the menu, the welcome text should be placed there.
- No need for a profile icon in top navigation since there's a page for the profile.

# EXPO CURRENTLY RUNNING ON JSX

- JSX and TSX are basically the same, the EXPO app is running because a .JSX file can run with a .TSX extension!