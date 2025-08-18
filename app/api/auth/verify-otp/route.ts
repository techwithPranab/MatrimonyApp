import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP required' }, { status: 400 });
    }
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (user.isActive) {
      return NextResponse.json({ message: 'User already activated' }, { status: 400 });
    }
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }
    user.isActive = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return NextResponse.json({ message: 'Account activated' });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
