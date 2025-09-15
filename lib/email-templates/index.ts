// Export all email template functions and utilities
export * from './base';
export * from './auth';
export * from './matching';
export * from './notifications';
export * from './system';
export * from './test';

// Email template categories for easy reference
export const EMAIL_CATEGORIES = {
  AUTH: 'auth',
  MATCHING: 'matching',
  NOTIFICATIONS: 'notifications',
  SYSTEM: 'system',
} as const;

// Common email subjects for consistency
export const EMAIL_SUBJECTS = {
  // Auth
  WELCOME: 'Welcome to MatrimonyApp! 🎉',
  OTP_VERIFICATION: 'Your MatrimonyApp Verification Code',
  PASSWORD_RESET: 'Reset Your MatrimonyApp Password',
  
  // Matching
  NEW_MATCH: '🎯 New Compatible Match Found!',
  INTEREST_RECEIVED: '💝 Someone is Interested in You!',
  INTEREST_ACCEPTED: '🎉 Your Interest Was Accepted!',
  
  // Notifications
  PROFILE_VIEW: '👀 Someone Viewed Your Profile!',
  NEW_MESSAGE: (senderName: string) => `💬 New Message from ${senderName}`,
  WEEKLY_DIGEST: '📊 Your Weekly MatrimonyApp Summary',
  
  // System
  PROFILE_APPROVED: '✅ Profile Approved - Welcome to MatrimonyApp!',
  PROFILE_REJECTED: 'Profile Review Required',
  ACCOUNT_SUSPENDED: 'Account Suspension Notice',
  SUBSCRIPTION_EXPIRY: (type: string) => `⏰ Your ${type} Subscription is Expiring Soon`,
  MAINTENANCE: '🔧 Scheduled Maintenance Notification',
} as const;

// Email template metadata for tracking and analytics
export interface EmailTemplateMetadata {
  readonly templateId: string;
  readonly category: string;
  readonly version: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly description: string;
  readonly tags: string[];
}

export const EMAIL_TEMPLATES_METADATA: Record<string, EmailTemplateMetadata> = {
  welcome: {
    templateId: 'welcome',
    category: EMAIL_CATEGORIES.AUTH,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Welcome email sent to new users after registration',
    tags: ['welcome', 'onboarding', 'auth'],
  },
  otp: {
    templateId: 'otp',
    category: EMAIL_CATEGORIES.AUTH,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'OTP verification email for account security',
    tags: ['otp', 'verification', 'security'],
  },
  passwordReset: {
    templateId: 'password-reset',
    category: EMAIL_CATEGORIES.AUTH,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Password reset email with secure link',
    tags: ['password', 'reset', 'security'],
  },
  matchNotification: {
    templateId: 'match-notification',
    category: EMAIL_CATEGORIES.MATCHING,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Notification about new compatible matches',
    tags: ['match', 'compatibility', 'notification'],
  },
  interestReceived: {
    templateId: 'interest-received',
    category: EMAIL_CATEGORIES.MATCHING,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Notification when someone sends an interest',
    tags: ['interest', 'received', 'connection'],
  },
  interestAccepted: {
    templateId: 'interest-accepted',
    category: EMAIL_CATEGORIES.MATCHING,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Notification when interest is accepted',
    tags: ['interest', 'accepted', 'match'],
  },
  profileView: {
    templateId: 'profile-view',
    category: EMAIL_CATEGORIES.NOTIFICATIONS,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Notification when profile is viewed',
    tags: ['profile', 'view', 'engagement'],
  },
  newMessage: {
    templateId: 'new-message',
    category: EMAIL_CATEGORIES.NOTIFICATIONS,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Notification for new chat messages',
    tags: ['message', 'chat', 'communication'],
  },
  weeklyDigest: {
    templateId: 'weekly-digest',
    category: EMAIL_CATEGORIES.NOTIFICATIONS,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Weekly summary of user activity and matches',
    tags: ['weekly', 'digest', 'summary'],
  },
  profileApproval: {
    templateId: 'profile-approval',
    category: EMAIL_CATEGORIES.SYSTEM,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Profile approval confirmation',
    tags: ['approval', 'profile', 'system'],
  },
  profileRejection: {
    templateId: 'profile-rejection',
    category: EMAIL_CATEGORIES.SYSTEM,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Profile rejection with feedback',
    tags: ['rejection', 'profile', 'feedback'],
  },
  accountSuspension: {
    templateId: 'account-suspension',
    category: EMAIL_CATEGORIES.SYSTEM,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Account suspension notification',
    tags: ['suspension', 'account', 'moderation'],
  },
  subscriptionExpiry: {
    templateId: 'subscription-expiry',
    category: EMAIL_CATEGORIES.SYSTEM,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Subscription expiry warning',
    tags: ['subscription', 'expiry', 'billing'],
  },
  maintenance: {
    templateId: 'maintenance',
    category: EMAIL_CATEGORIES.SYSTEM,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    description: 'Scheduled maintenance notification',
    tags: ['maintenance', 'system', 'downtime'],
  },
};

// Helper function to get template metadata
export function getTemplateMetadata(templateId: string): EmailTemplateMetadata | undefined {
  return EMAIL_TEMPLATES_METADATA[templateId];
}

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): EmailTemplateMetadata[] {
  return Object.values(EMAIL_TEMPLATES_METADATA).filter(
    template => template.category === category
  );
}

// Template usage tracking (for analytics)
export interface TemplateUsage {
  readonly templateId: string;
  readonly sentAt: Date;
  readonly recipientEmail: string;
  readonly success: boolean;
  readonly errorMessage?: string;
  readonly metadata?: Record<string, unknown>;
}

export class TemplateAnalytics {
  private usage: TemplateUsage[] = [];

  recordUsage(usage: TemplateUsage): void {
    this.usage.push(usage);
    
    // Keep only last 1000 entries to prevent memory issues
    if (this.usage.length > 1000) {
      this.usage = this.usage.slice(-1000);
    }
  }

  getUsageStats(templateId: string, days = 7): {
    totalSent: number;
    successRate: number;
    lastSent?: Date;
    recentErrors: string[];
  } {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const recentUsage = this.usage.filter(
      u => u.templateId === templateId && u.sentAt >= cutoffDate
    );

    const totalSent = recentUsage.length;
    const successful = recentUsage.filter(u => u.success).length;
    const successRate = totalSent > 0 ? successful / totalSent : 0;
    
    const lastSent = recentUsage.length > 0 
      ? new Date(Math.max(...recentUsage.map(u => u.sentAt.getTime())))
      : undefined;

    const recentErrors = recentUsage
      .filter(u => !u.success && u.errorMessage)
      .map(u => u.errorMessage!)
      .slice(-5); // Last 5 errors

    return {
      totalSent,
      successRate,
      lastSent,
      recentErrors,
    };
  }

  getAllTemplateStats(): Record<string, ReturnType<TemplateAnalytics['getUsageStats']>> {
    const templateIds = Array.from(new Set(this.usage.map(u => u.templateId)));
    const stats: Record<string, ReturnType<TemplateAnalytics['getUsageStats']>> = {};
    
    for (const templateId of templateIds) {
      stats[templateId] = this.getUsageStats(templateId);
    }
    
    return stats;
  }
}

// Export singleton analytics instance
export const templateAnalytics = new TemplateAnalytics();
