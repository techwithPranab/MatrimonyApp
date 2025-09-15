import UserModel from '@/models/User';
import ProfileModel from '@/models/Profile';
import { Conversation, Message, IMessage } from '@/models/Chat';
import InterestModel, { IInterest } from '@/models/Interest';
import SubscriptionModel, { ISubscription } from '@/models/Subscription';

export interface UserDataExport {
  user: {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
    lastActive: string;
  };
  profile: {
    id: string;
    bio?: string;
    age?: number;
    location?: string;
    occupation?: string;
    education?: string;
    religion?: string;
    preferences: Record<string, unknown>;
    photos: string[];
    createdAt: string;
    updatedAt: string;
  };
  chats: {
    id: string;
    participants: string[];
    messages: {
      id: string;
      content: string;
      senderId: string;
      timestamp: string;
    }[];
    createdAt: string;
  }[];
  interests: {
    id: string;
    fromUserId: string;
    toUserId: string;
    type: 'LIKE' | 'SUPERLIKE' | 'PASS';
    message?: string;
    createdAt: string;
  }[];
  subscriptions: {
    id: string;
    plan: string;
    status: string;
    startDate: string;
    endDate?: string;
    amount: number;
  }[];
}

export class DataExportService {
  static async exportUserData(userId: string): Promise<UserDataExport> {
    try {
      // Get user data
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get profile data
      const profile = await ProfileModel.findOne({ userId });
      
      // Get chat data - using conversations and messages
      const conversations = await Conversation.find({
        participants: userId
      });

      const chatData = [];
      for (const conversation of conversations) {
        const messages = await Message.find({
          conversationId: conversation._id.toString()
        }).sort({ sentAt: 1 });

        chatData.push({
          id: conversation._id.toString(),
          participants: conversation.participants,
          messages: messages.map((msg: IMessage) => ({
          id: msg._id.toString(),
          content: msg.content,
          senderId: msg.senderId.toString(),
          timestamp: msg.sentAt.toISOString(),
        })),
          createdAt: conversation.createdAt.toISOString(),
        });
      }

      // Get interests data
      const sentInterests = await InterestModel.find({ fromUserId: userId });
      const receivedInterests = await InterestModel.find({ toUserId: userId });
      const allInterests = [...sentInterests, ...receivedInterests];

      // Get subscription data
      const subscriptions = await SubscriptionModel.find({ userId });

      // Format data for export
      const exportData: UserDataExport = {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          createdAt: user.createdAt.toISOString(),
          lastActive: user.lastActive?.toISOString() || user.createdAt.toISOString(),
        },
        profile: profile ? {
          id: profile._id.toString(),
          bio: profile.bio,
          age: profile.age,
          location: profile.location,
          occupation: profile.occupation,
          education: profile.education,
          religion: profile.religion,
          preferences: profile.preferences,
          photos: profile.photos || [],
          createdAt: profile.createdAt.toISOString(),
          updatedAt: profile.updatedAt.toISOString(),
        } : {
          id: '',
          preferences: {},
          photos: [],
          createdAt: '',
          updatedAt: '',
        },
        chats: chatData,
        interests: allInterests.map((interest: IInterest) => {
          const getInterestType = (status: string) => {
            switch (status) {
              case 'accepted': return 'LIKE';
              case 'declined': return 'PASS';
              default: return 'LIKE';
            }
          };

          return {
            id: interest._id.toString(),
            fromUserId: interest.fromUserId.toString(),
            toUserId: interest.toUserId.toString(),
            type: getInterestType(interest.status),
            message: interest.message,
            createdAt: interest.createdAt.toISOString(),
          };
        }),
        subscriptions: subscriptions.map((sub: ISubscription) => ({
          id: sub._id.toString(),
          plan: sub.plan,
          status: sub.status,
          startDate: sub.currentPeriodStart.toISOString(),
          endDate: sub.currentPeriodEnd.toISOString(),
          amount: 0, // Amount not stored in subscription model
        })),
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  static async generateDataExportFile(userId: string, format: 'json' | 'csv' = 'json'): Promise<Buffer> {
    const data = await this.exportUserData(userId);
    
    if (format === 'json') {
      return Buffer.from(JSON.stringify(data, null, 2));
    } else {
      // Convert to CSV format
      const csvLines: string[] = [];
      
      // Add headers and user data
      csvLines.push('Section,Field,Value');
      csvLines.push(`User,ID,${data.user.id}`);
      csvLines.push(`User,Email,${data.user.email}`);
      csvLines.push(`User,Name,${data.user.name || ''}`);
      csvLines.push(`User,Created At,${data.user.createdAt}`);
      csvLines.push(`User,Last Active,${data.user.lastActive}`);
      
      // Add profile data
      if (data.profile.id) {
        csvLines.push(`Profile,ID,${data.profile.id}`);
        csvLines.push(`Profile,Bio,"${(data.profile.bio || '').replace(/"/g, '""')}"`);
        csvLines.push(`Profile,Age,${data.profile.age || ''}`);
        csvLines.push(`Profile,Location,${data.profile.location || ''}`);
        csvLines.push(`Profile,Occupation,${data.profile.occupation || ''}`);
        csvLines.push(`Profile,Education,${data.profile.education || ''}`);
        csvLines.push(`Profile,Religion,${data.profile.religion || ''}`);
        csvLines.push(`Profile,Photos,"${data.profile.photos.join(', ')}"`);
      }
      
      // Add chats count
      csvLines.push(`Chats,Total Count,${data.chats.length}`);
      
      // Add interests count
      csvLines.push(`Interests,Total Count,${data.interests.length}`);
      
      // Add subscriptions count
      csvLines.push(`Subscriptions,Total Count,${data.subscriptions.length}`);
      
      return Buffer.from(csvLines.join('\n'));
    }
  }
}
