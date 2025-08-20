import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  _id: string;
  userId: string;
  matrimonyId?: string;
  
  // Basic Information
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  height: number; // in cm
  maritalStatus: 'never_married' | 'divorced' | 'widowed' | 'separated';
  hasChildren: boolean;
  languages: string[];
  
  // Location
  country: string;
  state: string;
  city: string;
  coordinates?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  
  // Religion & Community
  religion: string;
  community: string;
  subCommunity?: string;
  
  // Education & Profession
  education: string;
  educationDetails?: string;
  profession: string;
  professionDetails?: string;
  annualIncome?: number;
  currency: string;
  
  // Lifestyle
  diet: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'occasionally_non_veg';
  smoking: 'never' | 'occasionally' | 'regularly';
  drinking: 'never' | 'occasionally' | 'regularly';
  
  // Personal
  aboutMe?: string;
  interests: string[];
  
  // Media
  photos: {
    url: string;
    isProfilePicture: boolean;
    uploadedAt: Date;
    privacy: 'public' | 'connections' | 'premium';
  }[];
  
  // Partner Preferences
  partnerPreferences: {
    ageRange: { min: number; max: number };
    heightRange: { min: number; max: number };
    maritalStatus: string[];
    religions: string[];
    communities: string[];
    education: string[];
    professions: string[];
    locations: string[];
    diet?: string[];
    smoking?: string[];
    drinking?: string[];
  };
  
  // Privacy Settings
  privacy: {
    showProfile: boolean;
    showPhotos: 'all' | 'connections' | 'premium';
    showContact: 'none' | 'premium' | 'mutual_interest';
    allowMessages: boolean;
  };
  
  // Verification
  verification: {
    email: boolean;
    phone: boolean;
    governmentId: boolean;
    education: boolean;
    profession: boolean;
  };
  
  // Profile Health
  completenessScore: number;
  isActive: boolean;
  isPremium: boolean;
  lastActiveAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  matrimonyId: {
    type: String,
    unique: true,
    sparse: true, // Allow null values but unique non-null values
    index: true,
  },
  
  // Basic Information
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
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  height: {
    type: Number,
    required: true,
    min: 120,
    max: 250,
  },
  maritalStatus: {
    type: String,
    enum: ['never_married', 'divorced', 'widowed', 'separated'],
    required: true,
  },
  hasChildren: {
    type: Boolean,
    default: false,
  },
  languages: [{
    type: String,
    trim: true,
  }],
  
  // Location
  country: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
  
  // Religion & Community
  religion: {
    type: String,
    required: true,
    trim: true,
  },
  community: {
    type: String,
    required: true,
    trim: true,
  },
  subCommunity: {
    type: String,
    trim: true,
  },
  
  // Education & Profession
  education: {
    type: String,
    required: true,
    trim: true,
  },
  educationDetails: {
    type: String,
    trim: true,
  },
  profession: {
    type: String,
    required: true,
    trim: true,
  },
  professionDetails: {
    type: String,
    trim: true,
  },
  annualIncome: {
    type: Number,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    trim: true,
  },
  
  // Lifestyle
  diet: {
    type: String,
    enum: ['vegetarian', 'non_vegetarian', 'vegan', 'occasionally_non_veg'],
    required: true,
  },
  smoking: {
    type: String,
    enum: ['never', 'occasionally', 'regularly'],
    required: true,
  },
  drinking: {
    type: String,
    enum: ['never', 'occasionally', 'regularly'],
    required: true,
  },
  
  // Personal
  aboutMe: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  interests: [{
    type: String,
    trim: true,
  }],
  
  // Media
  photos: [{
    url: {
      type: String,
      required: true,
    },
    isProfilePicture: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    privacy: {
      type: String,
      enum: ['public', 'connections', 'premium'],
      default: 'public',
    },
  }],
  
  // Partner Preferences
  partnerPreferences: {
    ageRange: {
      min: { type: Number, required: true, min: 18, max: 100 },
      max: { type: Number, required: true, min: 18, max: 100 },
    },
    heightRange: {
      min: { type: Number, required: true, min: 120, max: 250 },
      max: { type: Number, required: true, min: 120, max: 250 },
    },
    maritalStatus: [String],
    religions: [String],
    communities: [String],
    education: [String],
    professions: [String],
    locations: [String],
    diet: [String],
    smoking: [String],
    drinking: [String],
  },
  
  // Privacy Settings
  privacy: {
    showProfile: {
      type: Boolean,
      default: true,
    },
    showPhotos: {
      type: String,
      enum: ['all', 'connections', 'premium'],
      default: 'all',
    },
    showContact: {
      type: String,
      enum: ['none', 'premium', 'mutual_interest'],
      default: 'mutual_interest',
    },
    allowMessages: {
      type: Boolean,
      default: true,
    },
  },
  
  // Verification
  verification: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    governmentId: { type: Boolean, default: false },
    education: { type: Boolean, default: false },
    profession: { type: Boolean, default: false },
  },
  
  // Profile Health
  completenessScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for efficient searching
ProfileSchema.index({ gender: 1, dateOfBirth: 1 });
ProfileSchema.index({ gender: 1, religion: 1, community: 1 });
ProfileSchema.index({ gender: 1, country: 1, state: 1, city: 1 });
ProfileSchema.index({ gender: 1, education: 1, profession: 1 });
ProfileSchema.index({ gender: 1, maritalStatus: 1 });
ProfileSchema.index({ gender: 1, height: 1 });
ProfileSchema.index({ isActive: 1, isPremium: 1 });
ProfileSchema.index({ lastActiveAt: 1 });
ProfileSchema.index({ completenessScore: 1 });

// Compound index for main search
ProfileSchema.index({
  gender: 1,
  isActive: 1,
  'privacy.showProfile': 1,
  dateOfBirth: 1,
  religion: 1,
  community: 1,
  country: 1,
  state: 1,
  city: 1,
});

// Text index for keyword search
ProfileSchema.index({
  firstName: 'text',
  lastName: 'text',
  aboutMe: 'text',
  profession: 'text',
  education: 'text',
  interests: 'text',
});

// Geospatial index
ProfileSchema.index({ coordinates: '2dsphere' });

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
