import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SuccessStory from '@/models/SuccessStory';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // 'published', 'pending', 'rejected'
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: Record<string, unknown> = {};
    
    if (status === 'published') {
      filter.isPublished = true;
    } else if (status === 'pending') {
      filter.isPublished = false;
      filter.rejectedAt = { $exists: false };
    } else if (status === 'rejected') {
      filter.rejectedAt = { $exists: true };
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    } else if (featured === 'false') {
      filter.isFeatured = false;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Get stories
    const stories = await SuccessStory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count
    const total = await SuccessStory.countDocuments(filter);
    
    return NextResponse.json({
      stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch success stories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const story = await SuccessStory.create({
      ...body,
      isPublished: false, // New stories start as unpublished
      isFeatured: false,
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
    });

    return NextResponse.json(story);

  } catch (error) {
    console.error('Error creating success story:', error);
    return NextResponse.json(
      { error: 'Failed to create success story' },
      { status: 500 }
    );
  }
}
