import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'data_manager' | 'support_agent' | 'moderator';
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  
  // Activity tracking
  loginHistory: {
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    location?: string;
  }[];
  
  // Audit trail
  activityLog: {
    action: string;
    targetType: string;
    targetId: string;
    details: any;
    timestamp: Date;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'data_manager', 'support_agent', 'moderator'],
    required: true,
    default: 'support_agent',
  },
  permissions: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLoginAt: {
    type: Date,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
  },
  
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    location: String,
  }],
  
  activityLog: [{
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    details: Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

// Indexes
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1, isActive: 1 });
AdminSchema.index({ 'activityLog.timestamp': -1 });

// Role-based permission mapping
const ROLE_PERMISSIONS = {
  super_admin: [
    'user.approve', 'user.reject', 'user.suspend', 'user.edit', 'user.view',
    'content.approve', 'content.reject', 'content.edit', 'content.delete',
    'payment.manage', 'payment.refund', 'payment.view',
    'admin.create', 'admin.edit', 'admin.delete', 'admin.view',
    'analytics.view', 'settings.edit', 'audit.view'
  ],
  data_manager: [
    'user.approve', 'user.reject', 'user.edit', 'user.view',
    'content.approve', 'content.reject', 'content.edit',
    'analytics.view'
  ],
  support_agent: [
    'user.view', 'user.suspend', 'ticket.manage', 'notification.send'
  ],
  moderator: [
    'user.view', 'user.suspend', 'content.approve', 'content.reject'
  ]
};

// Method to check permissions
AdminSchema.methods.hasPermission = function(permission: string) {
  return this.permissions.includes(permission) || 
         ROLE_PERMISSIONS[this.role as keyof typeof ROLE_PERMISSIONS]?.includes(permission);
};

// Method to log activity
AdminSchema.methods.logActivity = function(action: string, targetType: string, targetId: string, details: any) {
  this.activityLog.push({
    action,
    targetType,
    targetId,
    details,
    timestamp: new Date()
  });
  
  // Keep only last 1000 activities
  if (this.activityLog.length > 1000) {
    this.activityLog = this.activityLog.slice(-1000);
  }
  
  return this.save();
};

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
