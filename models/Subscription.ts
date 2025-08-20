import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  _id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: 'free' | 'basic' | 'premium' | 'elite';
  status: 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  
  // Entitlements based on plan
  entitlements: {
    contactViewQuota: number;
    contactViewsUsed: number;
    unlimitedChat: boolean;
    profileBoosts: number;
    profileBoostsUsed: number;
    featuredPlacement: boolean;
    advancedFilters: boolean;
    videoCall: boolean;
    prioritySupport: boolean;
  };
  
  // Payment history reference
  lastPaymentAt?: Date;
  nextBillingAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  stripeCustomerId: {
    type: String,
    required: true,
    index: true,
  },
  stripeSubscriptionId: {
    type: String,
    sparse: true,
    index: true,
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'elite'],
    default: 'free',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'canceled', 'past_due', 'trialing'],
    default: 'active',
    required: true,
  },
  currentPeriodStart: {
    type: Date,
    required: true,
    default: Date.now,
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false,
  },
  trialEnd: {
    type: Date,
  },
  
  entitlements: {
    contactViewQuota: {
      type: Number,
      default: 5, // Free plan quota
    },
    contactViewsUsed: {
      type: Number,
      default: 0,
    },
    unlimitedChat: {
      type: Boolean,
      default: false,
    },
    profileBoosts: {
      type: Number,
      default: 0,
    },
    profileBoostsUsed: {
      type: Number,
      default: 0,
    },
    featuredPlacement: {
      type: Boolean,
      default: false,
    },
    advancedFilters: {
      type: Boolean,
      default: false,
    },
    videoCall: {
      type: Boolean,
      default: false,
    },
    prioritySupport: {
      type: Boolean,
      default: false,
    },
  },
  
  lastPaymentAt: {
    type: Date,
  },
  nextBillingAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
// SubscriptionSchema.index({ userId: 1 });
// SubscriptionSchema.index({ stripeCustomerId: 1 });
// SubscriptionSchema.index({ stripeSubscriptionId: 1 });
SubscriptionSchema.index({ plan: 1, status: 1 });
SubscriptionSchema.index({ currentPeriodEnd: 1 });
SubscriptionSchema.index({ nextBillingAt: 1 });

// Method to check if user can perform certain actions
SubscriptionSchema.methods.canViewContact = function() {
  return this.entitlements.contactViewsUsed < this.entitlements.contactViewQuota || 
         this.plan !== 'free';
};

SubscriptionSchema.methods.canSendMessage = function() {
  return this.entitlements.unlimitedChat || this.plan !== 'free';
};

SubscriptionSchema.methods.useContactView = function() {
  if (this.plan === 'free') {
    this.entitlements.contactViewsUsed += 1;
  }
  return this.save();
};

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
