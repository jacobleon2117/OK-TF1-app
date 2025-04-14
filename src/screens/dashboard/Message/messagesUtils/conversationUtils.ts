import { User } from '@/services/firebase/userService';

/**
 * create a new conversation with users
 */
export const createConversation = async (participants: User[]): Promise<string> => {
  // this is a placeholder. We need to create a conversation in Firebase!
  console.log(
    'Creating new conversation with participants:',
    participants.map(p => p.id)
  );
  return 'new-conversation-id';
};

/**
 * get formatted display name for a conversation
 */
export const getConversationDisplayName = (
  conversation: { participants: string[] },
  currentUserId: string,
  userMap: Record<string, User>
): string => {
  // for a 1:1 conversation, display the other user's name
  if (conversation.participants.length === 2) {
    const otherUserId = conversation.participants.find(id => id !== currentUserId);
    return otherUserId && userMap[otherUserId] ? userMap[otherUserId].displayName : 'Unknown User';
  }

  // for a group conversation, list first few names
  const otherParticipants = conversation.participants
    .filter(id => id !== currentUserId)
    .map(id => userMap[id]?.displayName || 'Unknown')
    .slice(0, 3);

  if (conversation.participants.length > 4) {
    return `${otherParticipants.join(', ')} + ${conversation.participants.length - 4} others`;
  }

  return otherParticipants.join(', ');
};

/**
 * format timestamp for display in messages
 */
export const formatMessageTime = (timestamp: any): string => {
  if (!timestamp) return '';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // today - show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    // yesterday
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // this week - show day name
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    // older - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};
