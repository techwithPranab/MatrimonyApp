import { NextResponse } from "next/server";
import UserApproval from "@/models/UserApproval";
import connectDB from "@/lib/db";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query
    const query: Record<string, unknown> = {};
    if (status && status !== 'all') query.status = status;
    if (type && type !== 'all') query.submissionType = type;
    if (priority && priority !== 'all') query.priority = priority;
    if (search) {
      query.$or = [
        { 'profileData.firstName': { $regex: search, $options: 'i' } },
        { 'profileData.lastName': { $regex: search, $options: 'i' } },
        { 'profileData.email': { $regex: search, $options: 'i' } },
      ];
    }

    const approvals = await UserApproval.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await UserApproval.countDocuments(query);

    return NextResponse.json({
      approvals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Approvals fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch approvals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const approval = new UserApproval(data);
    await approval.save();
    
    return NextResponse.json({ success: true, approval });
  } catch (error) {
    console.error('Create approval error:', error);
    return NextResponse.json(
      { error: "Failed to create approval" },
      { status: 500 }
    );
  }
}
