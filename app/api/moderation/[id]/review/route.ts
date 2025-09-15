import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ModerationQueue from '@/models/ModerationQueue';
import Profile from '@/models/Profile';
import { Message } from '@/models/Chat';
import User from '@/models/User';
import dbConnect from '@/lib/db';

// POST /api/moderation/[id]/review - Review a moderation item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin or moderator role
    const user = await User.findById(session.user.id);
    if (!user || (!user.roles.includes('admin') && !user.roles.includes('moderator'))) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, reason, notes } = body;

    if (!action || !['approve', 'reject', 'flag'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve, reject, or flag' },
        { status: 400 }
      );
    }

    // Find and update the moderation item
    const moderationItem = await ModerationQueue.findById(id);

    if (!moderationItem) {
      return NextResponse.json(
        { error: 'Moderation item not found' },
        { status: 404 }
      );
    }

    if (moderationItem.status !== 'pending' && moderationItem.status !== 'flagged') {
      return NextResponse.json(
        { error: 'Item has already been reviewed' },
        { status: 400 }
      );
    }

    // Update moderation item
    moderationItem.status = action;
    moderationItem.reviewedBy = session.user.id;
    moderationItem.reviewedAt = new Date();
    moderationItem.reviewReason = reason;
    moderationItem.adminNotes = notes;

    await moderationItem.save();

    // Update the original content
    await updateOriginalContent(
      moderationItem.contentType,
      moderationItem.contentId,
      action
    );

    return NextResponse.json({
      success: true,
      item: moderationItem
    });

  } catch (error) {
    console.error('Error reviewing moderation item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update original content after review
async function updateOriginalContent(
  contentType: string,
  contentId: string,
  action: string
) {
  try {
    const updateData = {
      moderationStatus: action,
      moderatedAt: new Date()
    };

    switch (contentType) {
      case 'profile':
        await Profile.findByIdAndUpdate(contentId, updateData);
        break;

      case 'message':
        await Message.findByIdAndUpdate(contentId, updateData);
        break;

      // Add cases for photo and success_story when those models are implemented
      default:
        console.warn(`Unknown content type for moderation update: ${contentType}`);
    }
  } catch (error) {
    console.error('Error updating original content after review:', error);
  }
}
