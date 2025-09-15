import mongoose, { Document, Schema } from 'mongoose';

export interface INotificationPreferences extends Document {
  _id: string;
  userId: string;
  
  // Notification types preferences
  preferences: {
    matches: {
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
    messages: {
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
    interests: {
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
    profileViews: {
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
    system: {
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
    subscription: {
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
    verification: {
      inApp: boolean;
      email: boolean;
      push: boolean;
    };
  };
  
  // General preferences
  dailyDigest: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  
  // Quiet hours
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    timezone: string;
  };
  
  // Frequency limits (to prevent spam)
  maxDailyNotifications: number;
  maxHourlyNotifications: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const NotificationPreferencesSchema = new Schema<INotificationPreferences>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  preferences: {
    matches: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    messages: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
    interests: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
    profileViews: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },
    system: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
    subscription: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
    verification: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
  },
  
  dailyDigest: {
    type: Boolean,
    default: true,
  },
  weeklyDigest: {
    type: Boolean,
    default: true,
  },
  marketingEmails: {
    type: Boolean,
    default: false,
  },
  
  quietHours: {
    enabled: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: String,
      default: '22:00',
      validate: {
        validator: function(v: string) {
          return /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v);
        },
        message: 'Invalid time format. Use HH:MM format.'
      }
    },
    endTime: {
      type: String,
      default: '08:00',
      validate: {
        validator: function(v: string) {
          return /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v);
        },
        message: 'Invalid time format. Use HH:MM format.'
      }
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
  },
  
  maxDailyNotifications: {
    type: Number,
    default: 50,
    min: 1,
    max: 100,
  },
  maxHourlyNotifications: {
    type: Number,
    default: 10,
    min: 1,
    max: 20,
  },
}, {
  timestamps: true,
});

// Static method to get or create preferences for a user
NotificationPreferencesSchema.statics.getOrCreate = async function(userId: string) {
  let preferences = await this.findOne({ userId });
  if (!preferences) {
    preferences = await this.create({ userId });
  }
  return preferences;
};

// Method to check if notifications should be sent based on preferences
NotificationPreferencesSchema.methods.shouldSendNotification = function(
  notificationType: keyof INotificationPreferences['preferences'],
  deliveryMethod: 'inApp' | 'email' | 'push'
): boolean {
  const typePrefs = this.preferences[notificationType];
  if (!typePrefs) return false;
  
  return typePrefs[deliveryMethod] === true;
};

// Method to check if we're in quiet hours
NotificationPreferencesSchema.methods.isInQuietHours = function(): boolean {
  if (!this.quietHours.enabled) return false;
  
  const now = new Date();
  const userTimezone = this.quietHours.timezone;
  
  // Convert current time to user's timezone
  const userTime = new Intl.DateTimeFormat('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    timeZone: userTimezone
  }).format(now);
  
  const currentTime = userTime;
  const startTime = this.quietHours.startTime;
  const endTime = this.quietHours.endTime;
  
  // Handle overnight quiet hours (e.g., 22:00 to 08:00)
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  } else {
    return currentTime >= startTime && currentTime <= endTime;
  }
};

export default mongoose.models.NotificationPreferences || mongoose.model<INotificationPreferences>('NotificationPreferences', NotificationPreferencesSchema);
