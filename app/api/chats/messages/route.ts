import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Conversation, Message } from '@/models/Chat';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { receiverId, content, messageType = 'text' } = await request.json();

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: {
        $all: [session.user.id, receiverId]
      }
    });

    if (!conversation) {
      const channelId = `chat_${[session.user.id, receiverId].sort().join('_')}`;
      conversation = new Conversation({
        participants: [session.user.id, receiverId],
        channelId,
        isActive: true,
      });
      await conversation.save();
    }

    // Create message
    const message = new Message({
      conversationId: conversation._id,
      senderId: session.user.id,
      content,
      messageType,
      sentAt: new Date(),
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
