import { 
  addMissionPin,
  getMissionPinById,
  getAllMissionPins,
  updateMissionPin,
  deleteMissionPin,
  MissionPin
} from '../../missionPinsService';
import { db } from '../../../../config/firebase';
import { 
  collection, 
  doc, 
  addDoc,
  getDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  Timestamp
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
    now: jest.fn(() => Date.now())
  }
}));

jest.mock('../../../config/firebase', () => ({
  db: {}
}));

describe('missionPinsService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addMissionPin', () => {
    it('should add a new mission pin', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockPin: MissionPin = {
        type: 'brokenHouse',
        userId: 'user-123',
        timestamp: Timestamp.now(),
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194
        },
        description: 'Test pin description',
        imageUrls: ['url1', 'url2'],
        additionalDetails: {
          rescueCount: 2
        }
      };
      
      const mockDocRef = { id: 'test-pin-id' };
      (collection as jest.Mock).mockReturnValue('pins-collection');
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      
      // Act
      const result = await addMissionPin(missionId, mockPin);
      
      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'missions', missionId, 'pins');
      expect(addDoc).toHaveBeenCalledWith('pins-collection', mockPin);
      expect(result).toBe(mockDocRef);
    });
  });

  describe('getMissionPinById', () => {
    it('should get a mission pin by id', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const pinId = 'test-pin-id';
      const mockDocRef = { id: pinId };
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({
          type: 'brokenHouse',
          userId: 'user-123',
          timestamp: Timestamp.now(),
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194
          },
          description: 'Test pin description',
          imageUrls: ['url1', 'url2'],
          additionalDetails: {
            rescueCount: 2
          }
        })
      };
      
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnapshot);
      
      // Act
      const result = await getMissionPinById(missionId, pinId);
      
      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId, 'pins', pinId);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toBe(mockDocSnapshot);
    });
  });

  describe('getAllMissionPins', () => {
    it('should get all mission pins for a mission', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockQuerySnapshot = {
        docs: [
          {
            id: 'pin-1',
            data: () => ({
              type: 'brokenHouse',
              userId: 'user-123',
              timestamp: Timestamp.now(),
              coordinates: {
                latitude: 37.7749,
                longitude: -122.4194
              },
              description: 'Pin 1 description',
              imageUrls: ['url1'],
              additionalDetails: {
                rescueCount: 1
              }
            })
          },
          {
            id: 'pin-2',
            data: () => ({
              type: 'fire',
              userId: 'user-456',
              timestamp: Timestamp.now(),
              coordinates: {
                latitude: 37.7750,
                longitude: -122.4195
              },
              description: 'Pin 2 description',
              imageUrls: ['url2'],
              additionalDetails: {
                fireIntensity: 'high'
              }
            })
          }
        ]
      };
      
      (collection as jest.Mock).mockReturnValue('pins-collection');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);
      
      // Act
      const result = await getAllMissionPins(missionId);
      
      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'missions', missionId, 'pins');
      expect(getDocs).toHaveBeenCalledWith('pins-collection');
      expect(result).toBe(mockQuerySnapshot);
    });
  });

  describe('updateMissionPin', () => {
    it('should update a mission pin', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const pinId = 'test-pin-id';
      const updateData: Partial<MissionPin> = {
        description: 'Updated pin description',
        additionalDetails: {
          rescueCount: 3
        }
      };
      
      const mockDocRef = { id: pinId };
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      await updateMissionPin(missionId, pinId, updateData);
      
      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId, 'pins', pinId);
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, updateData);
    });
  });

  describe('deleteMissionPin', () => {
    it('should delete a mission pin', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const pinId = 'test-pin-id';
      const mockDocRef = { id: pinId };
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      await deleteMissionPin(missionId, pinId);
      
      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId, 'pins', pinId);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });
});