import mongoose, { Document, Schema } from 'mongoose';

export interface IRevenue extends Document {
  _id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  stripePaymentIntentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  description: string;
  
  // Revenue categorization
  revenueType: 'subscription' | 'boost' | 'featured' | 'commission' | 'other';
  planType?: 'basic' | 'premium' | 'elite';
  
  // Tax and fees
  taxAmount: number;
  processingFee: number;
  netAmount: number;
  
  // Timing details
  billingPeriodStart?: Date;
  billingPeriodEnd?: Date;
  serviceDeliveredAt?: Date;
  
  // Refund information
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  refundTransactionId?: string;
  
  // Metadata
  metadata: {
    customerEmail?: string;
    customerName?: string;
    userAgent?: string;
    ipAddress?: string;
    promocode?: string;
    discountAmount?: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const RevenueSchema = new Schema<IRevenue>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  subscriptionId: {
    type: String,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: 'INR',
    uppercase: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'other'],
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  stripePaymentIntentId: {
    type: String,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    required: true,
    default: 'pending',
    index: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  
  revenueType: {
    type: String,
    enum: ['subscription', 'boost', 'featured', 'commission', 'other'],
    required: true,
    index: true,
  },
  planType: {
    type: String,
    enum: ['basic', 'premium', 'elite'],
  },
  
  taxAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  processingFee: {
    type: Number,
    default: 0,
    min: 0,
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  
  billingPeriodStart: {
    type: Date,
  },
  billingPeriodEnd: {
    type: Date,
  },
  serviceDeliveredAt: {
    type: Date,
  },
  
  refundAmount: {
    type: Number,
    min: 0,
  },
  refundReason: {
    type: String,
    trim: true,
  },
  refundedAt: {
    type: Date,
  },
  refundTransactionId: {
    type: String,
  },
  
  metadata: {
    customerEmail: String,
    customerName: String,
    userAgent: String,
    ipAddress: String,
    promocode: String,
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
RevenueSchema.index({ userId: 1, createdAt: -1 });
RevenueSchema.index({ status: 1, createdAt: -1 });
RevenueSchema.index({ revenueType: 1, createdAt: -1 });
RevenueSchema.index({ planType: 1, status: 1 });
RevenueSchema.index({ createdAt: -1 });

// Compound indexes for analytics
RevenueSchema.index({ 
  status: 1, 
  revenueType: 1, 
  createdAt: -1 
});

// Virtual for formatted amount
RevenueSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount.toLocaleString()}`;
});

// Methods
RevenueSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  this.serviceDeliveredAt = new Date();
  return this.save();
};

RevenueSchema.methods.processRefund = function(amount: number, reason: string, refundTransactionId: string) {
  this.refundAmount = amount;
  this.refundReason = reason;
  this.refundedAt = new Date();
  this.refundTransactionId = refundTransactionId;
  if (amount >= this.amount) {
    this.status = 'refunded';
  }
  return this.save();
};

// Static methods for analytics
RevenueSchema.statics.getRevenueAnalytics = async function(startDate: Date, endDate: Date) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$netAmount' },
        totalTransactions: { $sum: 1 },
        avgTransactionValue: { $avg: '$netAmount' },
        revenueByType: {
          $push: {
            type: '$revenueType',
            amount: '$netAmount'
          }
        }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

RevenueSchema.statics.getDailyRevenue = async function(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        dailyRevenue: { $sum: '$netAmount' },
        transactionCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } as const }
  ];
  
  return this.aggregate(pipeline);
};

export default mongoose.models.Revenue || mongoose.model<IRevenue>('Revenue', RevenueSchema);
