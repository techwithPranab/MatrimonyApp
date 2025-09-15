import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

interface AdminUserData {
  _id: unknown;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  registrationDate?: Date;
  lastActiveAt?: Date;
  subscription?: string;
  verificationStatus?: string;
  profileCompletion?: number;
  totalViews?: number;
  totalLikes?: number;
  isActive?: boolean;
  isSuspended?: boolean;
  city?: string;
  state?: string;
  country?: string;
}

// Admin authentication middleware
async function isAdmin(request: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions);
  // In production, you'd check if user has admin role in database
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const subscription = searchParams.get('subscription') || '';
    const verificationStatus = searchParams.get('verificationStatus') || '';
    const isActive = searchParams.get('isActive') || '';
    const isSuspended = searchParams.get('isSuspended') || '';
    const sortBy = searchParams.get('sortBy') || 'registrationDate';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query
    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (subscription) {
      query.subscription = subscription;
    }

    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }

    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    if (isSuspended !== '') {
      query.isSuspended = isSuspended === 'true';
    }

    const skip = (page - 1) * limit;
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy] = sortOrder;

    // Execute query
    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select('firstName lastName email phone registrationDate lastActiveAt subscription verificationStatus profileCompletion totalViews totalLikes isActive isSuspended city state country')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      users: users.map((user) => ({
        ...user,
        _id: (user as unknown as { _id: { toString(): string } })._id.toString(),
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
      },
    });

  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
