# This will be the layout for the home (dashbaord) page.

### **April 3**
I adjusted the app.json to agree withe the assets folder -- the images were removed from the assets and the app.json was still calling for them. 

Currently, on 4/3 I have a page with a picture in the background and header and bottom tab bar.

### Changes:


* included widget boxes for weather
* changed the app.json to comply with the icon removal
* changed the background from a picture to a black background 
* included the avatar path for logging in


**NEXT**

* adjust the other colors to contrast differently.  light gray.. and make them more fixed, maybe, without a scrollable view so that they do not get "lost" to the user

**April 4**


* Added this to the package.json because the tunnel opens and loads consistently.  Now we can just say ```npm start``` or ```npx expo-start``` and the icon should always load

* also, i added 

```
npx expo install react-dom react-native-web
 @expo/metro-runtime
 ``` 
 so that it will hopefully load in the browser in the browser consistently.

 I believe that if this causes an issue you can remove it by 

 ### Remove web support if you don't need it:

1. Open your app.json or app.config.js file
2. Find the "platforms" array
3. Remove "web" from the platforms array  

```package.json
"scripts": {
    "start": "expo start --tunnel"
}
```

reset the file structure to more what Jacob wanted by

```
OK-TF1-root/
├── .expo/               # Expo configuration files
├── docs/                # Documentation files
├── src/                 # Source code
│   └── screens/         # Screen components
│       ├── home/
│       │   ├── assets/  # Home screen assets
│       │   │   └── images/
│       │   ├── components/ # Home screen components
│       │   │   └── widgets/
│       │   └── HomeScreen.tsx
│       └── [other screens being built by team members]
├── App.tsx              # Main App component
├── index.ts             # Entry point file
├── .gitignore           # Git ignore file
├── app.json             # Expo configuration
├── package.json         # Project dependencies
├── package-lock.json    # Dependency lock file
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```


Fun day... I did the homepage layout and got a lot of stuff to fit... so excited about the map and schedule and etc etc that are coming. 

DONE FOR NOW. q