import mongoose, { Document, Schema } from 'mongoose';

export interface ISupportTicket extends Document {
  _id: string;
  userId: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'profile' | 'matching' | 'abuse' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  
  // Assignment
  assignedTo?: string; // Admin ID
  assignedAt?: Date;
  
  // Communication
  messages: {
    senderId: string;
    senderType: 'user' | 'admin';
    message: string;
    attachments?: string[];
    timestamp: Date;
    isInternal?: boolean; // For admin-only notes
  }[];
  
  // Resolution
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolutionTime?: number; // in minutes
  
  // Metadata
  tags: string[];
  escalationLevel: number;
  userSatisfactionRating?: number; // 1-5
  
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['technical', 'billing', 'profile', 'matching', 'abuse', 'general'],
    required: true,
    index: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true,
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed', 'escalated'],
    default: 'open',
    index: true,
  },
  
  assignedTo: {
    type: String,
    index: true,
  },
  assignedAt: {
    type: Date,
  },
  
  messages: [{
    senderId: { type: String, required: true },
    senderType: { 
      type: String, 
      enum: ['user', 'admin'], 
      required: true 
    },
    message: { type: String, required: true },
    attachments: [String],
    timestamp: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false },
  }],
  
  resolution: String,
  resolvedBy: String,
  resolvedAt: Date,
  resolutionTime: Number,
  
  tags: [String],
  escalationLevel: { type: Number, default: 0 },
  userSatisfactionRating: {
    type: Number,
    min: 1,
    max: 5,
  },
}, {
  timestamps: true,
});

// SupportTicketSchema.index({ status: 1, priority: -1, createdAt: -1 });
// SupportTicketSchema.index({ assignedTo: 1, status: 1 });
// SupportTicketSchema.index({ category: 1, status: 1 });

// Auto-generate ticket number
SupportTicketSchema.pre('save', function(next) {
  if (!this.ticketNumber) {
    this.ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  next();
});

export default mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
