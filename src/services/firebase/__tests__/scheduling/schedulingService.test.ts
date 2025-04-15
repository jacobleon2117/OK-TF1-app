import { 
  addAvailability,
  getAvailability,
  addShift,
  getShiftsForDate,
  updateShiftStatus,
  assignUserToShift,
  getShiftById,
  deleteShift,
  createShiftTemplate,
  getShiftTemplateById,
  updateShiftTemplate,
  deleteShiftTemplate,
  performBatchUpdate,
  AvailabilityData,
  ShiftData,
  ShiftTemplateData
} from '../../schedulingService';
import { db } from '../../../../config/firebase';
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
  serverTimestamp,
  arrayUnion,
  writeBatch,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  FieldValue,
  DocumentData
} from 'firebase/firestore';

// Mock Firebase modules
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    fromDate: jest.fn(date => date.getTime()),
    now: jest.fn(() => Date.now())
  },
  serverTimestamp: jest.fn(() => Date.now()),
  arrayUnion: jest.fn(data => data),
  writeBatch: jest.fn(() => ({
    update: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined)
  }))
}));

jest.mock('../../../config/firebase', () => ({
  db: {}
}));

describe('schedulingService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Availability Functions', () => {
    describe('addAvailability', () => {
      it('should add availability for a user on a specific date', async () => {
        // Arrange
        const userId = 'test-user-id';
        const date = '2024-03-20';
        const availabilityData: AvailabilityData = {
          status: 'available',
          startTime: '09:00',
          endTime: '17:00'
        };

        (doc as jest.Mock).mockReturnValue({});
        (setDoc as jest.Mock).mockResolvedValue(undefined);

        // Act
        await addAvailability(userId, date, availabilityData);

        // Assert
        expect(doc).toHaveBeenCalled();
        expect(setDoc).toHaveBeenCalledWith(
          expect.anything(),
          availabilityData,
          { merge: true }
        );
      });
    });

    describe('getAvailability', () => {
      it('should get availability for a user on a specific date', async () => {
        // Arrange
        const userId = 'test-user-id';
        const date = '2024-03-20';
        const mockAvailability = {
          status: 'available',
          startTime: '09:00',
          endTime: '17:00'
        };

        (doc as jest.Mock).mockReturnValue({});
        (getDoc as jest.Mock).mockResolvedValue({
          exists: () => true,
          data: () => mockAvailability
        });

        // Act
        const result = await getAvailability(userId, date);

        // Assert
        expect(doc).toHaveBeenCalled();
        expect(getDoc).toHaveBeenCalled();
        expect(result.data()).toEqual(mockAvailability);
      });
    });
  });

  describe('Shift Functions', () => {
    describe('addShift', () => {
      it('should add a new shift', async () => {
        // Arrange
        const shiftData: ShiftData = {
          description: 'Test shift',
          startTime: Timestamp.now(),
          endTime: Timestamp.now(),
          location: {
            name: 'Test location'
          },
          status: 'scheduled'
        };

        (addDoc as jest.Mock).mockResolvedValue({ id: 'test-shift-id' });

        // Act
        const result = await addShift(shiftData);

        // Assert
        expect(addDoc).toHaveBeenCalled();
        expect(result.id).toBe('test-shift-id');
      });
    });

    describe('getShiftsForDate', () => {
      it('should get shifts for a specific date', async () => {
        // Arrange
        const date = '2024-03-20';
        const mockShifts = [
          {
            id: 'shift-1',
            description: 'Morning shift',
            startTime: Timestamp.now(),
            endTime: Timestamp.now(),
            location: { name: 'Location 1' },
            status: 'scheduled'
          }
        ];

        (query as jest.Mock).mockReturnValue({});
        (getDocs as jest.Mock).mockResolvedValue({
          docs: mockShifts.map(shift => ({
            id: shift.id,
            data: () => shift
          }))
        });

        // Act
        const result = await getShiftsForDate(date);

        // Assert
        expect(query).toHaveBeenCalled();
        expect(getDocs).toHaveBeenCalled();
        expect(result.docs[0].data()).toEqual(mockShifts[0]);
      });
    });

    describe('updateShiftStatus', () => {
      it('should update shift status', async () => {
        // Arrange
        const shiftId = 'test-shift-id';
        const newStatus = 'in-progress';

        (doc as jest.Mock).mockReturnValue({});
        (updateDoc as jest.Mock).mockResolvedValue(undefined);

        // Act
        await updateShiftStatus(shiftId, newStatus);

        // Assert
        expect(doc).toHaveBeenCalled();
        expect(updateDoc).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            status: newStatus
          })
        );
      });
    });

    describe('assignUserToShift', () => {
      it('should assign a user to a shift', async () => {
        // Arrange
        const shiftId = 'test-shift-id';
        const userData = {
          userId: 'test-user-id',
          name: 'Test User',
          role: 'responder',
          status: 'assigned',
          assignedAt: serverTimestamp()
        };

        (doc as jest.Mock).mockReturnValue({});
        (updateDoc as jest.Mock).mockResolvedValue(undefined);

        // Act
        await assignUserToShift(shiftId, userData);

        // Assert
        expect(doc).toHaveBeenCalled();
        expect(updateDoc).toHaveBeenCalledWith(
          expect.anything(),
          {
            assignedUsers: userData
          }
        );
      });
    });
  });

  describe('Shift Template Functions', () => {
    describe('createShiftTemplate', () => {
      it('should create a new shift template', async () => {
        // Arrange
        const templateData: ShiftTemplateData = {
          templateName: 'Morning Shift',
          shiftType: 'regular',
          startTime: Timestamp.now(),
          endTime: Timestamp.now()
        };

        (addDoc as jest.Mock).mockResolvedValue({ id: 'test-template-id' });

        // Act
        const result = await createShiftTemplate(templateData);

        // Assert
        expect(addDoc).toHaveBeenCalled();
        expect(result.id).toBe('test-template-id');
      });
    });

    describe('getShiftTemplateById', () => {
      it('should get a shift template by ID', async () => {
        // Arrange
        const templateId = 'test-template-id';
        const mockTemplate = {
          templateName: 'Morning Shift',
          shiftType: 'regular',
          startTime: Timestamp.now(),
          endTime: Timestamp.now()
        };

        (doc as jest.Mock).mockReturnValue({});
        (getDoc as jest.Mock).mockResolvedValue({
          exists: () => true,
          data: () => mockTemplate
        });

        // Act
        const result = await getShiftTemplateById(templateId);

        // Assert
        expect(doc).toHaveBeenCalled();
        expect(getDoc).toHaveBeenCalled();
        expect(result.data()).toEqual(mockTemplate);
      });
    });
  });

  describe('Batch Operations', () => {
    describe('performBatchUpdate', () => {
      it('should perform batch updates', async () => {
        // Arrange
        const updates = [
          {
            ref: doc(db, 'collection', 'doc1'),
            data: { field1: 'value1' }
          },
          {
            ref: doc(db, 'collection', 'doc2'),
            data: { field2: 'value2' }
          }
        ];

        const mockBatch = {
          update: jest.fn(),
          commit: jest.fn().mockResolvedValue(undefined)
        };
        (writeBatch as jest.Mock).mockReturnValue(mockBatch);

        // Act
        await performBatchUpdate(updates);

        // Assert
        expect(writeBatch).toHaveBeenCalled();
        expect(mockBatch.update).toHaveBeenCalledTimes(2);
        expect(mockBatch.commit).toHaveBeenCalled();
      });
    });
  });
}); 