import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

// Mock data for demo - in production this would come from database
const mockSubscriptions = [
  {
    id: 'sub_1',
    userId: 'user_1',
    userEmail: 'john.doe@example.com',
    userName: 'John Doe',
    plan: 'premium',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    amount: 299,
    currency: 'USD',
    stripeCustomerId: 'cus_1',
    stripeSubscriptionId: 'sub_stripe_1',
    autoRenew: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sub_2',
    userId: 'user_2',
    userEmail: 'jane.smith@example.com',
    userName: 'Jane Smith',
    plan: 'basic',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    amount: 99,
    currency: 'USD',
    stripeCustomerId: 'cus_2',
    stripeSubscriptionId: 'sub_stripe_2',
    autoRenew: false,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'sub_3',
    userId: 'user_3',
    userEmail: 'mike.wilson@example.com',
    userName: 'Mike Wilson',
    plan: 'elite',
    status: 'trial',
    startDate: '2024-08-01',
    endDate: '2024-08-15',
    amount: 499,
    currency: 'USD',
    autoRenew: true,
    createdAt: '2024-08-01T00:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // In production, fetch from database:
    // const subscriptions = await Subscription.find()
    //   .populate('userId', 'email name')
    //   .sort({ createdAt: -1 });
    
    // For demo, return mock data
    return NextResponse.json(mockSubscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
