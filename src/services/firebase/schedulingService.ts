// 
// import { db } from './config/firebase'; // keep this import at the top of the file, This connects your database operations to our Firebase configuration.
// 
// I changed the file extension to ".ts" already, need to change the code to TypeScript.
// 
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  Timestamp,
  arrayUnion,
  serverTimestamp,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  FieldValue,
  writeBatch,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../config/firebase'; 

export interface AvailabilityData {
  status: string;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "17:00"
}

export interface ShiftData {
  description: string;
  missionId?: string;
  startTime: Timestamp;
  endTime: Timestamp;
  location: {
    name: string;
    address?: string;
  },
  status: string;
} 

export interface ShiftTemplateData {
  templateName: string;
  shiftType: string;
  startTime: Timestamp;
  endTime: Timestamp;
}

//=====================================
// AVAILABILITY functions
//=====================================

export const addAvailability = (
  userId: string,
  date: string,
  availabilityData: AvailabilityData
): Promise<void> => {
  const availabilityRef = doc(
    collection(db, 'schedules', userId, 'availability'),
    date
  );
  return setDoc(availabilityRef, availabilityData, { merge: true });
};

export const getAvailability = (
  userId: string,
  date: string
): Promise<DocumentSnapshot> => {
  const availabilityRef: DocumentReference = doc(
    collection(db, 'schedules', userId, 'availability'),
    date
  );
  return getDoc(availabilityRef);
};

// ================================================
// Shift Functions
// =================================================

export const addShift = (
  shiftData: ShiftData
): Promise<DocumentReference> => {
  return addDoc(collection(db,'shifts'), shiftData);
};

export const getShiftsForDate = (
  date: string
): Promise<QuerySnapshot> => {
  const shiftsQuery = query(
    collection(db, 'shifts'),
    where('startTime', '>=', Timestamp.fromDate(new Date(date))),
    where('startTime', '<=', Timestamp.fromDate(new Date(date)))
  );
  return getDocs(shiftsQuery);
};

export const updateShiftStatus = (
  shiftId: string,
  status: string
): Promise<void> => {
  const shiftRef: DocumentReference = doc(db, 'shifts', shiftId);
  return updateDoc(shiftRef, {
    status,
    updatedAt: serverTimestamp()
  })
};

export const assignUserToShift = (
  shiftId: string,
  userData: {
    userId: string;
    name: string;
    role: string;
    status: string;
    assignedAt: FieldValue;
    checkedIn?: boolean;
    checkedInAt?: FieldValue | null;
  }
): Promise<void> => {
  const shiftRef: DocumentReference = doc(db, 'shifts', shiftId);
  return updateDoc(shiftRef, {
    assignedUsers: arrayUnion(userData)
  });
};

export const getShiftById = (
  shiftId: string
): Promise<DocumentSnapshot> => {
  const shiftRef: DocumentReference = doc(db, 'shifts', shiftId);
  return getDoc(shiftRef);
};

export const deleteShift = (shiftId: string): Promise<void> => {
  const shiftRef: DocumentReference = doc(db, 'shifts', shiftId);
  return deleteDoc(shiftRef);
};

// ================================================
// Recurring Shifts Functions
// ===============================================
/*
export const createRecurringShift = (
  recurringShiftData: RecurringShiftData
): Promise<firebase.firestore.DocumentReference> => {
  return db.collection('recurringShifts').add(recurringShiftData);
};

export const getRecurringShiftsForTeam = (
  teamId: string
): Promise<firebase.firestore.QuerySnapshot> => {
  return db
    .collection('recurringShifts')
    .where('teamId', '==', teamId)
    .where('active', '==', true)
    .get();
};

export const updateRecurringShift = (
  recurringShiftId: string,
  updatedData: Partial<RecurringShiftData>
): Promise<void> => {
  return db.collection('recurringShifts').doc(recurringShiftId).update(updatedData);
};

export const deleteRecurringShift = (
  recurringShiftId: string
): Promise<void> => {
  return db.collection('recurringShifts').doc(recurringShiftId).delete();
};
*/


// =================================================
// Shift Template Functions
// =================================================

export const createShiftTemplate = (
  templateData: ShiftTemplateData
): Promise<DocumentReference> => {
  return addDoc(collection(db, 'shiftTemplates'), templateData)
};

export const getShiftTemplateById = (
  templateId: string
): Promise<DocumentSnapshot> => {
  const shiftTemplateRef: DocumentReference = doc(db, 'shiftTemplates', templateId);
  return getDoc(shiftTemplateRef);
};

export const updateShiftTemplate = (
  templateId: string,
  updatedData: Partial<ShiftTemplateData>
): Promise<void> => {
  const shiftTemplateRef: DocumentReference = doc(db, 'shiftTemplates', templateId);
  return updateDoc(shiftTemplateRef, {
    ...updatedData,
    updatedAt: serverTimestamp()
  });
};

export const deleteShiftTemplate = (
  templateId: string
): Promise<void> => {
  const shiftTemplateRef: DocumentReference = doc(db, 'shiftTemplates', templateId);
  return deleteDoc(shiftTemplateRef);
};

// =================================================
// Batch Operations
// =================================================

export const performBatchUpdate = async (
  updates: Array<{ ref: DocumentReference; data: DocumentData }>
): Promise<void> => {
  const batch = writeBatch(db);
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