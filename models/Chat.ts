import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  channelId: string; // Pusher channel ID
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  participants: [{
    type: String,
    required: true,
  }],
  lastMessage: {
    type: String,
    trim: true,
  },
  lastMessageAt: {
    type: Date,
  },
  channelId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ channelId: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

export interface IMessage extends Document {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'system';
  attachments?: {
    type: 'image';
    url: string;
    filename: string;
  }[];
  readBy: {
    userId: string;
    readAt: Date;
  }[];
  isDeleted: boolean;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'system'],
    default: 'text',
    required: true,
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  }],
  readBy: [{
    userId: {
      type: String,
      required: true,
    },
    readAt: {
      type: Date,
      required: true,
    },
  }],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
MessageSchema.index({ conversationId: 1, sentAt: -1 });
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ sentAt: -1 });
MessageSchema.index({ isDeleted: 1 });

export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
