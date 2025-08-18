import mongoose, { Document, Schema } from 'mongoose';

export interface IInterest extends Document {
  _id: string;
  fromUserId: string;
  toUserId: string;
  status: 'sent' | 'accepted' | 'declined' | 'withdrawn';
  message?: string;
  sentAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterestSchema = new Schema<IInterest>({
  fromUserId: {
    type: String,
    required: true,
    index: true,
  },
  toUserId: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['sent', 'accepted', 'declined', 'withdrawn'],
    default: 'sent',
    required: true,
  },
  message: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  respondedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
InterestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
InterestSchema.index({ toUserId: 1, status: 1 });
InterestSchema.index({ fromUserId: 1, status: 1 });
InterestSchema.index({ sentAt: 1 });
InterestSchema.index({ respondedAt: 1 });

export default mongoose.models.Interest || mongoose.model<IInterest>('Interest', InterestSchema);
