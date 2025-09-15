import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { pusherServer } from '@/lib/pusher';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Conversation } from '@/models/Chat';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!pusherServer) {
      return NextResponse.json({ error: 'Pusher not configured' }, { status: 503 });
    }

    const body = await request.text();
    const params = new URLSearchParams(body);
    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');

    if (!socketId || !channelName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    await connectDB();

    // Handle private conversation channels
    if (channelName.startsWith('private-conversation-')) {
      const conversationId = channelName.replace('private-conversation-', '');
      
      // Check if user is a participant in this conversation
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation?.participants.includes(session.user.id)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const authResponse = pusherServer.authorizeChannel(socketId, channelName);
      return NextResponse.json(authResponse);
    }

    // Handle presence channels (user status)
    if (channelName.startsWith('presence-user-')) {
      const userId = channelName.replace('presence-user-', '');
      
      // Only allow users to join their own presence channel
      if (userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const presenceData = {
        user_id: session.user.id,
        user_info: {
          name: session.user.name || 'Unknown User',
          email: session.user.email,
        },
      };

      const authResponse = pusherServer.authorizeChannel(socketId, channelName, presenceData);
      return NextResponse.json(authResponse);
    }

    // Handle typing indicator channels
    if (channelName.startsWith('private-typing-')) {
      const conversationId = channelName.replace('private-typing-', '');
      
      // Check if user is a participant in this conversation
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation?.participants.includes(session.user.id)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const authResponse = pusherServer.authorizeChannel(socketId, channelName);
      return NextResponse.json(authResponse);
    }

    return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });

  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
