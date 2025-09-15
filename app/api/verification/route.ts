import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Verification from '@/models/Verification';
import Profile from '@/models/Profile';

interface VerificationDocumentInput {
  fileUrl: string;
  fileName: string;
  fileType: string;
}

// GET /api/verification - Get user's verification status and requests
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user's profile to check current verification status
    const profile = await Profile.findOne({ userId: session.user.id });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get all verification requests for this user
    const verificationRequests = await Verification.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');

    return NextResponse.json({
      currentVerification: profile.verification,
      verificationRequests,
      profileId: profile._id,
    });
  } catch (error) {
    console.error('Error fetching verification data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/verification - Submit a new verification request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      verificationType,
      documents,
      submittedData,
    } = body;

    // Validate required fields
    if (!verificationType || !documents || documents.length === 0) {
      return NextResponse.json(
        { error: 'Verification type and documents are required' },
        { status: 400 }
      );
    }

    // Validate verification type
    const validTypes = ['government_id', 'education', 'profession', 'address', 'income'];
    if (!validTypes.includes(verificationType)) {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user's profile
    const profile = await Profile.findOne({ userId: session.user.id });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if user already has a pending request for this type
    const existingRequest = await Verification.findOne({
      userId: session.user.id,
      verificationType,
      status: { $in: ['pending', 'under_review'] },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending verification request for this type' },
        { status: 400 }
      );
    }

    // Create new verification request
    const verificationRequest = new Verification({
      userId: session.user.id,
      profileId: profile._id,
      verificationType,
      documents: documents.map((doc: VerificationDocumentInput) => ({
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
        fileType: doc.fileType,
        uploadedAt: new Date(),
      })),
      submittedData: submittedData || {},
      status: 'pending',
    });

    await verificationRequest.save();

    return NextResponse.json({
      message: 'Verification request submitted successfully',
      verificationRequest,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating verification request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
