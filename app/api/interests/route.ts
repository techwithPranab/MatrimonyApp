import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Interest from '@/models/Interest';
import { authOptions } from '@/lib/auth';

// GET /api/interests - Get user's interests (sent and received)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'all', 'sent', 'received', 'pending'

    let interests;

    switch (type) {
      case 'sent':
        interests = await Interest.findSentInterests(userId);
        break;
      case 'received':
        interests = await Interest.find({ toUserId: userId }).sort({ sentAt: -1 });
        break;
      case 'pending':
        interests = await Interest.findPendingInterests(userId);
        break;
      default: {
        // Get both sent and received interests
        const [sent, received] = await Promise.all([
          Interest.findSentInterests(userId),
          Interest.find({ toUserId: userId }).sort({ sentAt: -1 })
        ]);
        interests = { sent, received };
      }
    }

    return NextResponse.json({ interests });
  } catch (error) {
    console.error('Interests fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/interests - Send an interest
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = session.user.id;
    const { toUserId, message, priority = 'normal' } = await request.json();

    if (!toUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    if (userId === toUserId) {
      return NextResponse.json({ error: 'Cannot send interest to yourself' }, { status: 400 });
    }

    // Check if interest already exists
    const existingInterest = await Interest.checkExistingInterest(userId, toUserId);
    if (existingInterest) {
      return NextResponse.json({
        error: 'Interest already exists',
        interest: existingInterest
      }, { status: 409 });
    }

    const interest = new Interest({
      fromUserId: userId,
      toUserId,
      message,
      priority,
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await interest.save();

    return NextResponse.json({
      success: true,
      message: 'Interest sent successfully',
      interest
    });
  } catch (error) {
    console.error('Interest creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
