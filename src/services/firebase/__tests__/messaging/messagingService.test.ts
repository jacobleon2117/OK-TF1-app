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
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  setDoc,
  writeBatch,
  increment as firestoreIncrement
} from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import {
  sendMessage,
  getMessagesBetweenUsers,
  markMessagesAsRead,
  getUserConversations,
  getConversationById,
  deleteMessage,
  subscribeToMessages,
  subscribeToConversations,
  Message,
  Conversation
} from '../../messagingService';

// Mock Firebase Firestore
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
  orderBy: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    now: jest.fn(),
    fromDate: jest.fn()
  },
  serverTimestamp: jest.fn(),
  onSnapshot: jest.fn(),
  setDoc: jest.fn(),
  writeBatch: jest.fn(),
  increment: jest.fn()
}));

jest.mock('../../../config/firebase', () => ({
  db: {}
}));

describe('Messaging Service', () => {
  const mockMessage: Omit<Message, 'id' | 'timestamp' | 'read'> = {
    senderId: 'user1',
    receiverId: 'user2',
    content: 'Hello!',
    type: 'text'
  };

  const mockConversation: Conversation = {
    id: 'user1_user2',
    participants: ['user1', 'user2'],
    lastMessage: {
      text: 'Hello!',
      senderId: 'user1',
      timestamp: Timestamp.now()
    },
    unreadCount: {
      user1: 0,
      user2: 1
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send a message and create/update conversation', async () => {
      const mockMessageRef = { id: 'message1' };
      const mockConversationRef = { id: 'user1_user2' };

      (addDoc as jest.Mock).mockResolvedValueOnce(mockMessageRef);
      (doc as jest.Mock).mockReturnValueOnce(mockConversationRef);
      (getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => true });

      const result = await sendMessage(mockMessage);

      expect(addDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          ...mockMessage,
          timestamp: expect.any(Object),
          read: false
        })
      );
      expect(result).toBe(mockMessageRef);
    });
  });

  describe('getMessagesBetweenUsers', () => {
    it('should fetch messages between two users', async () => {
      const mockQuerySnapshot = {
        docs: [
          {
            id: 'message1',
            data: () => ({ ...mockMessage, timestamp: Timestamp.now() })
          }
        ]
      };

      (getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot);

      const result = await getMessagesBetweenUsers('user1', 'user2');

      expect(getDocs).toHaveBeenCalled();
      expect(result).toBe(mockQuerySnapshot);
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark messages as read and update conversation', async () => {
      const mockConversationRef = { id: 'user1_user2' };
      const mockUnreadMessages = {
        docs: [
          { ref: 'message1' },
          { ref: 'message2' }
        ]
      };

      (doc as jest.Mock).mockReturnValueOnce(mockConversationRef);
      (getDocs as jest.Mock).mockResolvedValueOnce(mockUnreadMessages);

      await markMessagesAsRead('user1_user2', 'user2');

      expect(updateDoc).toHaveBeenCalledWith(
        mockConversationRef,
        expect.objectContaining({
          'unreadCount.user2': expect.any(Object)
        })
      );
    });
  });

  describe('getUserConversations', () => {
    it('should fetch user conversations', async () => {
      const mockQuerySnapshot = {
        docs: [
          {
            id: 'conversation1',
            data: () => mockConversation
          }
        ]
      };

      (getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot);

      const result = await getUserConversations('user1');

      expect(getDocs).toHaveBeenCalled();
      expect(result).toBe(mockQuerySnapshot);
    });
  });

  describe('subscribeToMessages', () => {
    it('should subscribe to messages and call callback with updates', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();

      (onSnapshot as jest.Mock).mockImplementation((query, callback) => {
        callback({
          docs: [
            {
              id: 'message1',
              data: () => ({ ...mockMessage, timestamp: Timestamp.now() })
            }
          ]
        });
        return mockUnsubscribe;
      });

      const unsubscribe = subscribeToMessages('user1_user2', mockCallback);

      expect(onSnapshot).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(expect.any(Array));
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });

  describe('subscribeToConversations', () => {
    it('should subscribe to conversations and call callback with updates', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();

      (onSnapshot as jest.Mock).mockImplementation((query, callback) => {
        callback({
          docs: [
            {
              id: 'conversation1',
              data: () => mockConversation
            }
          ]
        });
        return mockUnsubscribe;
      });

      const unsubscribe = subscribeToConversations('user1', mockCallback);

      expect(onSnapshot).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(expect.any(Array));
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
}); 