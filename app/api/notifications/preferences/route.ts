import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import NotificationPreferences from '@/models/NotificationPreferences';
import dbConnect from '@/lib/db';

// GET /api/notifications/preferences - Get user notification preferences
export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let preferences = await NotificationPreferences.findOne({ 
      userId: session.user.id 
    });

    if (!preferences) {
      preferences = await NotificationPreferences.create({ 
        userId: session.user.id 
      });
    }

    return NextResponse.json({ preferences });

  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/preferences - Update user notification preferences
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { preferences, dailyDigest, weeklyDigest, marketingEmails, quietHours, maxDailyNotifications, maxHourlyNotifications } = body;

    let userPreferences = await NotificationPreferences.findOne({ 
      userId: session.user.id 
    });

    if (!userPreferences) {
      userPreferences = new NotificationPreferences({ 
        userId: session.user.id 
      });
    }

    // Update preferences
    if (preferences) {
      userPreferences.preferences = { ...userPreferences.preferences, ...preferences };
    }

    if (typeof dailyDigest !== 'undefined') {
      userPreferences.dailyDigest = dailyDigest;
    }

    if (typeof weeklyDigest !== 'undefined') {
      userPreferences.weeklyDigest = weeklyDigest;
    }

    if (typeof marketingEmails !== 'undefined') {
      userPreferences.marketingEmails = marketingEmails;
    }

    if (quietHours) {
      userPreferences.quietHours = { ...userPreferences.quietHours, ...quietHours };
    }

    if (typeof maxDailyNotifications !== 'undefined') {
      userPreferences.maxDailyNotifications = maxDailyNotifications;
    }

    if (typeof maxHourlyNotifications !== 'undefined') {
      userPreferences.maxHourlyNotifications = maxHourlyNotifications;
    }

    await userPreferences.save();

    return NextResponse.json({ 
      success: true, 
      preferences: userPreferences 
    });

  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
