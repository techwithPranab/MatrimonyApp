import Notification, { INotification } from '@/models/Notification';
import NotificationPreferences from '@/models/NotificationPreferences';
import dbConnect from '@/lib/db';

export class NotificationService {
  
  /**
   * Send a notification to a user
   */
  static async sendNotification(
    recipientId: string,
    type: string,
    title: string,
    message: string,
    options?: {
      senderId?: string;
      actionUrl?: string;
      actionText?: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      data?: Record<string, unknown>;
      deliveryMethod?: ('in_app' | 'email' | 'push')[];
      scheduledFor?: Date;
    }
  ) {
    await dbConnect();
    
    // Get user preferences
    let preferences;
    try {
      preferences = await NotificationPreferences.findOne({ userId: recipientId });
      if (!preferences) {
        preferences = await NotificationPreferences.create({ userId: recipientId });
      }
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
    
    // Check if we should send this notification based on preferences
    const typeMapping = {
      'match': 'matches',
      'message': 'messages',
      'interest_sent': 'interests',
      'interest_received': 'interests',
      'interest_accepted': 'interests',
      'interest_declined': 'interests',
      'profile_view': 'profileViews',
      'system': 'system',
      'subscription': 'subscription',
      'verification': 'verification'
    } as const;
    
    const prefType = typeMapping[type as keyof typeof typeMapping];
    if (!prefType) {
      throw new Error(`Unknown notification type: ${type}`);
    }
    
    // Filter delivery methods based on user preferences
    const allowedDeliveryMethods = (options?.deliveryMethod || ['in_app']).filter(method => {
      const methodKey = method === 'in_app' ? 'inApp' : method;
      return preferences.shouldSendNotification(prefType, methodKey);
    });
    
    // Don't send if no delivery methods are allowed
    if (allowedDeliveryMethods.length === 0) {
      return null;
    }
    
    // Check quiet hours for non-urgent notifications
    if (options?.priority !== 'urgent' && preferences.isInQuietHours()) {
      // Schedule for after quiet hours if not scheduled already
      if (!options?.scheduledFor) {
        const quietEnd = preferences.quietHours.endTime;
        const [hours, minutes] = quietEnd.split(':').map(Number);
        const scheduledFor = new Date();
        scheduledFor.setHours(hours, minutes, 0, 0);
        
        // If end time is tomorrow
        if (scheduledFor <= new Date()) {
          scheduledFor.setDate(scheduledFor.getDate() + 1);
        }
        
        options = { ...options, scheduledFor };
      }
    }
    
    // Create notification
    const notification = await Notification.create({
      recipientId,
      senderId: options?.senderId,
      type,
      title,
      message,
      actionUrl: options?.actionUrl,
      actionText: options?.actionText,
      priority: options?.priority || 'medium',
      data: options?.data,
      deliveryMethod: allowedDeliveryMethods,
      scheduledFor: options?.scheduledFor,
    });
    
    // Send immediately if not scheduled
    if (!options?.scheduledFor) {
      await this.deliverNotification(notification);
    }
    
    return notification;
  }
  
  /**
   * Deliver a notification via configured methods
   */
  static async deliverNotification(notification: INotification) {
    const deliveryPromises = [];
    
    // Send email if configured
    if (notification.deliveryMethod.includes('email') && !notification.emailSent) {
      deliveryPromises.push(this.sendEmailNotification(notification));
    }
    
    // Send push if configured
    if (notification.deliveryMethod.includes('push') && !notification.pushSent) {
      deliveryPromises.push(this.sendPushNotification(notification));
    }
    
    // Execute delivery methods
    await Promise.allSettled(deliveryPromises);
    
    // In-app notifications are handled by the database record itself
    return notification;
  }
  
  /**
   * Send email notification
   */
  static async sendEmailNotification(notification: INotification) {
    // Placeholder for email sending logic - will be integrated with existing email service
    
    try {
      // Future implementation: Use nodemailer or email service to send notification emails
      console.log(`Email notification queued for ${notification.recipientId}:`, {
        title: notification.title,
        message: notification.message
      });
      
      // Update notification as email sent
      notification.emailSent = true;
      notification.emailSentAt = new Date();
      await notification.save();
      
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }
  
  /**
   * Send push notification
   */
  static async sendPushNotification(notification: INotification) {
    // Placeholder for push notification - will be integrated with Firebase FCM or similar service
    
    try {
      // Future implementation: Use Firebase FCM or similar service for push notifications
      console.log(`Push notification queued for ${notification.recipientId}:`, {
        title: notification.title,
        message: notification.message
      });
      
      // Update notification as push sent
      notification.pushSent = true;
      notification.pushSentAt = new Date();
      await notification.save();
      
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  }
  
  /**
   * Get notifications for a user
   */
  static async getUserNotifications(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      type?: string;
    }
  ) {
    await dbConnect();
    
    const query: Record<string, unknown> = {
      recipientId: userId,
      isDeleted: false,
    };
    
    if (options?.unreadOnly) {
      query.isRead = false;
    }
    
    if (options?.type) {
      query.type = options.type;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(options?.limit || 50)
      .skip(options?.offset || 0)
      .populate('senderId', 'name profilePicture')
      .lean();
    
    return notifications;
  }
  
  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    await dbConnect();
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    
    return notification;
  }
  
  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    await dbConnect();
    
    const result = await Notification.updateMany(
      { recipientId: userId, isRead: false, isDeleted: false },
      { isRead: true, readAt: new Date() }
    );
    
    return result;
  }
  
  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    await dbConnect();
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { isDeleted: true },
      { new: true }
    );
    
