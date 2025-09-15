'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalyticsDashboard } from '@/lib/analytics/hooks';

interface MetricCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly change?: number;
  readonly format?: 'number' | 'percentage' | 'duration' | 'currency';
}

function MetricCard({ title, value, change, format = 'number' }: Readonly<MetricCardProps>) {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'duration':
        return `${val.toFixed(0)}ms`;
      case 'currency':
        return `₹${val.toLocaleString()}`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{formatValue(value)}</p>
        </div>
        {change !== undefined && (
          <div className={`text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </div>
        )}
      </div>
    </Card>
  );
}

interface PerformanceMetrics {
  avgResponseTime: number;
  errorRate: number;
  throughput: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  apiEndpoints: Array<{
    endpoint: string;
    avgResponseTime: number;
    errorRate: number;
    callCount: number;
  }>;
}

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{
    page: string;
    views: number;
    avgDuration: number;
  }>;
}

interface FunnelStep {
  step: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
}

export default function AnalyticsDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics | null>(null);
  const [userAnalyticsData, setUserAnalyticsData] = useState<UserAnalytics | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'users' | 'funnels'>('overview');
  const [dateRange, setDateRange] = useState('7d');

  const { 
    fetchPerformanceData, 
    fetchUserSegments, 
    fetchFunnelData, 
    exportAnalytics 
  } = useAnalyticsDashboard();

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [performance, users, funnel] = await Promise.all([
          fetchPerformanceData(),
          fetchUserSegments(),
          fetchFunnelData('registration'),
        ]);

        setPerformanceData(performance);
        setUserAnalyticsData(users);
        setFunnelData(funnel || []);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [dateRange, fetchPerformanceData, fetchUserSegments, fetchFunnelData]);

  const handleExport = async () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    await exportAnalytics(startDate, endDate);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time insights into your matrimony platform</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button onClick={handleExport} variant="outline">
            Export Data
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 mb-8">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'performance', label: 'Performance' },
          { id: 'users', label: 'User Analytics' },
          { id: 'funnels', label: 'Conversion Funnels' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'performance' | 'users' | 'funnels')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Total Users" 
              value={userAnalyticsData?.totalUsers || 0} 
              change={12.5}
            />
            <MetricCard 
              title="Active Users" 
              value={userAnalyticsData?.activeUsers || 0} 
              change={8.2}
            />
            <MetricCard 
              title="Conversion Rate" 
              value={userAnalyticsData?.conversionRate || 0} 
              format="percentage"
              change={-2.1}
            />
            <MetricCard 
              title="Avg Response Time" 
              value={performanceData?.avgResponseTime || 0} 
              format="duration"
              change={-15.3}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Largest Contentful Paint (LCP)</span>
                  <span className={`text-sm font-medium ${
                    (performanceData?.coreWebVitals.lcp || 0) <= 2500 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {performanceData?.coreWebVitals.lcp || 0}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">First Input Delay (FID)</span>
                  <span className={`text-sm font-medium ${
                    (performanceData?.coreWebVitals.fid || 0) <= 100 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {performanceData?.coreWebVitals.fid || 0}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cumulative Layout Shift (CLS)</span>
                  <span className={`text-sm font-medium ${
                    (performanceData?.coreWebVitals.cls || 0) <= 0.1 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(performanceData?.coreWebVitals.cls || 0).toFixed(3)}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
              <div className="space-y-3">
                {(userAnalyticsData?.topPages || []).slice(0, 5).map((page) => (
                  <div key={page.page} className="flex justify-between items-center">
                    <span className="text-sm text-gray-900 truncate">{page.page}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{page.views.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{Math.round(page.avgDuration)}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Average Response Time" 
              value={performanceData?.avgResponseTime || 0} 
              format="duration"
              change={-8.5}
            />
            <MetricCard 
              title="Error Rate" 
              value={performanceData?.errorRate || 0} 
              format="percentage"
              change={-12.3}
            />
            <MetricCard 
              title="Throughput" 
              value={performanceData?.throughput || 0} 
              change={15.7}
            />
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">API Endpoints Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Endpoint</th>
                    <th className="text-right py-2">Avg Response Time</th>
                    <th className="text-right py-2">Error Rate</th>
                    <th className="text-right py-2">Call Count</th>
                  </tr>
                </thead>
                <tbody>
                  {(performanceData?.apiEndpoints || []).map((endpoint) => (
                    <tr key={endpoint.endpoint} className="border-b">
                      <td className="py-2 text-gray-900">{endpoint.endpoint}</td>
                      <td className="py-2 text-right text-gray-600">
                        {endpoint.avgResponseTime.toFixed(0)}ms
                      </td>
                      <td className="py-2 text-right">
                        <span className={`${
                          endpoint.errorRate > 5 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {endpoint.errorRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 text-right text-gray-600">
                        {endpoint.callCount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* User Analytics Tab */}
      {activeTab === 'users' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="New Registrations" 
              value={userAnalyticsData?.newRegistrations || 0} 
              change={25.3}
            />
            <MetricCard 
              title="Session Duration" 
              value={Math.round((userAnalyticsData?.sessionDuration || 0) / 60)}
              format="number"
              change={-5.2}
            />
            <MetricCard 
              title="Bounce Rate" 
              value={userAnalyticsData?.bounceRate || 0} 
              format="percentage"
              change={-8.1}
            />
            <MetricCard 
              title="Active Users" 
              value={userAnalyticsData?.activeUsers || 0} 
              change={12.8}
            />
          </div>

          {/* User engagement chart would go here */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Engagement Metrics</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Chart visualization would be implemented here</p>
            </div>
          </Card>
        </div>
      )}

      {/* Conversion Funnels Tab */}
      {activeTab === 'funnels' && (
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Registration Funnel</h3>
            <div className="space-y-4">
              {funnelData.map((step) => (
                <div key={step.step} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{step.step}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {step.users.toLocaleString()} users
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {step.conversionRate.toFixed(1)}%
                      </span>
                      {step.dropoffRate > 0 && (
                        <span className="text-sm font-medium text-red-600">
                          -{step.dropoffRate.toFixed(1)}% drop-off
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${step.conversionRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Additional funnel visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Creation Funnel</h3>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">Profile funnel visualization</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Subscription Funnel</h3>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">Subscription funnel visualization</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
