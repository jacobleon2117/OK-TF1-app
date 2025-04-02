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
} from 'firebase/firestore';
import { db } from '../../config/firebase'; 

export interface AvailabilityData {
  status: string;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "17:00"
}

export interface ShiftData {
  name: string;
  description: string;
  missionId?: string;
  startTime: firebase.firestore.Timestamp;
  endTime: firebase.firestore.Timestamp;
  location: {
    name: string;
    address?: string;
  };
  assignedUsers?: Array<{
    userId: string;
    name: string;
    role: string;
    status: string;
    assignedAt: firebase.firestore.FieldValue;
    checkedIn?: boolean;
    checkedInAt?: firebase.firestore.FieldValue | null;
  }>;
  requiredRoles?: Array<{
    role: string;
    count: number;
    filled: number;
  }>;
  status: string;
  createdBy: string;
  createdAt: firebase.firestore.FieldValue;
  updatedAt: firebase.firestore.FieldValue;
  notes?: string;
}

export interface ShiftTemplateData {
  name: string;
  description: string;
  duration: number; // in hours
  requiredRoles: Array<{ role: string; count: number }>;
  defaultLocation: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  createdBy: string;
  createdAt: firebase.firestore.FieldValue;
  updatedAt: firebase.firestore.FieldValue;
}

//=====================================
// AVAILABILITY functions
//=====================================

export const addAvailability = (
  userId: string,
  date: string,
  availabilityData: AvailabilityData
): Promise<void> => {
  const availabilityRef = db
    .collection('schedules')
    .doc(userId)
    .collection('availability')
    .doc(date);
  return availabilityRef.set(availabilityData, { merge: true });
};

export const getAvailability = (
  userId: string,
  date: string
): Promise<firebase.firestore.DocumentSnapshot> => {
  const availabilityRef = db
    .collection('schedules')
    .doc(userId)
    .collection('availability')
    .doc(date);
  return availabilityRef.get();
};

// ================================================
// Shift Functions
// =================================================

export const addShift = (
  shiftData: ShiftData
): Promise<firebase.firestore.DocumentReference> => {
  return db.collection('shifts').add(shiftData);
};

export const getShiftsForDate = (
  date: string
): Promise<firebase.firestore.QuerySnapshot> => {
  return db
    .collection('shifts')
    .where(
      'startTime',
      '>=',
      firebase.firestore.Timestamp.fromDate(new Date(date))
    )
    .where(
      'startTime',
      '<=',
      firebase.firestore.Timestamp.fromDate(new Date(date))
    )
    .get();
};

export const updateShiftStatus = (
  shiftId: string,
  status: string
): Promise<void> => {
  return db.collection('shifts').doc(shiftId).update({
    status,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
};

export const assignUserToShift = (
  shiftId: string,
  userData: {
    userId: string;
    name: string;
    role: string;
    status: string;
    assignedAt: firebase.firestore.FieldValue;
    checkedIn?: boolean;
    checkedInAt?: firebase.firestore.FieldValue | null;
  }
): Promise<void> => {
  const shiftRef = db.collection('shifts').doc(shiftId);
  return shiftRef.update({
    assignedUsers: firebase.firestore.FieldValue.arrayUnion(userData)
  });
};

export const getShiftById = (
  shiftId: string
): Promise<firebase.firestore.DocumentSnapshot> => {
  return db.collection('shifts').doc(shiftId).get();
};

export const deleteShift = (shiftId: string): Promise<void> => {
  return db.collection('shifts').doc(shiftId).delete();
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
): Promise<firebase.firestore.DocumentReference> => {
  return db.collection('shiftTemplates').add(templateData);
};

export const getShiftTemplateById = (
  templateId: string
): Promise<firebase.firestore.DocumentSnapshot> => {
  return db.collection('shiftTemplates').doc(templateId).get();
};

export const updateShiftTemplate = (
  templateId: string,
  updatedData: Partial<ShiftTemplateData>
): Promise<void> => {
  return db.collection('shiftTemplates').doc(templateId).update({
    ...updatedData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
};

export const deleteShiftTemplate = (
  templateId: string
): Promise<void> => {
  return db.collection('shiftTemplates').doc(templateId).delete();
};

// =================================================
// Batch Operations
// =================================================

export const performBatchUpdate = async (
  updates: Array<{ ref: firebase.firestore.DocumentReference; data: Object }>
): Promise<void> => {
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
