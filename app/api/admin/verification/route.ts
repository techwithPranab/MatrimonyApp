import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Verification from '@/models/Verification';
import User from '@/models/User';

// GET /api/admin/verification - Get all verification requests for admin review
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if user is admin
    const user = await User.findById(session.user.id);
    if (!user?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query
    const query: Record<string, unknown> = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (type && type !== 'all') {
      query.verificationType = type;
    }

    // Get verification requests with pagination
    const verificationRequests = await Verification.find(query)
      .populate({
        path: 'userId',
        select: 'name email',
        model: User,
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v');

    // Get total count for pagination
    const totalCount = await Verification.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Get statistics
    const stats = await Verification.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return NextResponse.json({
      verificationRequests,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats: {
        pending: statusStats.pending || 0,
        under_review: statusStats.under_review || 0,
        approved: statusStats.approved || 0,
        rejected: statusStats.rejected || 0,
        expired: statusStats.expired || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching verification requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/verification/[id]/review - Review a verification request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if user is admin
    const user = await User.findById(session.user.id);
    if (!user?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body;
    const { action, reviewNotes, rejectionReason } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Verification ID and action are required' },
        { status: 400 }
      );
    }

    // Validate action
    if (!['approve', 'reject', 'under_review'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Find verification request
    const verificationRequest = await Verification.findById(id);
    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      );
    }

    // Update verification request
    let newStatus: string;
    if (action === 'approve') {
      newStatus = 'approved';
    } else if (action === 'reject') {
      newStatus = 'rejected';
    } else {
      newStatus = 'under_review';
    }

    verificationRequest.status = newStatus;
    verificationRequest.reviewedAt = new Date();
    verificationRequest.reviewedBy = session.user.id;

    if (reviewNotes) {
      verificationRequest.reviewNotes = reviewNotes;
    }

    if (action === 'reject' && rejectionReason) {
      verificationRequest.rejectionReason = rejectionReason;
    }

    await verificationRequest.save();

    // Send notification to user (this would be implemented in the notification system)
    // For now, we'll just log it
    console.log(`Verification ${action}ed for user ${verificationRequest.userId}: ${verificationRequest.verificationType}`);

    return NextResponse.json({
      message: `Verification request ${action}ed successfully`,
      verificationRequest,
    });
  } catch (error) {
    console.error('Error reviewing verification request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
