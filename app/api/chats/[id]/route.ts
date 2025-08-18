import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Conversation, Message } from '@/models/Chat';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find conversation between current user and target user
    let conversation = await Conversation.findOne({
      participants: {
        $all: [session.user.id, id]
      }
    });

    if (!conversation) {
      // Create new conversation if it doesn't exist
      const channelId = `chat_${[session.user.id, id].sort().join('_')}`;
      conversation = new Conversation({
        participants: [session.user.id, id],
        channelId,
        isActive: true,
      });
      await conversation.save();
    }

    // Get messages for this conversation
    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({ sentAt: 1 });

    return NextResponse.json({ 
      messages: messages || [] 
    });
  } catch (error) {
    console.error('Chat fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
