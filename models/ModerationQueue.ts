import mongoose, { Document, Schema } from 'mongoose';

export interface IModerationQueue extends Document {
  contentId: string; // ID of the content being moderated
  contentType: 'profile' | 'message' | 'photo' | 'success_story';
  content: string; // The actual content text
  mediaUrls?: string[]; // For photos/videos
  authorId: string; // User who created the content
  authorProfileId: string; // Profile ID for context
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'auto_approved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  aiAnalysis?: {
    score: number; // 0-1, higher means more likely to be inappropriate
    categories: string[]; // e.g., ['violence', 'hate_speech', 'adult_content']
    confidence: number;
    analyzedAt: Date;
  };
  manualReview?: {
    reviewerId: string;
    decision: 'approve' | 'reject' | 'flag';
    reason?: string;
    notes?: string;
    reviewedAt: Date;
  };
  flags: {
    count: number;
    reasons: string[];
    reporters: string[]; // User IDs who flagged this content
  };
  retryCount: number;
  nextRetryAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ModerationQueueSchema = new Schema<IModerationQueue>({
  contentId: {
    type: String,
    required: true,
    index: true,
  },
  contentType: {
    type: String,
    enum: ['profile', 'message', 'photo', 'success_story'],
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  mediaUrls: [{
    type: String,
  }],
  authorId: {
    type: String,
    required: true,
    index: true,
  },
  authorProfileId: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged', 'auto_approved'],
    default: 'pending',
    index: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true,
  },
  aiAnalysis: {
    score: {
      type: Number,
      min: 0,
      max: 1,
    },
    categories: [{
      type: String,
    }],
    confidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    analyzedAt: {
      type: Date,
    },
  },
  manualReview: {
    reviewerId: {
      type: String,
    },
    decision: {
      type: String,
      enum: ['approve', 'reject', 'flag'],
    },
    reason: {
      type: String,
      maxlength: 500,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    reviewedAt: {
      type: Date,
    },
  },
  flags: {
    count: {
      type: Number,
      default: 0,
    },
    reasons: [{
      type: String,
    }],
    reporters: [{
      type: String,
    }],
  },
  retryCount: {
    type: Number,
    default: 0,
    max: 3,
  },
  nextRetryAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
ModerationQueueSchema.index({ status: 1, priority: -1, createdAt: -1 });
ModerationQueueSchema.index({ authorId: 1, status: 1 });
ModerationQueueSchema.index({ 'aiAnalysis.score': -1 });
ModerationQueueSchema.index({ 'flags.count': -1 });
ModerationQueueSchema.index({ nextRetryAt: 1 });

// Pre-save middleware to set priority based on content type and user history
ModerationQueueSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Set priority based on content type
    if (this.contentType === 'profile') {
      this.priority = 'high';
    } else if (this.contentType === 'message') {
      this.priority = 'medium';
    } else if (this.contentType === 'success_story') {
      this.priority = 'low';
    }

    // Check user history for priority adjustment
    try {
      const ModerationQueue = mongoose.model('ModerationQueue');
      const userHistory = await ModerationQueue.countDocuments({
        authorId: this.authorId,
        status: 'rejected',
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      });

      if (userHistory > 2) {
        this.priority = 'urgent';
      }
    } catch (error) {
      console.error('Error checking user moderation history:', error);
    }
  }
  next();
});

export default mongoose.models.ModerationQueue || mongoose.model<IModerationQueue>('ModerationQueue', ModerationQueueSchema);
