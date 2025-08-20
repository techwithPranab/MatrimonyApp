import mongoose, { Document, Schema } from 'mongoose';

export interface IUserApproval extends Document {
  _id: string;
  userId: string;
  profileData: any; // Full profile snapshot at time of submission
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  submissionType: 'new_registration' | 'profile_update' | 'photo_upload' | 'document_upload';
  
  // Review details
  reviewedBy?: string; // Admin ID
  reviewedAt?: Date;
  reviewNotes?: string;
  rejectionReason?: string;
  
  // Documents/verification
  documents: {
    type: 'government_id' | 'education_cert' | 'income_proof' | 'photo';
    url: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewNotes?: string;
  }[];
  
  // Verification checks
  verificationChecks: {
    emailVerified: boolean;
    phoneVerified: boolean;
    documentsVerified: boolean;
    photoVerified: boolean;
    manualReviewRequired: boolean;
  };
  
  // Priority and flags
  priority: 'low' | 'medium' | 'high' | 'urgent';
  flags: string[]; // e.g., ['suspicious_activity', 'duplicate_profile', 'inappropriate_content']
  
  createdAt: Date;
  updatedAt: Date;
}

const UserApprovalSchema = new Schema<IUserApproval>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  profileData: {
    type: Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in_review'],
    default: 'pending',
    index: true,
  },
  submissionType: {
    type: String,
    enum: ['new_registration', 'profile_update', 'photo_upload', 'document_upload'],
    required: true,
  },
  
  reviewedBy: {
    type: String,
    index: true,
  },
  reviewedAt: {
    type: Date,
  },
  reviewNotes: {
    type: String,
  },
  rejectionReason: {
    type: String,
  },
  
  documents: [{
    type: {
      type: String,
      enum: ['government_id', 'education_cert', 'income_proof', 'photo'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewNotes: String,
  }],
  
  verificationChecks: {
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    documentsVerified: { type: Boolean, default: false },
    photoVerified: { type: Boolean, default: false },
    manualReviewRequired: { type: Boolean, default: true },
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true,
  },
  flags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Indexes for efficient querying
UserApprovalSchema.index({ status: 1, priority: -1, createdAt: -1 });
UserApprovalSchema.index({ submissionType: 1, status: 1 });
UserApprovalSchema.index({ reviewedBy: 1, reviewedAt: -1 });
UserApprovalSchema.index({ 'verificationChecks.manualReviewRequired': 1 });

export default mongoose.models.UserApproval || mongoose.model<IUserApproval>('UserApproval', UserApprovalSchema);
