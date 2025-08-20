import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SuccessStory from '@/models/SuccessStory';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { action, adminId, reason } = await request.json();
    const { id } = await context.params;
    const story = await SuccessStory.findById(id);
    if (!story) {
      return NextResponse.json(
        { error: 'Success story not found' },
        { status: 404 }
      );
    }
    switch (action) {
      case 'approve':
        await story.approve(adminId);
        break;
      case 'reject':
        if (!reason) {
          return NextResponse.json(
            { error: 'Rejection reason is required' },
            { status: 400 }
          );
        }
        await story.reject(adminId, reason);
        break;
      case 'toggle_featured':
        await story.toggleFeatured();
        break;
      case 'increment_view':
        await story.incrementView();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    return NextResponse.json(story);
  } catch (error) {
    console.error('Error performing action on success story:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}
