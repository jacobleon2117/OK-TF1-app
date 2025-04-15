import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'coordinator' | 'team_member' | 'support';
  organizationId: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  phoneNumber?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
  };
}

// Get a user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return null;
    }
    return { id: userDoc.id, ...userDoc.data() } as User;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        } as User)
    );
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Get users by organization
export const getUsersByOrganization = async (organizationId: string): Promise<User[]> => {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('organizationId', '==', organizationId)
    );
    const usersSnapshot = await getDocs(usersQuery);
    return usersSnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        } as User)
    );
  } catch (error) {
    console.error('Error getting users by organization:', error);
    throw error;
  }
};

// Get users by role
export const getUsersByRole = async (role: User['role']): Promise<User[]> => {
  try {
    const usersQuery = query(collection(db, 'users'), where('role', '==', role));
    const usersSnapshot = await getDocs(usersQuery);
    return usersSnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        } as User)
    );
  } catch (error) {
    console.error('Error getting users by role:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId: string, status: User['status']): Promise<void> => {
  try {
    await updateUser(userId, { status });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId: string, role: User['role']): Promise<void> => {
  try {
    await updateUser(userId, { role });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (
  userId: string,
  preferences: User['preferences']
): Promise<void> => {
  try {
    await updateUser(userId, { preferences });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};
