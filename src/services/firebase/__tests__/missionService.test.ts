import {
  createMission,
  getMissionById,
  getAllMissions,
  updateMission,
  deleteMission,
  getActiveMissions,
  getMissionTeams,
  MissionData,
} from '../missionService';
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
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

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
    now: jest.fn(() => Date.now()),
  },
}));

jest.mock('@/config/firebase', () => ({
  db: {},
}));

describe('missionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMission', () => {
    it('should create a new mission', async () => {
      // Arrange
      const mockMissionData: MissionData = {
        coordinatorId: 'user-123',
        teamId: 'team-123',
        title: 'Test Mission',
        description: 'Test Description',
        startTime: Timestamp.now(),
        endTime: Timestamp.now(),
        status: 'preparing',
        location: {
          startingCoordinates: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
          operationArea: {
            northEast: {
              latitude: 37.7849,
              longitude: -122.4094,
            },
            southWest: {
              latitude: 37.7649,
              longitude: -122.4294,
            },
          },
        },
        missionMetrics: {
          totalDistanceCovered: 0,
          totalDuration: 0,
          averageTeamSpeed: 0,
        },
        reportSummary: {
          totalPinsDropped: 0,
          pinTypes: {
            brokenHouse: 0,
            floodedHouse: 0,
            boat: 0,
            fire: 0,
            bodyFound: 0,
            rescuedPeople: 0,
          },
        },
      };

      const mockDocRef = { id: 'test-mission-id' };
      (collection as jest.Mock).mockReturnValue('missions-collection');
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);

      // Act
      const result = await createMission(mockMissionData);

      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'missions');
      expect(addDoc).toHaveBeenCalledWith('missions-collection', mockMissionData);
      expect(result).toBe(mockDocRef);
    });
  });

  describe('getMissionById', () => {
    it('should get a mission by id', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockDocRef = { id: missionId };
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({
          coordinatorId: 'user-123',
          teamId: 'team-123',
          title: 'Test Mission',
          description: 'Test Description',
          startTime: Timestamp.now(),
          endTime: Timestamp.now(),
          status: 'preparing',
          location: {
            startingCoordinates: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
            operationArea: {
              northEast: {
                latitude: 37.7849,
                longitude: -122.4094,
              },
              southWest: {
                latitude: 37.7649,
                longitude: -122.4294,
              },
            },
          },
          missionMetrics: {
            totalDistanceCovered: 0,
            totalDuration: 0,
            averageTeamSpeed: 0,
          },
          reportSummary: {
            totalPinsDropped: 0,
            pinTypes: {
              brokenHouse: 0,
              floodedHouse: 0,
              boat: 0,
              fire: 0,
              bodyFound: 0,
              rescuedPeople: 0,
            },
          },
        }),
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnapshot);

      // Act
      const result = await getMissionById(missionId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toBe(mockDocSnapshot);
    });
  });

  describe('getAllMissions', () => {
    it('should get all missions', async () => {
      // Arrange
      const mockMissions = [
        {
          id: 'mission-1',
          coordinatorId: 'user-123',
          teamId: 'team-123',
          title: 'Mission 1',
          description: 'Description 1',
          startTime: Timestamp.now(),
          endTime: Timestamp.now(),
          status: 'active',
          location: {
            startingCoordinates: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
            operationArea: {
              northEast: {
                latitude: 37.7849,
                longitude: -122.4094,
              },
              southWest: {
                latitude: 37.7649,
                longitude: -122.4294,
              },
            },
          },
          missionMetrics: {
            totalDistanceCovered: 0,
            totalDuration: 0,
            averageTeamSpeed: 0,
          },
          reportSummary: {
            totalPinsDropped: 0,
            pinTypes: {
              brokenHouse: 0,
              floodedHouse: 0,
              boat: 0,
              fire: 0,
              bodyFound: 0,
              rescuedPeople: 0,
            },
          },
        },
        {
          id: 'mission-2',
          coordinatorId: 'user-456',
          teamId: 'team-456',
          title: 'Mission 2',
          description: 'Description 2',
          startTime: Timestamp.now(),
          endTime: Timestamp.now(),
          status: 'completed',
          location: {
            startingCoordinates: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
            operationArea: {
              northEast: {
                latitude: 37.7849,
                longitude: -122.4094,
              },
              southWest: {
                latitude: 37.7649,
                longitude: -122.4294,
              },
            },
          },
          missionMetrics: {
            totalDistanceCovered: 0,
            totalDuration: 0,
            averageTeamSpeed: 0,
          },
          reportSummary: {
            totalPinsDropped: 0,
            pinTypes: {
              brokenHouse: 0,
              floodedHouse: 0,
              boat: 0,
              fire: 0,
              bodyFound: 0,
              rescuedPeople: 0,
            },
          },
        },
      ];

      (collection as jest.Mock).mockReturnValue('missions-collection');
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockMissions.map(mission => ({
          id: mission.id,
          data: () => mission,
        })),
      });

      // Act
      const result = await getAllMissions();

      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'missions');
      expect(getDocs).toHaveBeenCalledWith('missions-collection');
      expect(result).toEqual(mockMissions);
    });
  });

  describe('updateMission', () => {
    it('should update a mission', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const updateData: Partial<MissionData> = {
        title: 'Updated Mission',
        status: 'active',
      };

      const mockDocRef = { id: missionId };
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      // Act
      await updateMission(missionId, updateData);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId);
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, updateData);
    });
  });

  describe('deleteMission', () => {
    it('should delete a mission', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockDocRef = { id: missionId };
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      // Act
      await deleteMission(missionId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });

  describe('getActiveMissions', () => {
    it('should get active missions', async () => {
      // Arrange
      const mockMissions = [
        {
          id: 'mission-1',
          coordinatorId: 'user-123',
          teamId: 'team-123',
          title: 'Mission 1',
          description: 'Description 1',
          startTime: Timestamp.now(),
          endTime: Timestamp.now(),
          status: 'active',
          location: {
            startingCoordinates: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
            operationArea: {
              northEast: {
                latitude: 37.7849,
                longitude: -122.4094,
              },
              southWest: {
                latitude: 37.7649,
                longitude: -122.4294,
              },
            },
          },
          missionMetrics: {
            totalDistanceCovered: 0,
            totalDuration: 0,
            averageTeamSpeed: 0,
          },
          reportSummary: {
            totalPinsDropped: 0,
            pinTypes: {
              brokenHouse: 0,
              floodedHouse: 0,
              boat: 0,
              fire: 0,
              bodyFound: 0,
              rescuedPeople: 0,
            },
          },
        },
      ];

      (collection as jest.Mock).mockReturnValue('missions-collection');
      (query as jest.Mock).mockReturnValue('missions-query');
      (where as jest.Mock).mockReturnValue('where-clause');
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockMissions.map(mission => ({
          id: mission.id,
          data: () => mission,
        })),
      });

      // Act
      const result = await getActiveMissions();

      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'missions');
      expect(query).toHaveBeenCalledWith('missions-collection', 'where-clause');
      expect(where).toHaveBeenCalledWith('status', '==', 'active');
      expect(getDocs).toHaveBeenCalledWith('missions-query');
      expect(result).toEqual(mockMissions);
    });
  });

  describe('getMissionTeams', () => {
    it('should get teams assigned to a mission', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockDocRef = { id: missionId };
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({
          coordinatorId: 'user-123',
          teamId: 'team-123',
          title: 'Test Mission',
          description: 'Test Description',
          startTime: Timestamp.now(),
          endTime: Timestamp.now(),
          status: 'active',
          location: {
            startingCoordinates: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
            operationArea: {
              northEast: {
                latitude: 37.7849,
                longitude: -122.4094,
              },
              southWest: {
                latitude: 37.7649,
                longitude: -122.4294,
              },
            },
          },
          missionMetrics: {
            totalDistanceCovered: 0,
            totalDuration: 0,
            averageTeamSpeed: 0,
          },
          reportSummary: {
            totalPinsDropped: 0,
            pinTypes: {
              brokenHouse: 0,
              floodedHouse: 0,
              boat: 0,
              fire: 0,
              bodyFound: 0,
              rescuedPeople: 0,
            },
          },
        }),
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnapshot);

      // Act
      const result = await getMissionTeams(missionId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toEqual(['team-123']);
    });

    it('should return empty array if mission does not exist', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockDocRef = { id: missionId };
      const mockDocSnapshot = {
        exists: () => false,
        data: () => null,
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnapshot);

      // Act
      const result = await getMissionTeams(missionId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toEqual([]);
    });

    it('should return empty array if mission has no teams', async () => {
      // Arrange
      const missionId = 'test-mission-id';
      const mockDocRef = { id: missionId };
      const mockMissionData = {
        coordinatorId: 'user-123',
        teamId: '', // Empty team ID
        title: 'Test Mission',
        description: 'Test Description',
        startTime: Timestamp.now(),
        endTime: null,
        status: 'active',
        location: {
          startingCoordinates: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
          operationArea: {
            northEast: {
              latitude: 37.7849,
              longitude: -122.4094,
            },
            southWest: {
              latitude: 37.7649,
              longitude: -122.4294,
            },
          },
        },
        missionMetrics: {
          totalDistanceCovered: 0,
          totalDuration: 0,
          averageTeamSpeed: 0,
        },
        reportSummary: {
          totalPinsDropped: 0,
          pinTypes: {
            brokenHouse: 0,
            floodedHouse: 0,
            boat: 0,
            fire: 0,
            bodyFound: 0,
            rescuedPeople: 0,
          },
        },
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockMissionData,
      });

      // Act
      const result = await getMissionTeams(missionId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'missions', missionId);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toEqual([]);
    });
  });
});
