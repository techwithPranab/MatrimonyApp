"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp, 
  MessageSquare,
  DollarSign,
  AlertTriangle
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  pendingApprovals: number;
  activeUsers: number;
  blockedUsers: number;
  todaySignups: number;
  openTickets: number;
  revenue: number;
  flaggedProfiles: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    blockedUsers: 0,
    todaySignups: 0,
    openTickets: 0,
    revenue: 0,
    flaggedProfiles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      href: "/admin/users",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Clock,
      color: "bg-yellow-500",
      href: "/admin/approvals",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "bg-green-500",
      href: "/admin/users?status=active",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserX,
      color: "bg-red-500",
      href: "/admin/users?status=blocked",
    },
    {
      title: "Today's Signups",
      value: stats.todaySignups,
      icon: TrendingUp,
      color: "bg-purple-500",
      href: "/admin/analytics",
    },
    {
      title: "Open Tickets",
      value: stats.openTickets,
      icon: MessageSquare,
      color: "bg-orange-500",
      href: "/admin/support",
    },
    {
      title: "Monthly Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      href: "/admin/payments",
    },
    {
      title: "Flagged Profiles",
      value: stats.flaggedProfiles,
      icon: AlertTriangle,
      color: "bg-pink-500",
      href: "/admin/moderation",
    },
  ];

  const quickActions = [
    { label: "Review Pending Profiles", href: "/admin/approvals", urgent: stats.pendingApprovals > 0 },
    { label: "Handle Support Tickets", href: "/admin/support", urgent: stats.openTickets > 0 },
    { label: "Moderate Flagged Content", href: "/admin/moderation", urgent: stats.flaggedProfiles > 0 },
    { label: "User Management", href: "/admin/users", urgent: false },
    { label: "Payment Management", href: "/admin/payments", urgent: false },
    { label: "Analytics & Reports", href: "/admin/analytics", urgent: false },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </div>
            <Button onClick={fetchDashboardStats} variant="outline">
              Refresh Data
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks and urgent items requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.urgent ? "default" : "outline"}
                  className={`justify-start h-auto p-4 ${action.urgent ? "bg-red-500 hover:bg-red-600" : ""}`}
                  asChild
                >
                  <a href={action.href}>
                    <div className="text-left">
                      <div className="font-medium">{action.label}</div>
                      {action.urgent && (
                        <Badge variant="secondary" className="mt-1">
                          Needs Attention
                        </Badge>
                      )}
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* This would be populated with real data */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Priya Sharma</p>
                    <p className="text-sm text-gray-600">Registered 2 hours ago</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Amit Kumar</p>
                    <p className="text-sm text-gray-600">Registered 4 hours ago</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Payment Issue</p>
                    <p className="text-sm text-gray-600">TKT-1234 • 1 hour ago</p>
                  </div>
                  <Badge variant="destructive">High</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Profile Verification</p>
                    <p className="text-sm text-gray-600">TKT-1235 • 3 hours ago</p>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
