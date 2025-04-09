<<<<<<< HEAD
### **April 3**
I adjusted the app.json to agree withe the assets folder -- the images were removed from the assets and the app.json was still calling for them. 

Currently, on 4/3 I have a page with a picture in the background and header and bottom tab bar.

### Changes:


* included card boxes for weather
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
│       │   │   └── cards/
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

DONE FOR NOW.

# Some of your files are still using JSX and not TypeScript.

## File HomeScreen.tsx has an error:

### On line 68 the error code is:
Property 'avatarUri' is missing in type '{ username: string; onProfilePress: () => void; onNotificationsPress: () => void; onMenuPress: () => void; }' but required in type '{ username: any; avatarUri: any; onNotificationsPress: any; onMenuPress: any; onProfilePress: any; }'

### Possible Fix:
Step 1:
(Add avatarUri state)
const [avatarUri, setAvatarUri] = useState('');

Step 2:
(Get avatarUri)
storedAvatarUri = await AsyncStorage.getItem('avatarUri');

Step 3:
(Pass avatarUri to Header)
avatarUri={avatarUri}

-------------------

## File MessageCard.tsx has an error:
On line 172 the error code is:
Type '"right"' is not assignable to type 'FlexAlignType | undefined'

### Possible Fix

If you're trying to align items to the right, use:
alignItems: 'flex-end'

### Updated code, this HAS NOT been changed in the file. You'll need to change it to this:
locationInfo: {
  flexDirection: 'column',
  alignItems: 'flex-end', ← this is the proper value
  marginLeft: 4,
  marginBottom: 4,
},

-------------------

# File Header.tsx has errors

### Starting on line 6 through 10 the error codes are,
Binding element 'onProfilePress' implicitly has an 'any' type.ts(7031)
Binding element 'onMenuPress' implicitly has an 'any' type.ts(7031)
Binding element 'onNotificationsPress' implicitly has an 'any' type.ts(7031)
Binding element 'avatarUri' implicitly has an 'any' type.ts(7031)
Binding element 'username' implicitly has an 'any' type.ts(7031)

### You're not typing the props of your Header component and TypeScript doesn't like that. You need to explicitly declare the type of each prop.

### Add this HeaderProps interface above your component:
interface HeaderProps {
  username: string;
  avatarUri: string;
  onNotificationsPress: () => void;
  onMenuPress: () => void;
  onProfilePress: () => void;
}

-------------------

# File TabBar.tsx has errors

### On line 6 the error codes are:
Binding element 'onHomePress' implicitly has an 'any'
Binding element 'onSchedulePress' implicitly has an 'any'
Binding element 'onMapPress' implicitly has an 'any'

### Add this TabBarProps interface above your component:
interface TabBarProps {
  onHomePress: () => void;
  onSchedulePress: () => void;
  onMapPress: () => void;
}

-------------------
=======
# Code Review

## [2025-04-01] - Jacob Leon

- I wanted to provide code for the file with the wrong extension. You don't have to follow this but wanted to give you this since I had to update and add a few things so everything was connected. If you think this new code will work properly, we can review it together and double check/compare your code with this one and see if it'll be good to go.

- Again we don't have to use this but wanted to provide it because of time constraints!

import { db } from './config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  arrayUnion,
  serverTimestamp,
  FieldValue
} from 'firebase/firestore';

// Types (to be added for TypeScript)
interface AvailabilityData {
  [key: string]: any;
}

interface ShiftData {
  startTime: Timestamp;
  endTime: Timestamp;
  title?: string;
  location?: string;
  teamId?: string;
  status?: string;
  assignedUsers?: any[];
  [key: string]: any;
}

interface TimeOffData {
  userId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  reason?: string;
  status?: string;
  [key: string]: any;
}

export const addAvailability = (userId: string, date: string, availabilityData: AvailabilityData) => {
  const availabilityRef = doc(collection(doc(collection(db, 'schedules'), userId), 'availability'), date);
  return setDoc(availabilityRef, availabilityData, { merge: true }); // merge updates existing data
};

