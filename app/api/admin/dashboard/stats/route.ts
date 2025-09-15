import { NextResponse } from 'next/server';
import UserApproval from "@/models/UserApproval";
import Profile from "@/models/Profile";
import SupportTicket from "@/models/SupportTicket";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    // Temporary: Skip auth check for testing
    console.log('Dashboard stats request received');
    
    await connectDB();

    // Get various stats in parallel
    const [
      pendingApprovals,
      totalUsers,
      activeUsers,
      blockedUsers,
      todaySignups,
      openTickets,
      flaggedProfiles
    ] = await Promise.all([
      UserApproval.countDocuments({ status: 'pending' }),
      Profile.countDocuments(),
      Profile.countDocuments({ isActive: true }),
      Profile.countDocuments({ isActive: false }),
      Profile.countDocuments({ 
        createdAt: { 
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) 
        } 
      }),
      SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      UserApproval.countDocuments({ flags: { $exists: true, $ne: [] } })
    ]);

    // Calculate monthly revenue (mock data for now)
    const revenue = 150000; // This should come from your payment/subscription system

    const stats = {
      totalUsers,
      pendingApprovals,
      activeUsers,
      blockedUsers,
      todaySignups,
      openTickets,
      revenue,
      flaggedProfiles,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
