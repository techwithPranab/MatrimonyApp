import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Conversation } from '@/models/Chat';
import Profile from '@/models/Profile';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find all conversations where the current user is a participant
    const conversations = await Conversation.find({
      participants: session.user.id,
      isActive: true,
    }).sort({ lastMessageAt: -1 });

    // Enrich conversations with other user data
    const enrichedChats = await Promise.all(
      conversations.map(async (conversation) => {
        // Find the other participant
        const otherUserId = conversation.participants.find(
          (id: string) => id !== session.user.id
        );

        if (!otherUserId) return null;

        // Get the other user's profile
        const otherUserProfile = await Profile.findById(otherUserId)
          .select('firstName lastName photos')
          .lean();

        if (!otherUserProfile) return null;

        // Mock online status and unread count for now
        return {
          _id: conversation._id,
          participants: conversation.participants,
          lastMessage: conversation.lastMessage,
          lastMessageAt: conversation.lastMessageAt,
          channelId: conversation.channelId,
          isActive: conversation.isActive,
          otherUser: {
            _id: (otherUserProfile as unknown as { _id: string })._id,
            firstName: (otherUserProfile as unknown as { firstName: string }).firstName,
            lastName: (otherUserProfile as unknown as { lastName: string }).lastName,
            photos: (otherUserProfile as unknown as { photos?: string[] }).photos || [],
            isOnline: Math.random() > 0.7, // 30% chance of being online
            lastSeen: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24 hours
          },
          unreadCount: Math.floor(Math.random() * 5), // Random unread count 0-4
        };
      })
    );

    // Filter out null entries and return
    const validChats = enrichedChats.filter(Boolean);

    return NextResponse.json({ chats: validChats });
  } catch (error) {
    console.error('Chats fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
