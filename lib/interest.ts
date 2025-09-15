import Interest from '@/models/Interest';
import User from '@/models/User';
import { NotificationService } from './notification';

export class InterestService {
  private static readonly notificationService = NotificationService;

  static async sendInterest(
    fromUserId: string, 
    toUserId: string, 
    message?: string,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ) {
    // Check if users exist
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId)
    ]);

    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    // Check for existing interest
    const existingInterest = await Interest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });
    if (existingInterest) {
      throw new Error('Interest already exists between these users');
    }

    // Check daily limits (optional business rule)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyCount = await Interest.countDocuments({
      fromUserId,
      sentAt: { $gte: today }
    });

    if (dailyCount >= 10) { // Max 10 interests per day
      throw new Error('Daily interest limit reached');
    }

    // Create interest with expiration (30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const interest = new Interest({
      fromUserId,
      toUserId,
      message,
      priority,
      expiresAt,
      status: 'sent'
    });

    await interest.save();

    // Send notification
    await this.notificationService.sendNotification(
      toUserId,
      'interest',
      'New Interest Received',
      `${fromUser.profile?.firstName || 'Someone'} has sent you an interest`,
      {
        senderId: fromUserId,
        data: {
          interestId: interest._id.toString(),
          fromUserId,
          fromUserName: fromUser.profile?.firstName
        }
      }
    );

    return interest;
  }

  static async respondToInterest(
    interestId: string,
    userId: string,
    action: 'accept' | 'decline',
    responseMessage?: string
  ) {
    const interest = await Interest.findById(interestId);
    if (!interest) {
      throw new Error('Interest not found');
    }

    if (interest.toUserId !== userId) {
      throw new Error('Unauthorized to respond to this interest');
    }

    if (interest.status !== 'sent') {
      throw new Error('Interest has already been responded to');
    }

    // Check if expired
    if (interest.expiresAt && interest.expiresAt < new Date()) {
      throw new Error('Interest has expired');
    }

    // Update interest
    interest.status = action === 'accept' ? 'accepted' : 'declined';
    interest.respondedAt = new Date();
    interest.isRead = true;

    if (responseMessage) {
      interest.message = responseMessage;
    }

    await interest.save();

    // Get user info for notification
    const toUser = await User.findById(interest.toUserId);

    // Send notification to interest sender
    const notificationTitle = action === 'accept' 
      ? 'Interest Accepted!' 
      : 'Interest Response';
    
    const notificationMessage = action === 'accept'
      ? `${toUser?.profile?.firstName || 'Someone'} has accepted your interest`
      : `${toUser?.profile?.firstName || 'Someone'} has declined your interest`;

    await this.notificationService.sendNotification(
      interest.fromUserId,
      'interest',
      notificationTitle,
      notificationMessage,
      {
        senderId: interest.toUserId,
        data: {
          interestId: interest._id.toString(),
          action,
          fromUserId: interest.toUserId,
          fromUserName: toUser?.profile?.firstName
        }
      }
    );

    // If accepted, check for mutual interest and create match notification
    if (action === 'accept') {
      await this.checkForMutualMatch(interest.fromUserId, interest.toUserId);
    }

    return interest;
  }

  static async withdrawInterest(interestId: string, userId: string) {
    const interest = await Interest.findById(interestId);
    if (!interest) {
      throw new Error('Interest not found');
    }

    if (interest.fromUserId !== userId) {
      throw new Error('Unauthorized to withdraw this interest');
    }

    if (interest.status !== 'sent') {
      throw new Error('Cannot withdraw interest that has been responded to');
    }

    interest.status = 'withdrawn';
    await interest.save();

    return interest;
  }

  static async getPendingInterests(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const interests = await Interest.find({
      toUserId: userId,
      status: 'sent',
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } }
      ]
    })
      .sort({ priority: -1, sentAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('fromUserId', 'profile email')
      .lean();

    const total = await Interest.countDocuments({
      toUserId: userId,
      status: 'sent',
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } }
      ]
    });

    return {
      interests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getSentInterests(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const interests = await Interest.find({ fromUserId: userId })
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('toUserId', 'profile email')
      .lean();

    const total = await Interest.countDocuments({ fromUserId: userId });

    return {
      interests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getMutualInterests(userId: string) {
    return await Interest.aggregate([
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
  }

  static async markInterestAsRead(interestId: string, userId: string) {
    const interest = await Interest.findById(interestId);
    if (!interest) {
      throw new Error('Interest not found');
    }

    if (interest.toUserId !== userId) {
      throw new Error('Unauthorized');
    }

    interest.isRead = true;
    await interest.save();

    return interest;
  }

  static async getInterestStats(userId: string) {
    const [sent, received, accepted, declined, mutual] = await Promise.all([
      Interest.countDocuments({ fromUserId: userId }),
      Interest.countDocuments({ toUserId: userId }),
      Interest.countDocuments({ fromUserId: userId, status: 'accepted' }),
      Interest.countDocuments({ fromUserId: userId, status: 'declined' }),
      Interest.aggregate([
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
      ])
    ]);

    return {
      sent,
      received,
      accepted,
      declined,
      mutualMatches: mutual.length,
      acceptanceRate: sent > 0 ? ((accepted / sent) * 100).toFixed(1) : '0.0'
    };
  }

  private static async checkForMutualMatch(userId1: string, userId2: string) {
    // Check if both users have accepted each other's interests
    const mutualMatch = await Interest.countDocuments({
      $or: [
        { fromUserId: userId1, toUserId: userId2, status: 'accepted' },
        { fromUserId: userId2, toUserId: userId1, status: 'accepted' }
      ]
    });

    if (mutualMatch === 2) {
      // Create mutual match notifications for both users
      const [user1, user2] = await Promise.all([
        User.findById(userId1),
        User.findById(userId2)
      ]);

      await Promise.all([
        this.notificationService.sendNotification(
          userId1,
          'match',
          'It\'s a Match!',
          `You and ${user2?.profile?.firstName || 'someone'} have both shown interest in each other`,
          {
            data: {
              matchedUserId: userId2,
              matchedUserName: user2?.profile?.firstName
            }
          }
        ),
        this.notificationService.sendNotification(
          userId2,
          'match',
          'It\'s a Match!',
          `You and ${user1?.profile?.firstName || 'someone'} have both shown interest in each other`,
          {
            data: {
              matchedUserId: userId1,
              matchedUserName: user1?.profile?.firstName
            }
          }
        )
      ]);
    }
  }

  static async cleanupExpiredInterests() {
    const now = new Date();
    const result = await Interest.updateMany(
      {
        status: 'sent',
        expiresAt: { $lt: now }
      },
      {
        status: 'declined' // Auto-decline expired interests
      }
    );

    return result.modifiedCount;
  }
}
