import UserModel from '@/models/User';
import ProfileModel from '@/models/Profile';
import { Message } from '@/models/Chat';
import InterestModel from '@/models/Interest';
import SubscriptionModel from '@/models/Subscription';
import { DataExportService } from './data-export';

export interface PrivacySettings {
  profileVisibility: 'public' | 'members' | 'premium' | 'private';
  showLastSeen: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
  analyticsConsent: boolean;
  dataRetentionPeriod: 1 | 2 | 5 | 'indefinite'; // years
}

export interface DataDeletionRequest {
  userId: string;
  reason?: string;
  requestedAt: Date;
  processedAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  deletionType: 'account' | 'profile' | 'messages' | 'interests' | 'all';
}

interface PrivacyReport {
  userId: string;
  accountCreated: string;
  lastActive: string;
  privacySettings: Record<string, unknown>;
  consentHistory: Record<string, unknown>;
  dataProcessingActivities: string[];
  dataSharedWith: string[];
  retentionPolicy: string;
}

export class PrivacyComplianceService {
  
  // GDPR Article 20 - Right to data portability
  static async requestDataExport(userId: string, format: 'json' | 'csv' = 'json'): Promise<Buffer> {
    try {
      const exportData = await DataExportService.generateDataExportFile(userId, format);
      
      // Log the export request for audit purposes
      await this.logPrivacyAction(userId, 'data_export_requested', {
        format,
        timestamp: new Date().toISOString(),
      });

      return exportData;
    } catch (error) {
      console.error('Error in data export request:', error);
      throw new Error('Failed to process data export request');
    }
  }

  // GDPR Article 17 - Right to erasure (Right to be forgotten)
  static async requestAccountDeletion(
    userId: string, 
    deletionType: DataDeletionRequest['deletionType'] = 'all',
    reason?: string
  ): Promise<DataDeletionRequest> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const deletionRequest: DataDeletionRequest = {
        userId,
        reason,
        requestedAt: new Date(),
        status: 'pending',
        deletionType,
      };

      // Log the deletion request
      await this.logPrivacyAction(userId, 'account_deletion_requested', {
        deletionType,
        reason,
        timestamp: new Date().toISOString(),
      });

      // Start the deletion process
      if (deletionType === 'all' || deletionType === 'account') {
        await this.processAccountDeletion(userId, deletionRequest);
      } else {
        await this.processPartialDeletion(userId, deletionType, deletionRequest);
      }

