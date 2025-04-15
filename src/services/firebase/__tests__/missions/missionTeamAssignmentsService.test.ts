import {
  addTeamAssignment,
  getTeamAssignmentById,
  getAllTeamAssignments,
  updateTeamAssignment,
  deleteTeamAssignment,
  MissionTeamAssignment,
} from '../missionTeamAssignmentsService';
import { db } from '@/config/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';

// Mock Firebase modules
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  Timestamp: {
    fromDate: jest.fn(date => date.getTime()),
    now: jest.fn(() => Date.now()),
  },
}));

jest.mock('@/config/firebase', () => ({
  db: {},
}));

describe('missionTeamAssignmentsService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addTeamAssignment', () => {
    it('should add a new team assignment', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockAssignment: MissionTeamAssignment = {
        userId: 'user-123',
        role: 'team_leader',
        status: 'active',
        checkinTime: Timestamp.now(),
        checkoutTime: Timestamp.now(),
      };

      const mockDocRef = { id: 'test-assignment-id' };
      (collection as jest.Mock).mockReturnValue('team-assignments-collection');
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);

      // Act
      const result = await addTeamAssignment(missionId, mockAssignment);

      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'missions', missionId, 'team_assignments');
      expect(addDoc).toHaveBeenCalledWith('team-assignments-collection', mockAssignment);
      expect(result).toBe(mockDocRef);
    });
  });

  describe('getTeamAssignmentById', () => {
    it('should get a team assignment by id', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const assignmentId = 'test-assignment-id';
      const mockDocRef = { id: assignmentId };
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({
          userId: 'user-123',
          role: 'team_leader',
          status: 'active',
          checkinTime: Timestamp.now(),
          checkoutTime: Timestamp.now(),
        }),
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnapshot);

      // Act
      const result = await getTeamAssignmentById(missionId, assignmentId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId, 'team_assignments', assignmentId);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toBe(mockDocSnapshot);
    });
  });

  describe('getAllTeamAssignments', () => {
    it('should get all team assignments for a mission', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockQuerySnapshot = {
        docs: [
          {
            id: 'assignment-1',
            data: () => ({
              userId: 'user-123',
              role: 'team_leader',
              status: 'active',
              checkinTime: Timestamp.now(),
              checkoutTime: Timestamp.now(),
            }),
          },
          {
            id: 'assignment-2',
            data: () => ({
              userId: 'user-456',
              role: 'team_member',
              status: 'active',
              checkinTime: Timestamp.now(),
              checkoutTime: Timestamp.now(),
            }),
          },
        ],
      };

      (collection as jest.Mock).mockReturnValue('team-assignments-collection');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      // Act
      const result = await getAllTeamAssignments(missionId);

      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'missions', missionId, 'team_assignments');
      expect(getDocs).toHaveBeenCalledWith('team-assignments-collection');
      expect(result).toBe(mockQuerySnapshot);
    });
  });

  describe('updateTeamAssignment', () => {
    it('should update a team assignment', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const assignmentId = 'test-assignment-id';
      const updateData: Partial<MissionTeamAssignment> = {
        status: 'injured',
      };

      const mockDocRef = { id: assignmentId };
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      // Act
      await updateTeamAssignment(missionId, assignmentId, updateData);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId, 'team_assignments', assignmentId);
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, updateData);
    });
  });

  describe('deleteTeamAssignment', () => {
    it('should delete a team assignment', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const assignmentId = 'test-assignment-id';
      const mockDocRef = { id: assignmentId };
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      // Act
      await deleteTeamAssignment(missionId, assignmentId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId, 'team_assignments', assignmentId);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });
});
