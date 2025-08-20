import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SuccessStory from '@/models/SuccessStory';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    const story = await SuccessStory.findById(id);
    
    if (!story) {
      return NextResponse.json(
        { error: 'Success story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(story);

  } catch (error) {
    console.error('Error fetching success story:', error);
    return NextResponse.json(
      { error: 'Failed to fetch success story' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const { id } = await context.params;
    const story = await SuccessStory.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!story) {
      return NextResponse.json(
        { error: 'Success story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(story);

  } catch (error) {
    console.error('Error updating success story:', error);
    return NextResponse.json(
      { error: 'Failed to update success story' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    const story = await SuccessStory.findByIdAndDelete(id);
    
    if (!story) {
      return NextResponse.json(
        { error: 'Success story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Success story deleted successfully' });

  } catch (error) {
    console.error('Error deleting success story:', error);
    return NextResponse.json(
      { error: 'Failed to delete success story' },
      { status: 500 }
    );
  }
}