      return deletionRequest;
    } catch (error) {
      console.error('Error in account deletion request:', error);
      throw new Error('Failed to process account deletion request');
    }
  }

  private static async processAccountDeletion(userId: string, request: DataDeletionRequest): Promise<void> {
    try {
      request.status = 'processing';
      
      // Delete profile data
      await ProfileModel.findOneAndDelete({ userId });
      
      // Delete or anonymize messages (depending on privacy requirements)
      await this.anonymizeUserMessages(userId);
      
      // Delete interests
      await InterestModel.deleteMany({
        $or: [{ fromUserId: userId }, { toUserId: userId }]
      });
      
      // Delete subscriptions
      await SubscriptionModel.deleteMany({ userId });
      
      // Finally delete user account
      await UserModel.findByIdAndDelete(userId);
      
      request.status = 'completed';
      request.processedAt = new Date();
      
      await this.logPrivacyAction(userId, 'account_deletion_completed', {
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      request.status = 'failed';
      console.error('Error processing account deletion:', error);
      throw error;
    }
  }

  private static async processPartialDeletion(
    userId: string, 
    deletionType: DataDeletionRequest['deletionType'],
    request: DataDeletionRequest
  ): Promise<void> {
    try {
      request.status = 'processing';
      
      switch (deletionType) {
        case 'profile':
          await ProfileModel.findOneAndDelete({ userId });
          break;
        case 'messages':
          await this.anonymizeUserMessages(userId);
          break;
        case 'interests':
          await InterestModel.deleteMany({
            $or: [{ fromUserId: userId }, { toUserId: userId }]
          });
          break;
      }
      
      request.status = 'completed';
      request.processedAt = new Date();
      
      await this.logPrivacyAction(userId, 'partial_deletion_completed', {
        deletionType,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      request.status = 'failed';
      console.error('Error processing partial deletion:', error);
      throw error;
    }
  }

  private static async anonymizeUserMessages(userId: string): Promise<void> {
    // Instead of deleting messages, anonymize them to preserve conversation context
    await Message.updateMany(
      { senderId: userId },
      {
        $set: {
          content: '[Message deleted by user]',
          senderId: 'anonymized-user',
          isDeleted: true,
        }
      }
    );
  }

  // GDPR Article 16 - Right to rectification
  static async updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        $set: {
          'privacySettings': settings,
          'privacySettingsUpdatedAt': new Date(),
        }
      });

      await this.logPrivacyAction(userId, 'privacy_settings_updated', {
        settings,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw new Error('Failed to update privacy settings');
    }
  }

  // GDPR Article 13 & 14 - Information to be provided
  static async recordConsentDecision(
    userId: string, 
    consentType: 'data_processing' | 'marketing' | 'analytics',
    granted: boolean
  ): Promise<void> {
    try {
      const updateField = `consent.${consentType}`;
      
      await UserModel.findByIdAndUpdate(userId, {
        $set: {
          [updateField]: {
            granted,
            timestamp: new Date(),
            ipAddress: '', // Should be passed from request
            userAgent: '', // Should be passed from request
          }
        }
      });

      await this.logPrivacyAction(userId, 'consent_updated', {
        consentType,
        granted,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error recording consent decision:', error);
      throw new Error('Failed to record consent decision');
    }
  }

  // Data retention policy enforcement
  static async enforceDataRetention(): Promise<void> {
    try {
      // Delete inactive accounts after specified retention period
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      // Find users to be deleted based on their retention preferences
      const usersToDelete = await UserModel.find({
        $or: [
          {
            'privacySettings.dataRetentionPeriod': 1,
            lastLoginAt: { $lt: oneYearAgo },
          },
          {
            'privacySettings.dataRetentionPeriod': 2,
            lastLoginAt: { $lt: twoYearsAgo },
          },
          {
            'privacySettings.dataRetentionPeriod': 5,
            lastLoginAt: { $lt: fiveYearsAgo },
          }
        ]
      });

      for (const user of usersToDelete) {
        await this.requestAccountDeletion(user._id.toString(), 'all', 'Data retention policy');
      }

      console.log(`Data retention policy enforced: ${usersToDelete.length} accounts processed`);
    } catch (error) {
      console.error('Error enforcing data retention policy:', error);
    }
  }

  private static async logPrivacyAction(userId: string, action: string, metadata: Record<string, unknown>): Promise<void> {
    try {
      // Store privacy action logs (could be in a separate collection)
      console.log(`Privacy Action Log: ${userId} - ${action}`, metadata);
      // In production, this should be stored in a secure audit log
    } catch (error) {
      console.error('Error logging privacy action:', error);
    }
  }

  // GDPR Article 15 - Right of access
  static async getPrivacyReport(userId: string): Promise<PrivacyReport> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        userId,
        accountCreated: user.createdAt.toISOString(),
        lastActive: user.lastLoginAt?.toISOString() || 'Never',
        privacySettings: user.privacySettings || {},
        consentHistory: user.consent || {},
        dataProcessingActivities: [
          'Profile matching and recommendations',
          'Communication facilitation',
          'Service improvement analytics (if consented)',
          'Marketing communications (if consented)',
        ],
        dataSharedWith: [
          'Other platform users (as per privacy settings)',
          'Payment processors (for subscription management)',
          'Email service providers (for notifications)',
        ],
        retentionPolicy: user.privacySettings?.dataRetentionPeriod || 'indefinite',
      };
    } catch (error) {
      console.error('Error generating privacy report:', error);
      throw new Error('Failed to generate privacy report');
    }
  }
}
