// config/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get environment variables from Expo Constants or use direct config
const firebaseConfig = {
  apiKey: "AIzaSyCjBCA0fakQvBDrMx9I9j54KV0FOnJJ2Zs",
  authDomain: "taskcom-ok-tf1.firebaseapp.com",
  projectId: "taskcom-ok-tf1",
  storageBucket: "taskcom-ok-tf1.firebasestorage.app",
  messagingSenderId: "154712810028",
  appId: "1:154712810028:web:43b5c0a2f773a2627fa789"
};

// Log config for debugging
console.log('Firebase Config Check:', {
  apiKey: !!firebaseConfig.apiKey,
  authDomain: !!firebaseConfig.authDomain,
  projectId: !!firebaseConfig.projectId,
  storageBucket: !!firebaseConfig.storageBucket,
  messagingSenderId: !!firebaseConfig.messagingSenderId,
  appId: !!firebaseConfig.appId,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

console.log('Firebase initialized successfully with auth:', !!auth);

export { app, auth, db };
