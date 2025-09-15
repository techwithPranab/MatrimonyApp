import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { InterestService } from '@/lib/interest';

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
    const body = await request.json();
    const { action, message } = body;

    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be "accept" or "decline"' },
        { status: 400 }
      );
    }

    const interest = await InterestService.respondToInterest(
      id,
      session.user.id,
      action,
      message
    );

    return NextResponse.json({
      success: true,
      interest,
      message: `Interest ${action}ed successfully`
    });
  } catch (error: unknown) {
    console.error('Error responding to interest:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to respond to interest' },
      { status: 400 }
    );
  }
}

export async function DELETE(
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

    const interest = await InterestService.withdrawInterest(id, session.user.id);

    return NextResponse.json({
      success: true,
      interest,
      message: 'Interest withdrawn successfully'
    });
  } catch (error: unknown) {
    console.error('Error withdrawing interest:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to withdraw interest' },
      { status: 400 }
    );
  }
}

export async function PATCH(
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

    const interest = await InterestService.markInterestAsRead(id, session.user.id);

    return NextResponse.json({
      success: true,
      interest,
      message: 'Interest marked as read'
    });
  } catch (error: unknown) {
    console.error('Error marking interest as read:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to mark interest as read' },
      { status: 400 }
    );
  }
}
