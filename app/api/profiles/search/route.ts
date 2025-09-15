import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Profile from '@/models/Profile';
import { authOptions } from '@/lib/auth';

interface SearchFilters {
  ageRange?: { min?: number; max?: number };
  heightRange?: { min?: number; max?: number };
  religion?: string[];
  community?: string[];
  maritalStatus?: string[];
  education?: string[];
  profession?: string[];
  location?: { country?: string; state?: string; city?: string };
  diet?: string[];
  smoking?: string[];
  drinking?: string[];
  hasPhotos?: boolean;
  isVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

function buildSearchQuery(filters: SearchFilters, currentUserId: string, oppositeGender: string) {
  const query: Record<string, unknown> = {
    isActive: true,
    'privacy.showProfile': true,
    userId: { $ne: currentUserId },
    gender: oppositeGender,
  };

  // Age filter
  if (filters.ageRange?.min || filters.ageRange?.max) {
    const now = new Date();
    const maxDate = new Date(now.getFullYear() - (filters.ageRange?.min || 18), now.getMonth(), now.getDate());
    const minDate = new Date(now.getFullYear() - (filters.ageRange?.max || 100), now.getMonth(), now.getDate());
    
    query.dateOfBirth = {
      ...(filters.ageRange?.min && { $lte: maxDate }),
      ...(filters.ageRange?.max && { $gte: minDate }),
    };
  }

  // Height filter
  if (filters.heightRange?.min || filters.heightRange?.max) {
    query.height = {
      ...(filters.heightRange?.min && { $gte: filters.heightRange.min }),
      ...(filters.heightRange?.max && { $lte: filters.heightRange.max }),
    };
  }

  // Array filters
  const arrayFilters = ['religion', 'community', 'maritalStatus', 'education', 'profession', 'diet', 'smoking', 'drinking'];
  arrayFilters.forEach((field) => {
    const filterValue = filters[field as keyof SearchFilters] as string[];
    if (filterValue && filterValue.length > 0) {
      query[field] = { $in: filterValue };
    }
  });

  // Location filter
  if (filters.location) {
    if (filters.location.country) query.country = filters.location.country;
    if (filters.location.state) query.state = filters.location.state;
    if (filters.location.city) query.city = filters.location.city;
  }

  // Photos filter
  if (filters.hasPhotos) {
    query['photos.0'] = { $exists: true };
  }

  // Verification filter
  if (filters.isVerified) {
    query.$or = [
      { 'verification.email': true },
      { 'verification.phone': true },
      { 'verification.governmentId': true },
    ];
  }

  return query;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const filters: SearchFilters = await request.json();
    const {
      page = 1,
      limit = 20,
      sortBy = 'lastActiveAt',
      sortOrder = 'desc',
    } = filters;

    // Get current user's profile
    const currentUserProfile = await Profile.findOne({ userId: session.user.id });
    if (!currentUserProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const oppositeGender = currentUserProfile.gender === 'male' ? 'female' : 'male';
    const query = buildSearchQuery(filters, session.user.id, oppositeGender);

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute search with pagination
    const skip = (page - 1) * limit;
    const [profiles, total] = await Promise.all([
      Profile.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-userId -privacy -verification -createdAt -updatedAt')
        .lean(),
      Profile.countDocuments(query)
    ]);

    // Add compatibility scores (simplified for now due to type constraints)
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