export const getAvailability = (userId: string, date: string) => {
  const availabilityRef = doc(collection(doc(collection(db, 'schedules'), userId), 'availability'), date);
  return getDoc(availabilityRef);
};

export const addShift = (shiftData: ShiftData) => {
  return addDoc(collection(db, 'shifts'), shiftData);
};

export const getShiftsForDate = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const q = query(
    collection(db, 'shifts'),
    where('startTime', '>=', Timestamp.fromDate(startOfDay)),
    where('startTime', '<=', Timestamp.fromDate(endOfDay))
  );
  
  return getDocs(q);
};

export const updateShiftStatus = (shiftId: string, status: string) => {
  const shiftRef = doc(collection(db, 'shifts'), shiftId);
  return updateDoc(shiftRef, {
    status,
    updatedAt: serverTimestamp()
  });
};

export const assignUserToShift = (shiftId: string, userData: any) => {
  const shiftRef = doc(collection(db, 'shifts'), shiftId);
  return updateDoc(shiftRef, {
    assignedUsers: arrayUnion(userData)
  });
};

export const getShiftById = (shiftId: string) => {
  return getDoc(doc(collection(db, 'shifts'), shiftId));
};

export const deleteShift = (shiftId: string) => {
  return deleteDoc(doc(collection(db, 'shifts'), shiftId));
};

export const createTimeOffRequest = (timeOffData: TimeOffData) => {
  return addDoc(collection(db, 'timeOffRequests'), timeOffData);
};

export const getTimeOffRequestsForUser = (userId: string) => {
  const q = query(
    collection(db, 'timeOffRequests'),
    where('userId', '==', userId)
  );
  return getDocs(q);
};

export const updateTimeOffRequest = (requestId: string, updatedData: Partial<TimeOffData>) => {
  const requestRef = doc(collection(db, 'timeOffRequests'), requestId);
  return updateDoc(requestRef, updatedData);
};

export const deleteTimeOffRequest = (requestId: string) => {
  const requestRef = doc(collection(db, 'timeOffRequests'), requestId);
  return deleteDoc(requestRef);
};

export const createRecurringShift = (recurringShiftData: any) => {
  return addDoc(collection(db, 'recurringShifts'), recurringShiftData);
};

export const getRecurringShiftsForTeam = (teamId: string) => {
  const q = query(
    collection(db, 'recurringShifts'),
    where('teamId', '==', teamId),
    where('active', '==', true)
  );
  return getDocs(q);
};

export const updateRecurringShift = (recurringShiftId: string, updatedData: any) => {
  const recurringShiftRef = doc(collection(db, 'recurringShifts'), recurringShiftId);
  return updateDoc(recurringShiftRef, updatedData);
};

export const deleteRecurringShift = (recurringShiftId: string) => {
  const recurringShiftRef = doc(collection(db, 'recurringShifts'), recurringShiftId);
  return deleteDoc(recurringShiftRef);
};

export const createShiftTemplate = (templateData: any) => {
  return addDoc(collection(db, 'shiftTemplates'), templateData);
};

export const getShiftTemplateById = (templateId: string) => {
  const templateRef = doc(collection(db, 'shiftTemplates'), templateId);
  return getDoc(templateRef);
};

export const updateShiftTemplate = (templateId: string, updatedData: any) => {
  const templateRef = doc(collection(db, 'shiftTemplates'), templateId);
  return updateDoc(templateRef, {
    ...updatedData,
    updatedAt: serverTimestamp()
  });
};

export const deleteShiftTemplate = (templateId: string) => {
  const templateRef = doc(collection(db, 'shiftTemplates'), templateId);
  return deleteDoc(templateRef);
};

export const performBatchUpdate = async (updates: {ref: any, data: any}[]) => {
  const batch = db.batch();
  updates.forEach(({ ref, data }) => {
    batch.update(ref, data);
  });
  try {
    await batch.commit();
    console.log('Batch update successful');
  } catch (error) {
    console.error('Batch update failed:', error);
  }
};
>>>>>>> origin/feature/dashboard-map
