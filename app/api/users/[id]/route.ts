import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Profile from '@/models/Profile';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;

    const user = await Profile.findById(id)
      .select('firstName lastName photos isOnline lastActiveAt')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Mock online status and last seen for now
    const userData = {
      ...user,
      isOnline: Math.random() > 0.7, // 30% chance of being online
      lastSeen: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24 hours
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
