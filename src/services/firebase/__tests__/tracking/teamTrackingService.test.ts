import { 
  createTeam, 
  getTeam, 
  getAllTeams, 
  getActiveTeams, 
  updateTeam, 
  updateTeamStatus, 
  updateTeamPosition, 
  getTeamPositionHistory, 
  subscribeToTeamPosition, 
  subscribeToActiveTeams, 
  getTeamsInArea,
  Team,
  PositionUpdate
} from '../../teamTrackingService';
import { db } from '../../../../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  onSnapshot, 
  GeoPoint,
  Timestamp
} from 'firebase/firestore';

// Mock Firebase modules
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  updateDoc: jest.fn(),
  onSnapshot: jest.fn(),
  GeoPoint: jest.fn()
}));

// Mock Firebase config
jest.mock('../../../config/firebase', () => ({
  db: {}
}));

describe('teamTrackingService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTeam', () => {
    it('should create a new team', async () => {
      // Arrange
      const mockTeam: Omit<Team, 'id' | 'lastUpdated'> = {
        userId: 'user123',
        userName: 'John Doe',
        dogId: 'dog123',
        dogName: 'Rex',
        breed: 'German Shepherd',
        status: 'active'
      };
      
      const mockDocRef = { id: 'team123' };
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (setDoc as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      const result = await createTeam(mockTeam);
      
      // Assert
      expect(result).toBe('team123');
      expect(doc).toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalled();
    });
  });

  describe('getTeam', () => {
    it('should return team data when team exists', async () => {
      // Arrange
      const mockTeamId = 'test-team-id';
      const mockTeamData: Team = {
        id: mockTeamId,
        userId: 'user-1',
        userName: 'John Doe',
        dogId: 'dog-1',
        dogName: 'Max',
        breed: 'German Shepherd',
        status: 'active',
        lastUpdated: Date.now()
      };
      
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockTeamData
      });
      
      // Act
      const result = await getTeam(mockTeamId);
      
      // Assert
      expect(result).toEqual(mockTeamData);
      expect(getDoc).toHaveBeenCalled();
    });

    it('should return null when team does not exist', async () => {
      // Arrange
      const mockTeamId = 'non-existent-team';
      
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false
      });
      
      // Act
      const result = await getTeam(mockTeamId);
      
      // Assert
      expect(result).toBeNull();
      expect(getDoc).toHaveBeenCalled();
    });
  });

  describe('getAllTeams', () => {
    it('should return all teams', async () => {
      // Arrange
      const mockTeams = [
        {
          id: 'team-1',
          userId: 'user-1',
          userName: 'John Doe',
          dogId: 'dog-1',
          dogName: 'Max',
          breed: 'German Shepherd',
          status: 'active',
          lastUpdated: Date.now()
        },
        {
          id: 'team-2',
          userId: 'user-2',
          userName: 'Jane Smith',
          dogId: 'dog-2',
          dogName: 'Rex',
          breed: 'Belgian Malinois',
          status: 'inactive',
          lastUpdated: Date.now()
        }
      ];
      
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockTeams.map(team => ({
          data: () => team
        }))
      });
      
      // Act
      const result = await getAllTeams();
      
      // Assert
      expect(result).toEqual(mockTeams);
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe('getActiveTeams', () => {
    it('should return only active teams', async () => {
      // Arrange
      const mockTeams: Team[] = [
        {
          id: 'team-1',
          userId: 'user-1',
          userName: 'John Doe',
          dogId: 'dog-1',
          dogName: 'Max',
          breed: 'German Shepherd',
          status: 'on-duty',
          lastUpdated: Date.now()
        },
        {
          id: 'team-2',
          userId: 'user-2',
          userName: 'Jane Smith',
          dogId: 'dog-2',
          dogName: 'Rex',
          breed: 'Belgian Malinois',
          status: 'off-duty',
          lastUpdated: Date.now()
        }
      ];
      
      (query as jest.Mock).mockReturnValue({});
      (getDocs as jest.Mock).mockResolvedValue({
        docs: [mockTeams[0]].map(team => ({
          data: () => team
        }))
      });
      
      // Act
      const result = await getActiveTeams();
      
      // Assert
      expect(result).toEqual([mockTeams[0]]);
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe('updateTeam', () => {
    it('should update team data', async () => {
      // Arrange
      const mockTeamId = 'test-team-id';
      const mockTeamData: Partial<Team> = {
        status: 'on-duty',
        notes: 'Updated notes'
      };
      
      (updateDoc as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      await updateTeam(mockTeamId, mockTeamData);
      
      // Assert
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe('updateTeamStatus', () => {
    it('should update team status', async () => {
      // Arrange
      const mockTeamId = 'test-team-id';
      const mockStatus: Team['status'] = 'on-duty';
      
      (updateDoc as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      await updateTeamStatus(mockTeamId, mockStatus);
      
      // Assert
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe('updateTeamPosition', () => {
    it('should update team position and store position history', async () => {
      // Arrange
      const mockPositionUpdate: PositionUpdate = {
        teamId: 'test-team-id',
        location: new GeoPoint(37.7749, -122.4194),
        heading: 90,
        speed: 5,
        timestamp: Date.now(),
        accuracy: 10,
        batteryLevel: 85
      };
      
      (doc as jest.Mock).mockReturnValue({ id: 'position-id' });
      (setDoc as jest.Mock).mockResolvedValue(undefined);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      await updateTeamPosition(mockPositionUpdate);
      
      // Assert
      expect(updateDoc).toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalled();
    });
  });

  describe('getTeamPositionHistory', () => {
    it('should return position history for a team', async () => {
      // Arrange
      const mockTeamId = 'test-team-id';
      const mockStartTime = Date.now() - 3600000; // 1 hour ago
      const mockEndTime = Date.now();
      
      const mockPositions: PositionUpdate[] = [
        {
          teamId: mockTeamId,
          location: new GeoPoint(37.7749, -122.4194),
          heading: 90,
          speed: 5,
          timestamp: mockStartTime + 1800000, // 30 minutes ago
          accuracy: 10,
          batteryLevel: 85
        },
        {
          teamId: mockTeamId,
          location: new GeoPoint(37.7750, -122.4195),
          heading: 95,
          speed: 6,
          timestamp: mockStartTime + 2700000, // 15 minutes ago
          accuracy: 8,
          batteryLevel: 80
        }
      ];
      
      (query as jest.Mock).mockReturnValue({});
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockPositions.map(position => ({
          data: () => position
        }))
      });
      
      // Act
      const result = await getTeamPositionHistory(mockTeamId, mockStartTime, mockEndTime);
      
      // Assert
      expect(result).toEqual(mockPositions);
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe('subscribeToTeamPosition', () => {
    it('should set up a subscription to team position updates', () => {
      // Arrange
      const mockTeamId = 'test-team-id';
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      
      (onSnapshot as jest.Mock).mockReturnValue(mockUnsubscribe);
      
      // Act
      const unsubscribe = subscribeToTeamPosition(mockTeamId, mockCallback);
      
      // Assert
      expect(onSnapshot).toHaveBeenCalled();
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });

  describe('subscribeToActiveTeams', () => {
    it('should set up a subscription to active team updates', () => {
      // Arrange
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      
      (query as jest.Mock).mockReturnValue({});
      (onSnapshot as jest.Mock).mockReturnValue(mockUnsubscribe);
      
      // Act
      const unsubscribe = subscribeToActiveTeams(mockCallback);
      
      // Assert
      expect(query).toHaveBeenCalled();
      expect(onSnapshot).toHaveBeenCalled();
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });

  describe('getTeamsInArea', () => {
    it('should return teams within the specified area', async () => {
      // Arrange
      // Mock GeoPoint constructor to return real objects
      (GeoPoint as jest.Mock).mockImplementation(function(lat: number, lng: number) {
        return {
          latitude: lat,
          longitude: lng
        };
      });

      const mockTeams = [
        {
          id: 'team-1',
          userId: 'user-1',
          userName: 'User 1',
          dogId: 'dog-1',
          dogName: 'Dog 1',
          breed: 'German Shepherd',
          status: 'active',
          lastUpdated: Date.now(),
          location: new GeoPoint(0.0001, 0.0001), // Very close to origin
        },
        {
          id: 'team-2',
          userId: 'user-2',
          userName: 'User 2',
          dogId: 'dog-2',
          dogName: 'Dog 2',
          breed: 'Belgian Malinois',
          status: 'active',
          lastUpdated: Date.now(),
          location: new GeoPoint(89, 179), // Very far from origin
        }
      ];

      // Mock getAllTeams to return our test data
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockTeams.map(team => ({
          data: () => team
        }))
      });

      // Search around origin with small radius
      const center = new GeoPoint(0, 0);
      const radiusInKm = 1; // 1km radius

      // Act
      const result = await getTeamsInArea(center, radiusInKm);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('team-1');
    });
  });
}); 