import mongoose, { Document, Schema } from 'mongoose';

export interface IModerationRule extends Document {
  name: string;
  description: string;
  type: 'keyword' | 'pattern' | 'ai_threshold' | 'user_behavior' | 'content_length';
  contentType: 'profile' | 'message' | 'photo' | 'success_story' | 'all';
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'flag' | 'reject' | 'review' | 'approve' | 'escalate';

  // For keyword/pattern based rules
  keywords?: string[];
  patterns?: string[]; // Regex patterns
  caseSensitive?: boolean;

  // For AI threshold rules
  aiThreshold?: {
    minScore: number;
    categories: string[];
  };

  // For user behavior rules
  userBehavior?: {
    maxViolations: number;
    timeWindow: number; // in days
    actions: string[];
  };

  // For content length rules
  contentLength?: {
    minLength?: number;
    maxLength?: number;
  };

  isActive: boolean;
  priority: number; // Higher number = higher priority
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ModerationRuleSchema = new Schema<IModerationRule>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  type: {
    type: String,
    enum: ['keyword', 'pattern', 'ai_threshold', 'user_behavior', 'content_length'],
    required: true,
  },
  contentType: {
    type: String,
    enum: ['profile', 'message', 'photo', 'success_story', 'all'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  action: {
    type: String,
    enum: ['flag', 'reject', 'review', 'approve', 'escalate'],
    required: true,
  },

  // Keyword/pattern rules
  keywords: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  patterns: [{
    type: String, // Regex patterns
  }],
  caseSensitive: {
    type: Boolean,
    default: false,
  },

  // AI threshold rules
  aiThreshold: {
    minScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    categories: [{
      type: String,
    }],
  },

  // User behavior rules
  userBehavior: {
    maxViolations: {
      type: Number,
      min: 1,
    },
    timeWindow: {
      type: Number, // in days
      min: 1,
    },
    actions: [{
      type: String,
    }],
  },

  // Content length rules
  contentLength: {
    minLength: {
      type: Number,
      min: 0,
    },
    maxLength: {
      type: Number,
      min: 1,
    },
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
ModerationRuleSchema.index({ type: 1, contentType: 1, isActive: 1 });
ModerationRuleSchema.index({ priority: -1 });
ModerationRuleSchema.index({ severity: 1 });

// Pre-save validation
ModerationRuleSchema.pre('save', function(next) {
  const validateRuleConfig = () => {
    switch (this.type) {
      case 'keyword':
        return validateKeywordRule();
      case 'pattern':
        return validatePatternRule();
      case 'ai_threshold':
        return validateAiThresholdRule();
      case 'user_behavior':
        return validateUserBehaviorRule();
      case 'content_length':
        return validateContentLengthRule();
      default:
        return null;
    }
  };

  const validateKeywordRule = () => {
    if (!this.keywords || this.keywords.length === 0) {
      return new Error('Keywords are required for keyword-based rules');
    }
    return null;
  };

  const validatePatternRule = () => {
    if (!this.patterns || this.patterns.length === 0) {
      return new Error('Patterns are required for pattern-based rules');
    }
    // Validate regex patterns
    for (const pattern of this.patterns) {
      try {
        new RegExp(pattern);
      } catch (regexError) {
        return new Error(`Invalid regex pattern: ${pattern}`);
      }
    }
    return null;
  };

  const validateAiThresholdRule = () => {
    if (!this.aiThreshold?.minScore) {
      return new Error('AI threshold score is required for AI-based rules');
    }
    return null;
  };

  const validateUserBehaviorRule = () => {
    if (!this.userBehavior?.maxViolations || !this.userBehavior?.timeWindow) {
      return new Error('User behavior parameters are required');
    }
    return null;
  };

  const validateContentLengthRule = () => {
    if (!this.contentLength?.minLength && !this.contentLength?.maxLength) {
      return new Error('Content length limits are required');
    }
    return null;
  };

  const error = validateRuleConfig();
  if (error) {
    return next(error);
  }
  next();
});

export default mongoose.models.ModerationRule || mongoose.model<IModerationRule>('ModerationRule', ModerationRuleSchema);
