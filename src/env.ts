import Constants from 'expo-constants';

export const FIREBASE_API_KEY = Constants.expoConfig?.extra?.FIREBASE_API_KEY || '';
export const FIREBASE_AUTH_DOMAIN = Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN || '';
export const FIREBASE_PROJECT_ID = Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID || '';
export const FIREBASE_STORAGE_BUCKET = Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET || '';
export const FIREBASE_MESSAGING_SENDER_ID = Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID || '';
export const FIREBASE_APP_ID = Constants.expoConfig?.extra?.FIREBASE_APP_ID || '';