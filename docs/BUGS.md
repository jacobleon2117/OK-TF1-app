# BUGS

Some of your files are still using JSX and not TypeScript.


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

## File MapWidget.tsx has an error:
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
