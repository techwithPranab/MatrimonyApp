import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Interest from '@/models/Interest';
import { authOptions } from '@/lib/auth';

export async function PUT(
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

    const { status } = await request.json();

    // Find interest and verify the current user is the recipient
    const interest = await Interest.findOne({
      _id: id,
      toUserId: session.user.id,
    });

    if (!interest) {
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
    }

    // Update interest status
    interest.status = status;
    interest.respondedAt = new Date();
    await interest.save();

    return NextResponse.json({ 
      message: `Interest ${status} successfully`,
      interest 
    });
  } catch (error) {
    console.error('Interest update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
