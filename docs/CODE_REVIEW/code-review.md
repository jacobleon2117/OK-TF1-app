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


# New building error code

You are initializing Firebase Auth for React Native without providing
AsyncStorage. Auth state will default to memory persistence and will not
persist between sessions. In order to persist auth state, install the package
"@react-native-async-storage/async-storage" and provide it to
initializeAuth:

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});