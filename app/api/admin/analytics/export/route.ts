import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Profile from "@/models/Profile";
import { Message } from "@/models/Chat";
import Subscription from "@/models/Subscription";
import Interest from "@/models/Interest";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "excel";
    const range = searchParams.get("range") || "30";

    const daysAgo = parseInt(range);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Gather analytics data
    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: todayStart }
    });
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: weekStart }
    });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: monthStart }
    });

    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
    });

    const premiumUsers = await User.countDocuments({
      subscriptionStatus: "active"
    });

    const subscriptions = await Subscription.find({
      createdAt: { $gte: startDate }
    });

    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const monthlyRevenue = subscriptions
      .filter(sub => sub.createdAt >= monthStart)
      .reduce((sum, sub) => sum + sub.price, 0);

    const totalInterests = await Interest.countDocuments();
    const successfulMatches = await Interest.countDocuments({
      status: "accepted"
    });

    const totalMessages = await Message.countDocuments({
      createdAt: { $gte: startDate }
    });

    const profiles = await Profile.find({}, 'views');
    const profileViews = profiles.reduce((sum: number, profile: { views?: number }) => sum + (profile.views || 0), 0);

    if (format === "excel") {
      // Create Excel-like CSV data
      const csvData = [
        ["Analytics Report", `Generated on ${new Date().toLocaleDateString()}`],
        ["Date Range", `Last ${range} days`],
        [""],
        ["User Statistics", ""],
        ["Total Users", totalUsers],
        ["New Users Today", newUsersToday],
        ["New Users This Week", newUsersThisWeek],
        ["New Users This Month", newUsersThisMonth],
        ["Active Users", activeUsers],
        ["Premium Users", premiumUsers],
        [""],
        ["Revenue Statistics", ""],
        ["Total Revenue", `₹${totalRevenue}`],
        ["Monthly Revenue", `₹${monthlyRevenue}`],
        [""],
        ["Engagement Statistics", ""],
        ["Total Profile Views", profileViews],
        ["Total Messages", totalMessages],
        ["Total Interests", totalInterests],
        ["Successful Matches", successfulMatches],
        ["Match Success Rate", `${totalInterests > 0 ? Math.round((successfulMatches / totalInterests) * 100) : 0}%`]
      ];

      const csvContent = csvData.map(row => row.join(",")).join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="analytics-report-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    if (format === "pdf") {
      // For PDF, we'll return JSON data that frontend can use to generate PDF
      const reportData = {
        title: "Analytics Report",
        generatedAt: new Date().toISOString(),
        dateRange: `Last ${range} days`,
        data: {
          userStats: {
            totalUsers,
            newUsersToday,
            newUsersThisWeek,
            newUsersThisMonth,
            activeUsers,
            premiumUsers
          },
          revenueStats: {
            totalRevenue,
            monthlyRevenue
          },
          engagementStats: {
            profileViews,
            totalMessages,
            totalInterests,
            successfulMatches,
            matchSuccessRate: totalInterests > 0 ? Math.round((successfulMatches / totalInterests) * 100) : 0
          }
        }
      };

      // Return JSON for now - in production, you'd use a PDF library like puppeteer
      return NextResponse.json(reportData, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="analytics-report-${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });

  } catch (error) {
    console.error("Export analytics error:", error);
    return NextResponse.json(
      { error: "Failed to export analytics data" },
      { status: 500 }
    );
  }
}
