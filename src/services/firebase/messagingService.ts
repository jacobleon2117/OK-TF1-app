/**
 * Messaging Service
 * Handles all messaging-related operations in Firebase
 * 
 * Database Structure:
 * messages/
 *   messageId/
 *     senderId: string
 *     receiverId: string
 *     content: string
 *     timestamp: timestamp
 *     read: boolean
 *     type: 'text' | 'image' | 'location' | 'alert'
 *     metadata?: {
 *       latitude?: number
 *       longitude?: number
 *       imageUrl?: string
 *       alertType?: string
 *       alertPriority?: 'low' | 'medium' | 'high'
 *     }
 * 
 * conversations/
 *   conversationId/
 *     participants: string[]
 *     lastMessage: {
 *       text: string
 *       senderId: string
 *       timestamp: timestamp
 *     }
 *     unreadCount: Record<string, number>
 *     createdAt: timestamp
 *     updatedAt: timestamp
 */

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
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  setDoc,
  writeBatch,
  increment as firestoreIncrement
} from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * Type Definitions
 */
export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  read: boolean;
  type: 'text' | 'image' | 'location' | 'alert';
  metadata?: {
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
    alertType?: string;
    alertPriority?: 'low' | 'medium' | 'high';
  };
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  unreadCount: Record<string, number>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Utility Functions
 */
export const messagingUtils = {
  formatMessageForDisplay: (message: Message) => ({
    id: message.id,
    senderId: message.senderId,
    content: message.content,
    timestamp: message.timestamp.toDate(),
    read: message.read,
    type: message.type,
    metadata: message.metadata
  }),

  formatConversationForDisplay: (conversation: Conversation) => ({
    id: conversation.id,
    participants: conversation.participants,
    lastMessage: conversation.lastMessage ? {
      text: conversation.lastMessage.text,
      senderId: conversation.lastMessage.senderId,
      timestamp: conversation.lastMessage.timestamp.toDate()
    } : null,
    unreadCount: conversation.unreadCount,
    updatedAt: conversation.updatedAt.toDate()
  })
};

/**
 * Core Messaging Functions
 */

/**
 * Sends a message and updates the conversation
 * @param message - The message to send (excluding id, timestamp, and read status)
 * @returns Promise<DocumentReference> - Reference to the created message
 * 
 * @example
 * // Send a text message
 * const messageRef = await sendMessage({
 *   senderId: 'user1',
 *   receiverId: 'user2',
 *   content: 'Hello!',
 *   type: 'text'
 * });
 * 
 * // Send a location message
 * const locationMessageRef = await sendMessage({
 *   senderId: 'user1',
 *   receiverId: 'user2',
 *   content: 'My location',
 *   type: 'location',
 *   metadata: {
 *     latitude: 37.7749,
 *     longitude: -122.4194
 *   }
 * });
 */
