import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Interest from '@/models/Interest';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { targetUserId, message } = await request.json();

    // Check if interest already exists
    const existingInterest = await Interest.findOne({
      fromUserId: session.user.id,
      toUserId: targetUserId,
    });

    if (existingInterest) {
      return NextResponse.json(
        { error: 'Interest already sent' },
        { status: 400 }
      );
    }

    // Create new interest
    const interest = new Interest({
      fromUserId: session.user.id,
      toUserId: targetUserId,
      message: message || 'I\'m interested in getting to know you better!',
      status: 'pending',
      sentAt: new Date(),
    });

    await interest.save();

    return NextResponse.json({ 
      message: 'Interest sent successfully',
      interest 
    });
  } catch (error) {
    console.error('Interest send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get interests received by current user
    const receivedInterests = await Interest.find({
      toUserId: session.user.id,
    }).populate('fromUserId', 'firstName lastName photos').sort({ sentAt: -1 });

    // Get interests sent by current user
    const sentInterests = await Interest.find({
      fromUserId: session.user.id,
    }).populate('toUserId', 'firstName lastName photos').sort({ sentAt: -1 });

    return NextResponse.json({
      received: receivedInterests,
      sent: sentInterests,
    });
  } catch (error) {
    console.error('Interests fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
