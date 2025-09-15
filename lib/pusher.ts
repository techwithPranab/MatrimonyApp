import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Check if Pusher is properly configured
const isPusherConfigured = () => {
  return !!(
    process.env.PUSHER_APP_ID && 
    process.env.PUSHER_KEY && 
    process.env.PUSHER_SECRET && 
    process.env.PUSHER_CLUSTER
  );
};

// Server-side Pusher instance
export const pusherServer = isPusherConfigured() ? new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
}) : null;

// Client-side Pusher instance
export const pusherClient = (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER) ? 
  new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    authEndpoint: '/api/pusher/auth',
    auth: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }) : null;

// Channel naming conventions
export const getConversationChannelName = (conversationId: string) => 
  `private-conversation-${conversationId}`;

export const getUserPresenceChannelName = (userId: string) => 
  `presence-user-${userId}`;

export const getTypingChannelName = (conversationId: string) => 
  `private-typing-${conversationId}`;

// Event names
export const PUSHER_EVENTS = {
  MESSAGE_NEW: 'message:new',
  MESSAGE_UPDATED: 'message:updated',
  MESSAGE_DELETED: 'message:deleted',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  CONVERSATION_UPDATED: 'conversation:updated',
} as const;

// Types
export interface PusherMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'system';
  sentAt: string;
  attachments?: {
    type: 'image';
    url: string;
    filename: string;
  }[];
}

export interface TypingEvent {
  userId: string;
  userName: string;
  conversationId: string;
}

export interface UserPresence {
  userId: string;
  userName: string;
  isOnline: boolean;
  lastSeen: string;
}
