import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  profileApprovalRequired: boolean;
  maxPhotosPerProfile: number;
  minAgeRestriction: number;
  maxAgeRestriction: number;
  subscriptionRequired: boolean;
  autoMatchingEnabled: boolean;
  chatEnabled: boolean;
  videoCallEnabled: boolean;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  cookiePolicyUrl: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  siteName: {
    type: String,
    required: true,
    default: 'Perfect Match',
    trim: true,
    maxlength: 100,
  },
  siteDescription: {
    type: String,
    required: true,
    default: 'Find your perfect life partner',
    trim: true,
    maxlength: 500,
  },
  siteUrl: {
    type: String,
    required: true,
    default: 'https://yoursite.com',
    trim: true,
  },
  contactEmail: {
    type: String,
    required: true,
    default: 'contact@yoursite.com',
    trim: true,
    lowercase: true,
  },
  supportEmail: {
    type: String,
    required: true,
    default: 'support@yoursite.com',
    trim: true,
    lowercase: true,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  registrationEnabled: {
    type: Boolean,
    default: true,
  },
  emailVerificationRequired: {
    type: Boolean,
    default: true,
  },
  profileApprovalRequired: {
    type: Boolean,
    default: true,
  },
  maxPhotosPerProfile: {
    type: Number,
    default: 5,
    min: 1,
    max: 20,
  },
  minAgeRestriction: {
    type: Number,
    default: 18,
    min: 18,
    max: 100,
  },
  maxAgeRestriction: {
    type: Number,
    default: 80,
    min: 18,
    max: 100,
  },
  subscriptionRequired: {
    type: Boolean,
    default: false,
  },
  autoMatchingEnabled: {
    type: Boolean,
    default: true,
  },
  chatEnabled: {
    type: Boolean,
    default: true,
  },
  videoCallEnabled: {
    type: Boolean,
    default: false,
  },
  privacyPolicyUrl: {
    type: String,
    default: '/privacy',
    trim: true,
  },
  termsOfServiceUrl: {
    type: String,
    default: '/terms',
    trim: true,
  },
  cookiePolicyUrl: {
    type: String,
    default: '/cookies',
    trim: true,
  },
  updatedBy: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
SiteSettingsSchema.index({ _id: 1 }, { unique: true });

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
