"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  PieChart,
  Activity,
  Download
} from "lucide-react";

interface AnalyticsData {
  userStats: {
    totalUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    activeUsers: number;
    premiumUsers: number;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    weeklyRevenue: number;
    dailyRevenue: number;
  };
  matchingStats: {
    totalMatches: number;
    successfulMatches: number;
    matchSuccessRate: number;
  };
  engagementStats: {
    profileViews: number;
    messages: number;
    interests: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}&type=${reportType}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, reportType]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, reportType, fetchAnalytics]);

  const generateReport = async (format: 'pdf' | 'excel') => {
    try {
      const response = await fetch(`/api/admin/analytics/export?format=${format}&range=${dateRange}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-gray-600">Monitor platform performance and user engagement</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchAnalytics} variant="outline">
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Report Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="users">User Analytics</SelectItem>
                    <SelectItem value="revenue">Revenue Analytics</SelectItem>
                    <SelectItem value="matching">Matching Analytics</SelectItem>
                    <SelectItem value="engagement">Engagement Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateReport('excel')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateReport('pdf')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* User Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analytics.userStats?.totalUsers != null ? analytics.userStats.totalUsers.toLocaleString() : "0"}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    +{analytics.userStats?.newUsersThisMonth ?? 0} this month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Active Users
                    </CardTitle>
                    <Activity className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analytics.userStats?.activeUsers != null ? analytics.userStats.activeUsers.toLocaleString() : "0"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {analytics.userStats?.activeUsers != null && analytics.userStats?.totalUsers != null ? Math.round((analytics.userStats.activeUsers / analytics.userStats.totalUsers) * 100) : 0}% of total
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Monthly Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{analytics.revenueStats?.monthlyRevenue != null ? analytics.revenueStats.monthlyRevenue.toLocaleString() : "0"}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    +15% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Success Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analytics.matchingStats?.matchSuccessRate ?? 0}%
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {analytics.matchingStats?.successfulMatches ?? 0} successful matches
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* User Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Today</span>
                      <Badge variant="secondary">{analytics.userStats?.newUsersToday ?? 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Week</span>
                      <Badge variant="secondary">{analytics.userStats?.newUsersThisWeek ?? 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month</span>
                      <Badge variant="secondary">{analytics.userStats?.newUsersThisMonth ?? 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Premium Users</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {analytics.userStats?.premiumUsers ?? 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Daily Revenue</span>
                      <span className="font-medium">₹{analytics.revenueStats?.dailyRevenue != null ? analytics.revenueStats.dailyRevenue.toLocaleString() : "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Weekly Revenue</span>
                      <span className="font-medium">₹{analytics.revenueStats?.weeklyRevenue != null ? analytics.revenueStats.weeklyRevenue.toLocaleString() : "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Revenue</span>
                      <span className="font-medium">₹{analytics.revenueStats?.monthlyRevenue != null ? analytics.revenueStats.monthlyRevenue.toLocaleString() : "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <span className="font-bold text-green-600">₹{analytics.revenueStats?.totalRevenue != null ? analytics.revenueStats.totalRevenue.toLocaleString() : "0"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Engagement & Matching Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profile Views</span>
                      <span className="font-medium">{analytics.engagementStats?.profileViews != null ? analytics.engagementStats.profileViews.toLocaleString() : "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Messages Sent</span>
                      <span className="font-medium">{analytics.engagementStats?.messages != null ? analytics.engagementStats.messages.toLocaleString() : "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Interests Expressed</span>
                      <span className="font-medium">{analytics.engagementStats?.interests != null ? analytics.engagementStats.interests.toLocaleString() : "0"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Matching Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Matching Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Matches</span>
                      <span className="font-medium">{analytics.matchingStats?.totalMatches != null ? analytics.matchingStats.totalMatches.toLocaleString() : "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Successful Matches</span>
                      <span className="font-medium">{analytics.matchingStats?.successfulMatches != null ? analytics.matchingStats.successfulMatches.toLocaleString() : "0"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {analytics.matchingStats?.matchSuccessRate ?? 0}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
