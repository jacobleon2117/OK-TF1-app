// Import environment variables from Expo
import Constants from 'expo-constants';

// Get the variables from Expo's manifest
const expoVariables = Constants.expoConfig?.extra || {};

// Export Firebase config variables, checking both expo-constants and process.env
export const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || expoVariables.FIREBASE_API_KEY;
export const FIREBASE_AUTH_DOMAIN = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || expoVariables.FIREBASE_AUTH_DOMAIN;
export const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || expoVariables.FIREBASE_PROJECT_ID;
export const FIREBASE_STORAGE_BUCKET = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || expoVariables.FIREBASE_STORAGE_BUCKET;
export const FIREBASE_MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || expoVariables.FIREBASE_MESSAGING_SENDER_ID;
export const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || expoVariables.FIREBASE_APP_ID;

// Log availability for debugging
console.log('Environment variables loaded:', {
  API_KEY: !!FIREBASE_API_KEY,
  AUTH_DOMAIN: !!FIREBASE_AUTH_DOMAIN,
  PROJECT_ID: !!FIREBASE_PROJECT_ID,
  STORAGE_BUCKET: !!FIREBASE_STORAGE_BUCKET,
  MESSAGING_SENDER_ID: !!FIREBASE_MESSAGING_SENDER_ID,
  APP_ID: !!FIREBASE_APP_ID
});
