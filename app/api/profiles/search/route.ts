import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Profile from '@/models/Profile';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const {
      ageRange,
      heightRange,
      religion,
      community,
      maritalStatus,
      education,
      profession,
      location,
      diet,
      smoking,
      drinking,
      hasPhotos,
      isVerified,
      page = 1,
      limit = 20,
      sortBy = 'lastActiveAt',
      sortOrder = 'desc',
    } = await request.json();

    // Get current user's profile to determine opposite gender
    const currentUserProfile = await Profile.findOne({ userId: session.user.id });
    if (!currentUserProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Build search query
    const query: Record<string, unknown> = {
      isActive: true,
      'privacy.showProfile': true,
      userId: { $ne: session.user.id }, // Exclude current user
      gender: currentUserProfile.gender === 'male' ? 'female' : 'male', // Opposite gender
    };

    // Age filter
    if (ageRange?.min || ageRange?.max) {
      const now = new Date();
      const maxDate = new Date(now.getFullYear() - (ageRange?.min || 18), now.getMonth(), now.getDate());
      const minDate = new Date(now.getFullYear() - (ageRange?.max || 100), now.getMonth(), now.getDate());
      
      query.dateOfBirth = {
        ...(ageRange?.min && { $lte: maxDate }),
        ...(ageRange?.max && { $gte: minDate }),
      };
    }

    // Height filter
    if (heightRange?.min || heightRange?.max) {
      query.height = {
        ...(heightRange?.min && { $gte: heightRange.min }),
        ...(heightRange?.max && { $lte: heightRange.max }),
      };
    }

    // Religion and community filters
    if (religion && religion.length > 0) {
      query.religion = { $in: religion };
    }
    if (community && community.length > 0) {
      query.community = { $in: community };
    }

    // Marital status filter
    if (maritalStatus && maritalStatus.length > 0) {
      query.maritalStatus = { $in: maritalStatus };
    }

    // Education filter
    if (education && education.length > 0) {
      query.education = { $in: education };
    }

    // Profession filter
    if (profession && profession.length > 0) {
      query.profession = { $in: profession };
    }

    // Location filter
    if (location) {
      if (location.country) query.country = location.country;
      if (location.state) query.state = location.state;
      if (location.city) query.city = location.city;
    }

    // Lifestyle filters
    if (diet && diet.length > 0) {
      query.diet = { $in: diet };
    }
    if (smoking && smoking.length > 0) {
      query.smoking = { $in: smoking };
    }
    if (drinking && drinking.length > 0) {
      query.drinking = { $in: drinking };
    }

    // Photos filter
    if (hasPhotos) {
      query['photos.0'] = { $exists: true };
    }

    // Verification filter
    if (isVerified) {
      query.$or = [
        { 'verification.email': true },
        { 'verification.phone': true },
        { 'verification.governmentId': true },
      ];
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute search with pagination
    const skip = (page - 1) * limit;
    const profiles = await Profile.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-userId -privacy -verification -createdAt -updatedAt')
      .lean();

    // Get total count for pagination
    const total = await Profile.countDocuments(query);

    // Add compatibility scores (mock for now)
    const profilesWithScores = profiles.map((profile) => ({
      ...profile,
      compatibilityScore: Math.floor(Math.random() * 40) + 60, // Mock score 60-100
      matchReasons: ['Education', 'Location', 'Community'], // Mock reasons
    }));

    return NextResponse.json({
      profiles: profilesWithScores,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        limit,
        count: profiles.length,
        totalProfiles: total,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
