import AnalyticsDashboard from "@/components/analytics/dashboard";

export const metadata = {
  title: "Analytics Dashboard - Admin",
  description: "Real-time analytics and performance monitoring for the matrimony platform",
};

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
