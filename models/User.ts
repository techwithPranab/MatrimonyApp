import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  hashedPassword?: string;
  matrimonyId?: string;
  roles: ('user' | 'moderator' | 'admin')[];
  phone?: string;
  phoneVerified: boolean;
  emailVerified: Date | null;
  lastLoginAt?: Date;
  isActive: boolean;
  otp?: string;
  otpExpires?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  hashedPassword: {
    type: String,
    // Optional for OAuth users
  },
  matrimonyId: {
    type: String,
    unique: true,
    sparse: true, // Allow null values but unique non-null values
  },
  roles: {
    type: [String],
    enum: ['user', 'moderator', 'admin'],
    default: ['user'],
  },
  phone: {
    type: String,
    sparse: true, // Allow multiple null values but unique non-null values
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  lastLoginAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Number,
  },
}, {
  timestamps: true,
});

// Indexes - avoid duplicates with schema field definitions
UserSchema.index({ email: 1 });
UserSchema.index({ matrimonyId: 1 });
UserSchema.index({ phone: 1 }, { sparse: true });
UserSchema.index({ roles: 1 });
UserSchema.index({ isActive: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
