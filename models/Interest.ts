import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IInterest extends Document {
  _id: string;
  fromUserId: string;
  toUserId: string;
  status: 'sent' | 'accepted' | 'declined' | 'withdrawn';
  message?: string;
  sentAt: Date;
  respondedAt?: Date;
  expiresAt?: Date;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterestModel extends Model<IInterest> {
  findPendingInterests(userId: string): Promise<IInterest[]>;
  findSentInterests(userId: string): Promise<IInterest[]>;
  findMutualInterests(userId: string): Promise<any[]>;
  checkExistingInterest(fromUserId: string, toUserId: string): Promise<IInterest | null>;
}

const InterestSchema = new Schema<IInterest, IInterestModel>({
  fromUserId: {
    type: String,
    required: true,
  },
  toUserId: {
    type: String,
    required: true,
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
  expiresAt: {
    type: Date,
  },
  isRead: {
    type: Boolean,
    default: false,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal',
    required: true,
  },
}, {
  timestamps: true,
});

// Compound and individual indexes
InterestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
InterestSchema.index({ toUserId: 1, status: 1 });
InterestSchema.index({ fromUserId: 1, status: 1 });
InterestSchema.index({ sentAt: 1 });
InterestSchema.index({ respondedAt: 1 });
InterestSchema.index({ expiresAt: 1 });
InterestSchema.index({ isRead: 1 });
InterestSchema.index({ priority: 1 });

// Static methods
InterestSchema.statics.findPendingInterests = function(userId: string) {
  return this.find({
    toUserId: userId,
    status: 'sent',
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gte: new Date() } }
    ]
  }).sort({ priority: -1, sentAt: -1 });
};

InterestSchema.statics.findSentInterests = function(userId: string) {
  return this.find({
    fromUserId: userId
  }).sort({ sentAt: -1 });
};

InterestSchema.statics.findMutualInterests = function(userId: string) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { fromUserId: userId, status: 'accepted' },
          { toUserId: userId, status: 'accepted' }
        ]
      }
    },
    {
      $lookup: {
        from: 'interests',
        let: { 
          fromUser: '$fromUserId', 
          toUser: '$toUserId',
          currentUser: userId
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$status', 'accepted'] },
                  {
                    $or: [
                      {
                        $and: [
                          { $eq: ['$fromUserId', '$$toUser'] },
                          { $eq: ['$toUserId', '$$fromUser'] }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          }
        ],
        as: 'mutualMatch'
      }
    },
    {
      $match: {
        'mutualMatch': { $ne: [] }
      }
    }
  ]);
};

InterestSchema.statics.checkExistingInterest = function(fromUserId: string, toUserId: string) {
  return this.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId }
    ]
  });
};

export default (mongoose.models.Interest as unknown as IInterestModel) || mongoose.model<IInterest, IInterestModel>('Interest', InterestSchema);
