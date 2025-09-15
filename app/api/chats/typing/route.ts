import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { pusherServer, getTypingChannelName, PUSHER_EVENTS } from '@/lib/pusher';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Conversation } from '@/models/Chat';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { conversationId, isTyping } = await request.json();

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation?.participants.includes(session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get user info
    const user = await User.findById(session.user.id).select('firstName lastName');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Broadcast typing event
    const channelName = getTypingChannelName(conversationId);
    const eventName = isTyping ? PUSHER_EVENTS.TYPING_START : PUSHER_EVENTS.TYPING_STOP;
    
    const typingData = {
      userId: session.user.id,
      userName: `${user.firstName} ${user.lastName}`,
      conversationId,
    };

    try {
      if (pusherServer) {
        await pusherServer.trigger(channelName, eventName, typingData);
      } else {
        console.warn('Pusher not configured - typing events disabled');
      }
    } catch (pusherError) {
      console.error('Pusher typing broadcast error:', pusherError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Typing indicator error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