export const sendMessage = async (
  message: Omit<Message, 'id' | 'timestamp' | 'read'>
): Promise<DocumentReference> => {
  try {
    // Add timestamp and read status
    const messageWithMetadata = {
      ...message,
      timestamp: serverTimestamp(),
      read: false
    };
    
    // Add to messages collection
    const messageRef = await addDoc(collection(db, 'messages'), messageWithMetadata);
    
    // Update or create conversation
    const conversationId = getConversationId(message.senderId, message.receiverId);
    const conversationRef = doc(db, 'conversations', conversationId);
    
    const conversationDoc = await getDoc(conversationRef);
    
    if (conversationDoc.exists()) {
      // Update existing conversation
      await updateDoc(conversationRef, {
        lastMessage: {
          content: message.content,
          timestamp: messageWithMetadata.timestamp,
          senderId: message.senderId
        },
        updatedAt: serverTimestamp(),
        [`unreadCount.${message.receiverId}`]: firestoreIncrement(1)
      });
    } else {
      // Create new conversation
      await setDoc(conversationRef, {
        participants: [message.senderId, message.receiverId],
        lastMessage: {
          content: message.content,
          timestamp: messageWithMetadata.timestamp,
          senderId: message.senderId
        },
        unreadCount: {
          [message.senderId]: 0,
          [message.receiverId]: 1
        },
        updatedAt: serverTimestamp()
      });
    }
    
    return messageRef;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
};

/**
 * Gets messages between two users
 * @param userId1 - First user's ID
 * @param userId2 - Second user's ID
 * @param limit - Maximum number of messages to return (default: 50)
 * @returns Promise<QuerySnapshot> - Snapshot containing the messages
 * 
 * @example
 * // Get last 50 messages between users
 * const messages = await getMessagesBetweenUsers('user1', 'user2');
 * 
 * // Get last 10 messages
 * const recentMessages = await getMessagesBetweenUsers('user1', 'user2', 10);
 */
export const getMessagesBetweenUsers = async (
  userId1: string,
  userId2: string,
  limit: number = 50
): Promise<QuerySnapshot> => {
  try {
    const conversationId = getConversationId(userId1, userId2);
    
    const messagesQuery = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    
    return getDocs(messagesQuery);
  } catch (error) {
    console.error('Error getting messages:', error);
    throw new Error('Failed to retrieve messages');
  }
};

/**
 * Sets up a real-time listener for messages in a conversation
 * @param conversationId - The conversation ID to listen to
 * @param callback - Function to call when messages update
 * @returns Unsubscribe function
 * 
 * @example
 * // Set up message listener
 * useEffect(() => {
 *   const unsubscribe = subscribeToMessages('conversation123', (messages) => {
 *     setMessages(messages);
 *   });
 *   
 *   return () => unsubscribe();
 * }, []);
 */
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
): Unsubscribe => {
  const messagesQuery = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages: Message[] = [];
    snapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    callback(messages);
  });
};

/**
 * Performance Tips:
 * 1. Use pagination for large message histories
 * 2. Implement message caching
 * 3. Batch message updates when possible
 * 4. Use compound queries with proper indexes
 * 5. Implement message compression for large content
 */

/**
 * Security Rules Example:
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /messages/{messageId} {
 *       allow read: if request.auth != null && 
 *         (resource.data.senderId == request.auth.uid || 
 *          resource.data.receiverId == request.auth.uid);
 *       allow create: if request.auth != null && 
 *         request.resource.data.senderId == request.auth.uid;
 *     }
 *     
 *     match /conversations/{conversationId} {
 *       allow read: if request.auth != null && 
 *         request.auth.uid in resource.data.participants;
 *       allow write: if request.auth != null && 
 *         request.auth.uid in resource.data.participants;
 *     }
 *   }
 * }
 */

// Helper function to generate consistent conversation IDs
const getConversationId = (userId1: string, userId2: string): string => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  const conversationRef = doc(db, 'conversations', conversationId);
  
  await updateDoc(conversationRef, {
    [`unreadCount.${userId}`]: firestoreIncrement(-1)
  });
  
  // Also update all unread messages
  const unreadMessagesQuery = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    where('receiverId', '==', userId),
    where('read', '==', false)
  );
  
  const unreadMessages = await getDocs(unreadMessagesQuery);
  
  const batch = writeBatch(db);
  unreadMessages.docs.forEach(doc => {
    batch.update(doc.ref, { read: true });
  });
  
  await batch.commit();
};

export const getUserConversations = async (
  userId: string
): Promise<QuerySnapshot> => {
  const conversationsQuery = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  
  return getDocs(conversationsQuery);
};

export const getConversationById = async (
  conversationId: string
): Promise<DocumentSnapshot> => {
  const conversationRef = doc(db, 'conversations', conversationId);
  return getDoc(conversationRef);
};

export const deleteMessage = async (
  messageId: string
): Promise<void> => {
  const messageRef = doc(db, 'messages', messageId);
  await deleteDoc(messageRef);
};

export const subscribeToConversations = (
  userId: string,
  callback: (conversations: Conversation[]) => void
): Unsubscribe => {
  const conversationsQuery = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  
  return onSnapshot(conversationsQuery, (snapshot) => {
    const conversations: Conversation[] = [];
    snapshot.forEach(doc => {
      conversations.push({ id: doc.id, ...doc.data() } as Conversation);
    });
    callback(conversations);
  });
}; 