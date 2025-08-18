import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendOtpEmail } from '@/lib/email';
import { generateOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 min

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      hashedPassword,
      isActive: false,
      otp,
      otpExpires,
    });

    // Send OTP email
    await sendOtpEmail(email, otp);

    return NextResponse.json(
      { 
        message: 'OTP sent to email',
        userId: user._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
