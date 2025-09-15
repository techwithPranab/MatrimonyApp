import { NextRequest, NextResponse } from 'next/server';
import { performanceMonitor } from '@/lib/analytics/performance';
import { userAnalytics } from '@/lib/analytics/user-analytics';

export async function POST(request: NextRequest) {
  try {
    const { type, data, timestamp } = await request.json();
    
    // Basic validation
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type, data' },
        { status: 400 }
      );
    }

    // Store analytics data (in production, you'd save to database)
    console.log(`[Analytics] ${type}:`, {
      ...data,
      timestamp,
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    // You could also forward this to external services like:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - Custom analytics database

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Basic authentication check (implement proper auth)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let analytics = {};

    switch (type) {
      case 'performance':
        analytics = performanceMonitor.getPerformanceSnapshot();
        break;
      
      case 'export':
        if (startDate && endDate) {
          analytics = performanceMonitor.exportAnalytics({
            start: new Date(startDate),
            end: new Date(endDate),
          });
        } else {
          return NextResponse.json(
            { error: 'Start date and end date required for export' },
            { status: 400 }
          );
        }
        break;
      
      case 'segments':
        analytics = userAnalytics.getUserSegments();
        break;
      
      case 'funnel': {
        const funnelName = searchParams.get('funnel');
        if (funnelName) {
          analytics = userAnalytics.getFunnelAnalytics(funnelName);
        } else {
          return NextResponse.json(
            { error: 'Funnel name required' },
            { status: 400 }
          );
        }
        break;
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
