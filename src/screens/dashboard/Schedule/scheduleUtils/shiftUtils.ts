import { Timestamp, serverTimestamp, FieldValue, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { 
  getShiftsForDate, 
  addShift as addShiftToFirestore,
  updateShiftStatus as updateShiftStatusFirestore,
  getShiftById,
  deleteShift as deleteShiftFirestore
} from '@/services/firebase/schedulingService';

export interface Shift {
  id?: string;
  description: string;
  startTime: Timestamp;
  endTime: Timestamp;
  location: {
    name: string;
    address?: string;
  };
  status: string;
  assignedUsers?: Array<{
    userId: string;
    name: string;
    role: string;
    status: string;
    assignedAt: Timestamp;
    checkedIn?: boolean;
    checkedInAt?: Timestamp | null;
  }>;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  createdBy?: string;
}

/**
 * Fetch shifts for a specific date
 */
export const fetchShifts = async (selectedDate: Date): Promise<Shift[]> => {
  try {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log('Querying shifts between:', startOfDay, 'and', endOfDay);
    
    const shiftsQuery = query(
      collection(db, 'shifts'),
      where('startTime', '>=', Timestamp.fromDate(startOfDay)),
      where('startTime', '<=', Timestamp.fromDate(endOfDay))
    );
    
    const shiftsSnapshot = await getDocs(shiftsQuery);
    
    console.log('Shifts snapshot size:', shiftsSnapshot.size);
    
    return shiftsSnapshot.docs.map(doc => {
      const data = doc.data() as Shift;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt 
          : Timestamp.now(),
        updatedAt: data.updatedAt instanceof Timestamp 
          ? data.updatedAt 
          : Timestamp.now(),
      } as Shift;
    });
  } catch (error) {
    console.error('Failed to fetch shifts:', error);
    return [];
  }
};

/**
 * Create a new shift (enhanced for admin use)
 */
export const createShift = async (shiftDetails: Partial<Shift>, creatorId: string): Promise<Shift | null> => {
  try {
    const newShift = {
      description: shiftDetails.description || 'Untitled Shift',
      startTime: shiftDetails.startTime || Timestamp.fromDate(new Date()),
      endTime: shiftDetails.endTime || Timestamp.fromDate(new Date(Date.now() + 3600000)),
      location: shiftDetails.location || { name: 'TBD' },
      status: 'active',
      assignedUsers: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: creatorId
    };
    
    const shiftRef = await addShiftToFirestore(newShift);
    
    if (shiftRef.id) {
      return {
        id: shiftRef.id,
        ...newShift,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      } as Shift;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to create shift:', error);
    return null;
  }
};

/**
 * Update a shift's status
 */
export const updateShiftStatus = async (shiftId: string, newStatus: string): Promise<boolean> => {
  try {
    await updateShiftStatusFirestore(shiftId, newStatus);
    return true;
  } catch (error) {
    console.error('Failed to update shift status:', error);
    return false;
  }
};

/**
 * Get a specific shift by ID
 */
export const getShiftDetails = async (shiftId: string): Promise<Shift | null> => {
  try {
    const shiftDoc = await getShiftById(shiftId);
    
    if (!shiftDoc.exists()) {
      return null;
    }
    
    return {
      id: shiftDoc.id,
      ...shiftDoc.data()
    } as Shift;
  } catch (error) {
    console.error('Failed to get shift details:', error);
    return null;
  }
};

/**
 * Delete a shift (admin only)
 */
export const removeShift = async (shiftId: string): Promise<boolean> => {
  try {
    await deleteShiftFirestore(shiftId);
    return true;
  } catch (error) {
    console.error('Failed to delete shift:', error);
    return false;
  }
};

/**
 * Filter shifts by status
 */
export const filterShiftsByStatus = (shifts: Shift[], status: string): Shift[] => {
  return shifts.filter(shift => shift.status === status);
};

/**
 * Filter shifts for the current user
 * (Used to show only shifts assigned to the logged-in team member)
 */
export const filterShiftsForUser = (shifts: Shift[], userId: string): Shift[] => {
  return shifts.filter(shift => 
    shift.assignedUsers?.some(user => user.userId === userId)
  );
};

/**
 * Check if a user is assigned to a shift
 */
export const isUserAssignedToShift = (shift: Shift, userId: string): boolean => {
  if (!shift.assignedUsers) return false;
  return shift.assignedUsers.some(user => user.userId === userId);
};

/**
 * Format shift time for display
 */
export const formatShiftTime = (timestamp: Timestamp): string => {
  try {
    return timestamp.toDate().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting shift time:', error);
    return 'Invalid Time';
  }
};