import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  Timestamp, 
  serverTimestamp,
  arrayUnion,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { 
  addShift, 
  assignUserToShift,
  deleteShift,
  updateShiftStatus
} from '@/services/firebase/schedulingService';
import { Shift } from './shiftUtils';

/**
 * Interface for user data coming from Firestore
 */
export interface UserData {
  id: string;
  displayName: string;
  email: string;
  role: string;
  organizationCode: string;
  status?: string;
  createdAt: Timestamp;
}

/**
 * Check if user has admin privileges
 */
export const isUserAdmin = (userData: DocumentData | null): boolean => {
  if (!userData) return false;
  return userData.role === 'admin';
};

/**
 * Create a new shift (admin only)
 */
export const createNewShift = async (shiftData: Partial<Shift>): Promise<string | null> => {
  try {
    const completeShiftData = {
      description: shiftData.description || 'Untitled Shift',
      location: shiftData.location || { name: 'TBD' },
      startTime: shiftData.startTime || Timestamp.fromDate(new Date()),
      endTime: shiftData.endTime || Timestamp.fromDate(new Date(Date.now() + 3600000)), // 1 hour later
      status: 'active',
    };
    
    const shiftRef = await addShift(completeShiftData);
    return shiftRef.id;
  } catch (error) {
    console.error('Error creating new shift:', error);
    return null;
  }
};

/**
 * Update an existing shift (admin only)
 */
export const updateExistingShift = async (
  shiftId: string, 
  updatedData: Partial<Shift>
): Promise<boolean> => {
  try {
    const shiftRef = doc(db, 'shifts', shiftId);
    
    await updateDoc(shiftRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating shift:', error);
    return false;
  }
};

/**
 * Delete a shift (admin only)
 */
export const deleteExistingShift = async (shiftId: string): Promise<boolean> => {
  try {
    await deleteShift(shiftId);
    return true;
  } catch (error) {
    console.error('Error deleting shift:', error);
    return false;
  }
};

/**
 * Get all team members (admin only)
 */
export const getAllTeamMembers = async (): Promise<UserData[]> => {
  try {
    const usersQuery = query(collection(db, 'users'));
    const usersSnapshot = await getDocs(usersQuery);
    
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserData));
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

/**
 * Assign a team member to a shift (admin only)
 */
export const assignTeamMemberToShift = async (
  shiftId: string,
  userId: string,
  userName: string,
  userRole: string
): Promise<boolean> => {
  try {
    await assignUserToShift(shiftId, {
      userId,
      name: userName,
      role: userRole,
      status: 'assigned',
      assignedAt: Timestamp.now(),
      checkedIn: false,
      checkedInAt: null
    });
    
    return true;
  } catch (error) {
    console.error('Error assigning team member to shift:', error);
    return false;
  }
};

/**
 * Get all team members assigned to a specific shift (admin only)
 */
export const getShiftAssignments = async (shiftId: string): Promise<any[]> => {
  try {
    const shiftRef = doc(db, 'shifts', shiftId);
    const shiftDoc = await getDoc(shiftRef);
    
    if (!shiftDoc.exists()) {
      return [];
    }
    
    const shiftData = shiftDoc.data();
    return shiftData.assignedUsers || [];
  } catch (error) {
    console.error('Error fetching shift assignments:', error);
    return [];
  }
};

/**
 * Update a user's role (super admin only)
 * This function should only be used by coordinator to promote other members
 */
export const updateUserRole = async (
  userId: string, 
  newRole: 'admin' | 'supervisor' | 'member'
): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};

/**
 * Get a user by their email (admin only)
 * Useful for finding a user before promoting them
 */
export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', email)
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    
    if (usersSnapshot.empty) {
      return null;
    }
    
    const userData = usersSnapshot.docs[0];
    
    return {
      id: userData.id,
      ...userData.data()
    } as UserData;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};