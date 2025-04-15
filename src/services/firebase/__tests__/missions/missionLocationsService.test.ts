import { 
  addMissionLocation, 
  getMissionLocationById, 
  getAllMissionLocations, 
  updateMissionLocation, 
  deleteMissionLocation,
  MissionLocation
} from '../../missionLocationsService';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  Timestamp,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../../../../config/firebase';

// Mock Firebase modules
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
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
  }
}));

jest.mock('../../../config/firebase', () => ({
  db: {}
}));

describe('missionLocationsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addMissionLocation', () => {
    it('should add a new mission location', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockMissionLocation: MissionLocation = {
        userId: 'user-123',
        timestamp: Timestamp.now(),
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194
        },
        accuracy: 10,
        altitude: 100,
        speed: 5,
        heading: 90,
        roadType: 'paved'
      };
      
      const mockDocRef = { id: 'test-location-id' };
      (collection as jest.Mock).mockReturnValue('mission-locations-collection');
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);

      // Act
      const result = await addMissionLocation(missionId, mockMissionLocation);

      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'missions', missionId, 'locations');
      expect(addDoc).toHaveBeenCalledWith('mission-locations-collection', mockMissionLocation);
      expect(result).toBe(mockDocRef);
    });
  });

  describe('getMissionLocationById', () => {
    it('should get a mission location by id', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const locationId = 'test-location-id';
      const mockDocRef = { id: locationId };
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({
          userId: 'user-123',
          timestamp: Timestamp.now(),
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194
          },
          accuracy: 10,
          altitude: 100,
          speed: 5,
          heading: 90,
          roadType: 'paved'
        })
      };
      
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnapshot);

      // Act
      const result = await getMissionLocationById(missionId, locationId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId, 'locations', locationId);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toBe(mockDocSnapshot);
    });
  });

  describe('getAllMissionLocations', () => {
    it('should get all mission locations for a mission', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockQuerySnapshot = {
        docs: [
          {
            id: 'location-1',
            data: () => ({
              userId: 'user-123',
              timestamp: Timestamp.now(),
              coordinates: {
                latitude: 37.7749,
                longitude: -122.4194
              },
              accuracy: 10,
              altitude: 100,
              speed: 5,
              heading: 90,
              roadType: 'paved'
            })
          },
          {
            id: 'location-2',
            data: () => ({
              userId: 'user-456',
              timestamp: Timestamp.now(),
              coordinates: {
                latitude: 37.7750,
                longitude: -122.4195
              },
              accuracy: 15,
              altitude: 150,
              speed: 10,
              heading: 180,
              roadType: 'dirt'
            })
          }
        ]
      };
      
      (collection as jest.Mock).mockReturnValue('mission-locations-collection');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      // Act
      const result = await getAllMissionLocations(missionId);

      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'missions', missionId, 'locations');
      expect(getDocs).toHaveBeenCalledWith('mission-locations-collection');
      expect(result).toBe(mockQuerySnapshot);
    });
  });

  describe('updateMissionLocation', () => {
    it('should update a mission location', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const locationId = 'test-location-id';
      const updateData: Partial<MissionLocation> = {
        accuracy: 20,
        speed: 15
      };
      
      const mockDocRef = { id: locationId };
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      // Act
      await updateMissionLocation(missionId, locationId, updateData);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId, 'locations', locationId);
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, updateData);
    });
  });

  describe('deleteMissionLocation', () => {
    it('should delete a mission location', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const locationId = 'test-location-id';
      const mockDocRef = { id: locationId };
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      // Act
      await deleteMissionLocation(missionId, locationId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId, 'locations', locationId);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });
}); 