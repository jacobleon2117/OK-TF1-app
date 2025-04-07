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
import { db } from '../../../config/firebase';
import {
  getUserById,
  getAllUsers,
  getUsersByOrganization,
  getUsersByRole,
  updateUser,
  updateUserStatus,
  updateUserRole,
  updateUserPreferences,
  User
} from '../userService';

// Mock Firebase modules
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    now: jest.fn(() => new Date()),
  },
}));

jest.mock('../../../config/firebase', () => ({
  db: {},
}));

describe('userService', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'team_member',
    organizationId: 'org-1',
    status: 'active',
    lastLogin: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    phoneNumber: '1234567890',
    emergencyContact: {
      name: 'Emergency Contact',
      phoneNumber: '0987654321',
      relationship: 'Family',
    },
    preferences: {
      notifications: true,
      emailUpdates: true,
      darkMode: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user data when user exists', async () => {
      const mockDoc = {
        exists: () => true,
        data: () => mockUser,
        id: 'user-1',
      };
      (getDoc as jest.Mock).mockResolvedValue(mockDoc);

      const result = await getUserById('user-1');

      expect(doc).toHaveBeenCalledWith(db, 'users', 'user-1');
      expect(getDoc).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      const mockDoc = {
        exists: () => false,
      };
      (getDoc as jest.Mock).mockResolvedValue(mockDoc);

      const result = await getUserById('non-existent');

      expect(doc).toHaveBeenCalledWith(db, 'users', 'non-existent');
      expect(getDoc).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockQuerySnapshot = {
        docs: [
          { id: 'user-1', data: () => mockUser },
          { id: 'user-2', data: () => ({ ...mockUser, id: 'user-2' }) },
        ],
      };
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await getAllUsers();

      expect(collection).toHaveBeenCalledWith(db, 'users');
      expect(getDocs).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockUser);
      expect(result[1]).toEqual({ ...mockUser, id: 'user-2' });
    });
  });

  describe('getUsersByOrganization', () => {
    it('should return users for a specific organization', async () => {
      const mockQuerySnapshot = {
        docs: [
          { id: 'user-1', data: () => mockUser },
          { id: 'user-2', data: () => ({ ...mockUser, id: 'user-2' }) },
        ],
      };
      (query as jest.Mock).mockReturnValue('users-query');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await getUsersByOrganization('org-1');

      expect(collection).toHaveBeenCalledWith(db, 'users');
      expect(where).toHaveBeenCalledWith('organizationId', '==', 'org-1');
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalledWith('users-query');
      expect(result).toHaveLength(2);
    });
  });

  describe('getUsersByRole', () => {
    it('should return users with a specific role', async () => {
      const mockQuerySnapshot = {
        docs: [
          { id: 'user-1', data: () => mockUser },
          { id: 'user-2', data: () => ({ ...mockUser, id: 'user-2' }) },
        ],
      };
      (query as jest.Mock).mockReturnValue('users-query');
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await getUsersByRole('team_member');

      expect(collection).toHaveBeenCalledWith(db, 'users');
      expect(where).toHaveBeenCalledWith('role', '==', 'team_member');
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalledWith('users-query');
      expect(result).toHaveLength(2);
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const updateData = {
        displayName: 'Updated Name',
        phoneNumber: '9876543210',
      };
      (doc as jest.Mock).mockReturnValue('user-ref');

      await updateUser('user-1', updateData);

      expect(doc).toHaveBeenCalledWith(db, 'users', 'user-1');
      expect(updateDoc).toHaveBeenCalledWith('user-ref', {
        ...updateData,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status', async () => {
      (doc as jest.Mock).mockReturnValue('user-ref');

      await updateUserStatus('user-1', 'inactive');

      expect(doc).toHaveBeenCalledWith(db, 'users', 'user-1');
      expect(updateDoc).toHaveBeenCalledWith('user-ref', {
        status: 'inactive',
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      (doc as jest.Mock).mockReturnValue('user-ref');

      await updateUserRole('user-1', 'coordinator');

      expect(doc).toHaveBeenCalledWith(db, 'users', 'user-1');
      expect(updateDoc).toHaveBeenCalledWith('user-ref', {
        role: 'coordinator',
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateUserPreferences', () => {
    it('should update user preferences', async () => {
      const newPreferences = {
        notifications: false,
        emailUpdates: false,
        darkMode: true,
      };
      (doc as jest.Mock).mockReturnValue('user-ref');

      await updateUserPreferences('user-1', newPreferences);

      expect(doc).toHaveBeenCalledWith(db, 'users', 'user-1');
      expect(updateDoc).toHaveBeenCalledWith('user-ref', {
        preferences: newPreferences,
        updatedAt: expect.any(Date),
      });
    });
  });
}); 