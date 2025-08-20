import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Profile from "@/models/Profile";
import { Message } from "@/models/Chat";
import Subscription from "@/models/Subscription";
import Interest from "@/models/Interest";
import Revenue from "@/models/Revenue";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30"; // days

    const daysAgo = parseInt(range);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // User Statistics
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

    // Active users (logged in within last 30 days)
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Premium users (users with active subscriptions)
    const premiumUsers = await Subscription.countDocuments({
      status: "active",
      plan: { $ne: "free" }
    });

    // Revenue Statistics - Use Revenue model if available, fallback to Subscription
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let weeklyRevenue = 0;
    let dailyRevenue = 0;

    try {
      // Try using Revenue model first
      const revenueStats = await Revenue.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$netAmount" },
            monthly: {
              $sum: {
                $cond: [
                  { $gte: ["$createdAt", monthStart] },
                  "$netAmount",
                  0
                ]
              }
            },
            weekly: {
              $sum: {
                $cond: [
                  { $gte: ["$createdAt", weekStart] },
                  "$netAmount",
                  0
                ]
              }
            },
            daily: {
              $sum: {
                $cond: [
                  { $gte: ["$createdAt", todayStart] },
                  "$netAmount",
                  0
                ]
              }
            }
          }
        }
      ]);

      if (revenueStats.length > 0) {
        totalRevenue = revenueStats[0].total || 0;
        monthlyRevenue = revenueStats[0].monthly || 0;
        weeklyRevenue = revenueStats[0].weekly || 0;
        dailyRevenue = revenueStats[0].daily || 0;
      }
    } catch {
      // Fallback to subscription-based revenue calculation
      const subscriptions = await Subscription.find({
        createdAt: { $gte: startDate },
        status: "active"
      });

      // Mock pricing for subscriptions
      const planPrices = { free: 0, basic: 999, premium: 1999, elite: 4999 };
      
      totalRevenue = subscriptions.reduce((sum, sub) => 
        sum + (planPrices[sub.plan as keyof typeof planPrices] || 0), 0);
      
      monthlyRevenue = subscriptions
        .filter(sub => sub.createdAt >= monthStart)
        .reduce((sum, sub) => 
          sum + (planPrices[sub.plan as keyof typeof planPrices] || 0), 0);

      weeklyRevenue = subscriptions
        .filter(sub => sub.createdAt >= weekStart)
        .reduce((sum, sub) => 
          sum + (planPrices[sub.plan as keyof typeof planPrices] || 0), 0);

      dailyRevenue = subscriptions
        .filter(sub => sub.createdAt >= todayStart)
        .reduce((sum, sub) => 
          sum + (planPrices[sub.plan as keyof typeof planPrices] || 0), 0);
    }

    // Matching Statistics
    const totalInterests = await Interest.countDocuments();
    const successfulMatches = await Interest.countDocuments({
      status: "accepted"
    });
    const matchSuccessRate = totalInterests > 0 
      ? Math.round((successfulMatches / totalInterests) * 100) 
      : 0;

    // Engagement Statistics
    const profiles = await Profile.find({}, 'views');
    const profileViews = profiles.reduce((sum: number, profile: { views?: number }) => sum + (profile.views || 0), 0);
    
    const totalMessages = await Message.countDocuments({
      createdAt: { $gte: startDate }
    });

    const interests = await Interest.countDocuments({
      createdAt: { $gte: startDate }
    });

    const analyticsData = {
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
        monthlyRevenue,
        weeklyRevenue,
        dailyRevenue
      },
      matchingStats: {
        totalMatches: totalInterests,
        successfulMatches,
        matchSuccessRate
      },
      engagementStats: {
        profileViews,
        messages: totalMessages,
        interests
      }
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
