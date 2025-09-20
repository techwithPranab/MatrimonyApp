import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  _id: string;
  reporterId: string;
  targetUserId: string;
  targetType: 'profile' | 'message' | 'photo';
  targetId?: string; // ID of specific message/photo if applicable
  reason: 'inappropriate_content' | 'fake_profile' | 'harassment' | 'spam' | 'other';
  description?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  moderatorId?: string;
  moderatorNotes?: string;
  actionTaken?: 'none' | 'warning' | 'content_removed' | 'account_suspended' | 'account_banned';
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  reporterId: {
    type: String,
    required: true,
  },
  targetUserId: {
    type: String,
    required: true,
  },
  targetType: {
    type: String,
    enum: ['profile', 'message', 'photo'],
    required: true,
  },
  targetId: {
    type: String,
    // Optional - only for specific messages/photos
  },
  reason: {
    type: String,
    enum: ['inappropriate_content', 'fake_profile', 'harassment', 'spam', 'other'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending',
    required: true,
  },
  moderatorId: {
    type: String,
  },
  moderatorNotes: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  actionTaken: {
    type: String,
    enum: ['none', 'warning', 'content_removed', 'account_suspended', 'account_banned'],
    default: 'none',
  },
  resolvedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
ReportSchema.index({ reporterId: 1 });
ReportSchema.index({ targetUserId: 1 });
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ moderatorId: 1 });
ReportSchema.index({ reason: 1 });

export interface IAuditLog extends Document {
  _id: string;
  actorId: string;
  actorType: 'user' | 'moderator' | 'admin' | 'system';
  action: string;
  targetType: 'user' | 'profile' | 'message' | 'subscription' | 'report';
  targetId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  actorId: {
    type: String,
    required: true,
  },
  actorType: {
    type: String,
    enum: ['user', 'moderator', 'admin', 'system'],
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  targetType: {
    type: String,
    enum: ['user', 'profile', 'message', 'subscription', 'report'],
    required: true,
  },
  targetId: {
    type: String,
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Indexes
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ targetType: 1, targetId: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const Report = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
