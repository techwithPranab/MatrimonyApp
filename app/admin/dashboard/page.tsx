import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// This would typically come from your database
async function getAdminMetrics() {
  // Mock data - replace with actual database queries
  return {
    userMetrics: {
      totalUsers: 15420,
      newUsersToday: 85,
      newUsersThisWeek: 642,
      newUsersThisMonth: 2847,
      activeUsers: 8945,
      verifiedProfiles: 12156,
      pendingVerifications: 234,
      suspendedAccounts: 45,
    },
    revenueMetrics: {
      totalRevenue: 2847562,
      revenueToday: 12450,
      revenueThisWeek: 95600,
      revenueThisMonth: 384700,
      subscriptions: {
        free: 8245,
        premium: 5890,
        gold: 1285,
      },
      averageRevenuePerUser: 184.50,
      conversionRate: 23.4,
    },
    moderationQueue: {
      pendingProfiles: 156,
      reportedContent: 23,
      flaggedPhotos: 67,
      reviewRequests: 89,
      blockedUsers: 234,
    },
    systemHealth: {
      uptime: 99.97,
      avgResponseTime: 145,
      errorRate: 0.23,
      activeConnections: 2847,
      serverLoad: 67,
      databaseConnections: 145,
    },
    engagementMetrics: {
      dailyActiveUsers: 5620,
      averageSessionDuration: 1847, // seconds
      bounceRate: 12.4,
      messagesSent: 28470,
      interestsSent: 5680,
      profileViews: 156890,
      matchesCreated: 1245,
    },
  };
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin
  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Complete overview of your matrimony platform</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="justify-start h-auto p-4"
          onClick={() => window.location.href = '/admin/analytics'}
        >
          <div className="text-left">
            <div className="font-medium">Analytics</div>
            <div className="text-sm text-gray-500">Detailed insights</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="justify-start h-auto p-4"
          onClick={() => window.location.href = '/admin/moderation'}
        >
          <div className="text-left">
            <div className="font-medium">Moderation</div>
            <div className="text-sm text-gray-500">{metrics.moderationQueue.pendingProfiles} pending</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="justify-start h-auto p-4"
          onClick={() => window.location.href = '/admin/users'}
        >
          <div className="text-left">
            <div className="font-medium">User Management</div>
            <div className="text-sm text-gray-500">{metrics.userMetrics.totalUsers.toLocaleString()} total</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="justify-start h-auto p-4"
          onClick={() => window.location.href = '/admin/revenue'}
        >
          <div className="text-left">
            <div className="font-medium">Revenue</div>
            <div className="text-sm text-gray-500">₹{(metrics.revenueMetrics.totalRevenue / 100000).toFixed(1)}L</div>
          </div>
        </Button>
      </div>

      {/* User Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{metrics.userMetrics.totalUsers.toLocaleString()}</p>
              </div>
              <div className="text-sm font-medium text-green-600">
                +{metrics.userMetrics.newUsersToday} today
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{metrics.userMetrics.activeUsers.toLocaleString()}</p>
              </div>
              <div className="text-sm font-medium text-blue-600">
                {((metrics.userMetrics.activeUsers / metrics.userMetrics.totalUsers) * 100).toFixed(1)}%
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Profiles</p>
                <p className="text-2xl font-bold">{metrics.userMetrics.verifiedProfiles.toLocaleString()}</p>
              </div>
              <div className="text-sm font-medium text-orange-600">
                {metrics.userMetrics.pendingVerifications} pending
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold">{metrics.userMetrics.newUsersThisMonth.toLocaleString()}</p>
              </div>
              <div className="text-sm font-medium text-green-600">
                +24.5%
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(metrics.revenueMetrics.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <div className="text-sm font-medium text-green-600">
                +12.5%
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹{(metrics.revenueMetrics.revenueThisMonth / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-sm font-medium text-green-600">
                +18.2%
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{metrics.revenueMetrics.conversionRate}%</p>
              </div>
              <div className="text-sm font-medium text-blue-600">
                Avg: ₹{metrics.revenueMetrics.averageRevenuePerUser}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Subscriptions</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Free:</span>
                  <span className="font-medium">{metrics.revenueMetrics.subscriptions.free.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Premium:</span>
                  <span className="font-medium text-blue-600">{metrics.revenueMetrics.subscriptions.premium.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gold:</span>
                  <span className="font-medium text-yellow-600">{metrics.revenueMetrics.subscriptions.gold.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* System Health & Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Health */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className={`text-sm font-medium ${
                  metrics.systemHealth.uptime >= 99.5 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.systemHealth.uptime}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className={`text-sm font-medium ${
                  metrics.systemHealth.avgResponseTime <= 200 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {metrics.systemHealth.avgResponseTime}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className={`text-sm font-medium ${
                  metrics.systemHealth.errorRate <= 0.5 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.systemHealth.errorRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Connections</span>
                <span className="text-sm font-medium text-blue-600">
                  {metrics.systemHealth.activeConnections.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Server Load</span>
                <span className={`text-sm font-medium ${
                  metrics.systemHealth.serverLoad <= 70 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {metrics.systemHealth.serverLoad}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Engagement Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagement Metrics</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Active Users</span>
                <span className="text-sm font-medium text-blue-600">
                  {metrics.engagementMetrics.dailyActiveUsers.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Session Duration</span>
                <span className="text-sm font-medium text-green-600">
                  {Math.round(metrics.engagementMetrics.averageSessionDuration / 60)}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Messages Sent Today</span>
                <span className="text-sm font-medium text-purple-600">
                  {metrics.engagementMetrics.messagesSent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Interests Sent</span>
                <span className="text-sm font-medium text-pink-600">
                  {metrics.engagementMetrics.interestsSent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="text-sm font-medium text-indigo-600">
                  {metrics.engagementMetrics.profileViews.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Matches Created</span>
                <span className="text-sm font-medium text-yellow-600">
                  {metrics.engagementMetrics.matchesCreated.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Moderation Queue */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Moderation Queue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{metrics.moderationQueue.pendingProfiles}</p>
              <p className="text-xs text-gray-600">Pending Profiles</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{metrics.moderationQueue.reportedContent}</p>
              <p className="text-xs text-gray-600">Reported Content</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{metrics.moderationQueue.flaggedPhotos}</p>
              <p className="text-xs text-gray-600">Flagged Photos</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{metrics.moderationQueue.reviewRequests}</p>
              <p className="text-xs text-gray-600">Review Requests</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{metrics.moderationQueue.blockedUsers}</p>
              <p className="text-xs text-gray-600">Blocked Users</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