    return notification;
  }
  
  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string) {
    await dbConnect();
    
    const count = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
      isDeleted: false,
    });
    
    return count;
  }
  
  /**
   * Process scheduled notifications
   */
  static async processScheduledNotifications() {
    await dbConnect();
    
    const now = new Date();
    const scheduledNotifications = await Notification.find({
      scheduledFor: { $lte: now },
      isDeleted: false,
    });
    
    for (const notification of scheduledNotifications) {
      await this.deliverNotification(notification);
      
      // Clear scheduled date
      notification.scheduledFor = undefined;
      await notification.save();
    }
    
    return scheduledNotifications.length;
  }
  
  /**
   * Clean up expired notifications
   */
  static async cleanupExpiredNotifications() {
    await dbConnect();
    
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    return result.deletedCount;
  }
  
  /**
   * Helper methods for common notification types
   */
  static async notifyNewMatch(recipientId: string, matchedUserId: string, matchedUserName: string) {
    return this.sendNotification(
      recipientId,
      'match',
      'New Match! 🎉',
      `You have a new match with ${matchedUserName}! Start a conversation now.`,
      {
        senderId: matchedUserId,
        actionUrl: `/profile/${matchedUserId}`,
        actionText: 'View Profile',
        priority: 'high',
        deliveryMethod: ['in_app', 'email'],
        data: { matchedUserId, matchedUserName }
      }
    );
  }
  
  static async notifyNewMessage(recipientId: string, senderId: string, senderName: string, preview: string) {
    return this.sendNotification(
      recipientId,
      'message',
      `New message from ${senderName}`,
      preview.length > 100 ? preview.substring(0, 97) + '...' : preview,
      {
        senderId,
        actionUrl: `/chat/${senderId}`,
        actionText: 'Reply',
        priority: 'medium',
        deliveryMethod: ['in_app', 'push'],
        data: { senderId, senderName, preview }
      }
    );
  }
  
  static async notifyInterest(recipientId: string, senderId: string, senderName: string, type: 'sent' | 'received' | 'accepted' | 'declined') {
    const messages = {
      sent: `You sent an interest to ${senderName}`,
      received: `${senderName} is interested in your profile!`,
      accepted: `${senderName} accepted your interest! 🎉`,
      declined: `${senderName} declined your interest`
    };
    
    const priorities = {
      sent: 'low',
      received: 'high',
      accepted: 'high',
      declined: 'medium'
    } as const;
    
    return this.sendNotification(
      recipientId,
      `interest_${type}`,
      'Interest Update',
      messages[type],
      {
        senderId: type === 'sent' ? recipientId : senderId,
        actionUrl: `/profile/${senderId}`,
        actionText: type === 'received' ? 'View Profile' : 'View',
        priority: priorities[type],
        deliveryMethod: type === 'received' || type === 'accepted' ? ['in_app', 'email'] : ['in_app'],
        data: { senderId, senderName, interestType: type }
      }
    );
  }
  
  static async notifyProfileView(recipientId: string, viewerId: string, viewerName: string) {
    return this.sendNotification(
      recipientId,
      'profile_view',
      'Profile View',
      `${viewerName} viewed your profile`,
      {
        senderId: viewerId,
        actionUrl: `/profile/${viewerId}`,
        actionText: 'View Back',
        priority: 'low',
        deliveryMethod: ['in_app'],
        data: { viewerId, viewerName }
      }
    );
  }
  
  static async notifySystem(recipientId: string, title: string, message: string, actionUrl?: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium') {
    return this.sendNotification(
      recipientId,
      'system',
      title,
      message,
      {
        actionUrl,
        actionText: actionUrl ? 'View Details' : undefined,
        priority,
        deliveryMethod: ['in_app', 'email']
      }
    );
  }
}
