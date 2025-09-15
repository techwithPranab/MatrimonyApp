import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Conversation, Message } from '@/models/Chat';
import { authOptions } from '@/lib/auth';
import { pusherServer, getConversationChannelName, PUSHER_EVENTS } from '@/lib/pusher';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { receiverId, content, messageType = 'text', attachments = [] } = await request.json();

    if (!content?.trim() && attachments.length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Get sender info
    const sender = await User.findById(session.user.id).select('firstName lastName email');
    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: {
        $all: [session.user.id, receiverId]
      }
    });

    if (!conversation) {
      const channelId = `chat_${[session.user.id, receiverId].sort((a, b) => a.localeCompare(b)).join('_')}`;
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
      content: content?.trim() || '',
      messageType,
      attachments,
      sentAt: new Date(),
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = content?.trim() || (attachments.length > 0 ? 'Sent an attachment' : '');
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Prepare message for real-time broadcast
    const messageForBroadcast = {
      _id: message._id.toString(),
      conversationId: conversation._id.toString(),
      senderId: session.user.id,
      senderName: `${sender.firstName} ${sender.lastName}`,
      content: message.content,
      messageType: message.messageType,
      attachments: message.attachments,
      sentAt: message.sentAt.toISOString(),
      isDeleted: false,
    };

    // Send real-time notification via Pusher
    try {
      if (pusherServer) {
        const channelName = getConversationChannelName(conversation._id.toString());
        await pusherServer.trigger(channelName, PUSHER_EVENTS.MESSAGE_NEW, messageForBroadcast);
      } else {
        console.warn('Pusher not configured - real-time messaging disabled');
      }
    } catch (pusherError) {
      console.error('Pusher broadcast error:', pusherError);
      // Don't fail the request if Pusher fails
    }

    return NextResponse.json({ 
      message: messageForBroadcast,
      conversationId: conversation._id.toString()
    });

  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
