import mongoose, { Document, Schema } from 'mongoose';

export interface ISuccessStory extends Document {
  _id: string;
  coupleNames: string;
  title: string;
  story: string;
  weddingDate: Date;
  location: string;
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
  
  // User references
  userId1: string;
  userId2: string;
  matrimonyId1: string;
  matrimonyId2: string;
  
  // Submission and approval
  submittedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  
  // Additional metadata
  tags: string[];
  viewCount: number;
  likeCount: number;
  shareCount: number;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const SuccessStorySchema = new Schema<ISuccessStory>({
  coupleNames: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  story: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  weddingDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  images: [{
    type: String,
    trim: true,
  }],
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  
  userId1: {
    type: String,
    required: true,
    index: true,
  },
  userId2: {
    type: String,
    required: true,
    index: true,
  },
  matrimonyId1: {
    type: String,
    required: true,
    index: true,
  },
  matrimonyId2: {
    type: String,
    required: true,
    index: true,
  },
  
  submittedBy: {
    type: String,
    required: true,
    index: true,
  },
  approvedBy: {
    type: String,
    index: true,
  },
  approvedAt: {
    type: Date,
  },
  rejectedBy: {
    type: String,
  },
  rejectedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  viewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  shareCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 60,
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160,
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Indexes
SuccessStorySchema.index({ isPublished: 1, isFeatured: 1, createdAt: -1 });
SuccessStorySchema.index({ userId1: 1, userId2: 1 });
SuccessStorySchema.index({ submittedBy: 1, createdAt: -1 });
SuccessStorySchema.index({ approvedBy: 1, approvedAt: -1 });
SuccessStorySchema.index({ tags: 1 });
SuccessStorySchema.index({ slug: 1 });

// Text search index
SuccessStorySchema.index({
  title: 'text',
  story: 'text',
  coupleNames: 'text',
  location: 'text'
});

// Virtual for excerpt
SuccessStorySchema.virtual('excerpt').get(function() {
  return this.story.length > 200 ? 
    this.story.substring(0, 200) + '...' : 
    this.story;
});

// Pre-save middleware to generate slug
SuccessStorySchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-+)|(-+$)/g, '');
  }
  next();
});

// Methods
SuccessStorySchema.methods.approve = function(adminId: string) {
  this.isPublished = true;
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  this.rejectedBy = undefined;
  this.rejectedAt = undefined;
  this.rejectionReason = undefined;
  return this.save();
};

SuccessStorySchema.methods.reject = function(adminId: string, reason: string) {
  this.isPublished = false;
  this.rejectedBy = adminId;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  this.approvedBy = undefined;
  this.approvedAt = undefined;
  return this.save();
};

SuccessStorySchema.methods.toggleFeatured = function() {
  this.isFeatured = !this.isFeatured;
  return this.save();
};

SuccessStorySchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

// Static methods
SuccessStorySchema.statics.getFeaturedStories = function(limit = 6) {
  return this.find({ 
    isPublished: true, 
    isFeatured: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

SuccessStorySchema.statics.getPublishedStories = function(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export default mongoose.models.SuccessStory || mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);
