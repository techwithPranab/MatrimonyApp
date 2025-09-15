import mongoose, { Document, Schema } from 'mongoose';

export interface IVerification extends Document {
  userId: string;
  profileId: string;
  verificationType: 'government_id' | 'education' | 'profession' | 'address' | 'income';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired';
  documents: {
    fileUrl: string;
    fileName: string;
    fileType: string;
    uploadedAt: Date;
    verifiedAt?: Date;
    verifiedBy?: string;
  }[];
  submittedData: {
    // Government ID
    idType?: string;
    idNumber?: string;
    expiryDate?: Date;
    issuingAuthority?: string;

    // Education
    degree?: string;
    institution?: string;
    graduationYear?: number;
    grade?: string;

    // Profession
    companyName?: string;
    designation?: string;
    employmentType?: string;
    experienceYears?: number;

    // Address
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
    addressProofType?: string;

    // Income
    annualIncome?: number;
    currency?: string;
    incomeProofType?: string;
  };
  reviewNotes?: string;
  rejectionReason?: string;
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  profileId: {
    type: String,
    required: true,
    index: true,
  },
  verificationType: {
    type: String,
    enum: ['government_id', 'education', 'profession', 'address', 'income'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'expired'],
    default: 'pending',
    index: true,
  },
  documents: [{
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: String,
    },
  }],
  submittedData: {
    // Government ID
    idType: String,
    idNumber: String,
    expiryDate: Date,
    issuingAuthority: String,

    // Education
    degree: String,
    institution: String,
    graduationYear: Number,
    grade: String,

    // Profession
    companyName: String,
    designation: String,
    employmentType: String,
    experienceYears: Number,

    // Address
    addressLine1: String,
    addressLine2: String,
    postalCode: String,
    addressProofType: String,

    // Income
    annualIncome: Number,
    currency: String,
    incomeProofType: String,
  },
  reviewNotes: {
    type: String,
    maxlength: 1000,
  },
  rejectionReason: {
    type: String,
    maxlength: 500,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
  },
  reviewedBy: {
    type: String,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
VerificationSchema.index({ userId: 1, verificationType: 1 });
VerificationSchema.index({ status: 1, verificationType: 1 });
VerificationSchema.index({ expiresAt: 1 });
VerificationSchema.index({ reviewedAt: 1 });

// Compound index for admin dashboard
VerificationSchema.index({
  status: 1,
  verificationType: 1,
  requestedAt: -1,
});

// Pre-save middleware to update profile verification status
VerificationSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'approved') {
    try {
      const Profile = mongoose.model('Profile');
      const profile = await Profile.findOne({ userId: this.userId });

      if (profile) {
        // Update the corresponding verification field in profile
        const verificationField = getVerificationField(this.verificationType);

        if (verificationField) {
          profile.verification[verificationField] = true;
          await profile.save();
        }
      }
    } catch (error) {
      console.error('Error updating profile verification status:', error);
    }
  }
  next();
});

// Helper function to map verification type to profile field
function getVerificationField(verificationType: string): string | null {
  switch (verificationType) {
    case 'government_id':
      return 'governmentId';
    case 'education':
      return 'education';
    case 'profession':
      return 'profession';
    default:
      return null;
  }
}

export default mongoose.models.Verification || mongoose.model<IVerification>('Verification', VerificationSchema);
