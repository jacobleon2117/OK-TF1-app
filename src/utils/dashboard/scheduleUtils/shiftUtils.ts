import { Timestamp } from 'firebase/firestore';
import { getShiftsForDate } from '../../../services/firebase/schedulingService';

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
}

export const fetchShifts = async (selectedDate: Date): Promise<Shift[]> => {
  try {
    const dateString = selectedDate.toISOString().split('T')[0];
    const shiftsSnapshot = await getShiftsForDate(dateString);
    
    return shiftsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Shift));
  } catch (error) {
    console.error('Failed to fetch shifts:', error);
    return [];
  }
};

export const createShift = async (shiftDetails: Partial<Shift>): Promise<Shift | null> => {
  try {
    // Dom will need to implement shift creation logic here
    // I'll add this as a placeholder for now
    return null;
  } catch (error) {
    console.error('Failed to create shift:', error);
    return null;
  }
};

export const filterShiftsByStatus = (shifts: Shift[], status: string): Shift[] => {
  return shifts.filter(shift => shift.status === status);
};