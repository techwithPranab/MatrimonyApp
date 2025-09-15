import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  recipientId: string;
  senderId?: string; // Optional for system notifications
  type: 'match' | 'message' | 'interest_sent' | 'interest_received' | 'interest_accepted' | 'interest_declined' | 'profile_view' | 'system' | 'subscription' | 'verification';
  title: string;
  message: string;
  data?: any; // Additional data specific to notification type
  
  // Actions
  actionUrl?: string; // URL to navigate when clicked
  actionText?: string; // Text for action button
  
  // Status
  isRead: boolean;
  isDeleted: boolean;
  readAt?: Date;
  
  // Delivery
  deliveryMethod: ('in_app' | 'email' | 'push')[];
  emailSent: boolean;
  emailSentAt?: Date;
  pushSent: boolean;
  pushSentAt?: Date;
  
  // Priority and scheduling
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: Date; // For delayed notifications
  expiresAt?: Date; // Auto-delete after this date
  
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipientId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: String,
    index: true,
  },
  type: {
    type: String,
    enum: ['match', 'message', 'interest_sent', 'interest_received', 'interest_accepted', 'interest_declined', 'profile_view', 'system', 'subscription', 'verification'],
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
  data: {
    type: Schema.Types.Mixed,
  },
  
  // Actions
  actionUrl: {
    type: String,
  },
  actionText: {
    type: String,
    maxlength: 50,
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: {
    type: Date,
  },
  
  // Delivery
  deliveryMethod: [{
    type: String,
    enum: ['in_app', 'email', 'push'],
    default: ['in_app'],
  }],
  emailSent: {
    type: Boolean,
    default: false,
  },
  emailSentAt: {
    type: Date,
  },
  pushSent: {
    type: Boolean,
    default: false,
  },
  pushSentAt: {
    type: Date,
  },
  
  // Priority and scheduling
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  scheduledFor: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, isRead: 1, isDeleted: 1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
NotificationSchema.index({ scheduledFor: 1 }); // For scheduled notifications
NotificationSchema.index({ expiresAt: 1 }); // For cleanup jobs
NotificationSchema.index({ priority: 1 });

// Pre-save middleware to set expiry for certain notification types
NotificationSchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    // Set default expiry based on notification type
    const expiryDays = {
      'match': 30,
      'message': 7,
      'interest_sent': 14,
      'interest_received': 14,
      'interest_accepted': 30,
      'interest_declined': 7,
      'profile_view': 3,
      'system': 60,
      'subscription': 90,
      'verification': 30
    };
    
    const days = expiryDays[this.type] || 30;
    this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  next();
});

// Static methods for creating specific notification types
NotificationSchema.statics.createMatch = function(recipientId: string, matchedUserId: string, matchedUserName: string) {
  return this.create({
    recipientId,
    senderId: matchedUserId,
    type: 'match',
    title: 'New Match! 🎉',
    message: `You have a new match with ${matchedUserName}! Start a conversation now.`,
    actionUrl: `/profile/${matchedUserId}`,
    actionText: 'View Profile',
    priority: 'high',
    deliveryMethod: ['in_app', 'email'],
    data: {
      matchedUserId,
      matchedUserName,
    }
  });
};

NotificationSchema.statics.createMessage = function(recipientId: string, senderId: string, senderName: string, preview: string) {
  return this.create({
    recipientId,
    senderId,
    type: 'message',
    title: `New message from ${senderName}`,
    message: preview.length > 100 ? preview.substring(0, 97) + '...' : preview,
    actionUrl: `/chat/${senderId}`,
    actionText: 'Reply',
    priority: 'medium',
    deliveryMethod: ['in_app', 'push'],
    data: {
      senderId,
      senderName,
      preview,
    }
  });
};

NotificationSchema.statics.createInterest = function(recipientId: string, senderId: string, senderName: string, type: 'sent' | 'received' | 'accepted' | 'declined') {
  const messages = {
    sent: `You sent an interest to ${senderName}`,
    received: `${senderName} is interested in your profile!`,
    accepted: `${senderName} accepted your interest! 🎉`,
    declined: `${senderName} declined your interest`
  };
  
  const priorities = {
    sent: 'low',
    received: 'high',
    accepted: 'high',
    declined: 'medium'
  } as const;
  
  return this.create({
    recipientId,
    senderId: type === 'sent' ? recipientId : senderId,
    type: `interest_${type}`,
    title: 'Interest Update',
    message: messages[type],
    actionUrl: `/profile/${senderId}`,
    actionText: type === 'received' ? 'View Profile' : 'View',
    priority: priorities[type],
    deliveryMethod: type === 'received' || type === 'accepted' ? ['in_app', 'email'] : ['in_app'],
    data: {
      senderId,
      senderName,
      interestType: type,
    }
  });
};

NotificationSchema.statics.createProfileView = function(recipientId: string, viewerId: string, viewerName: string) {
  return this.create({
    recipientId,
    senderId: viewerId,
    type: 'profile_view',
    title: 'Profile View',
    message: `${viewerName} viewed your profile`,
    actionUrl: `/profile/${viewerId}`,
    actionText: 'View Back',
    priority: 'low',
    deliveryMethod: ['in_app'],
    data: {
      viewerId,
      viewerName,
    }
  });
};

NotificationSchema.statics.createSystem = function(recipientId: string, title: string, message: string, actionUrl?: string, priority = 'medium') {
  return this.create({
    recipientId,
    type: 'system',
    title,
    message,
    actionUrl,
    actionText: actionUrl ? 'View Details' : undefined,
    priority,
    deliveryMethod: ['in_app', 'email'],
  });
};

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
