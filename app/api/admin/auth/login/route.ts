import { NextResponse } from "next/server";
// ...existing code...
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import connectDB from "@/lib/db";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password, twoFactorCode } = await request.json();

    // Find admin user
    const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true });
    
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check 2FA if enabled
    if (admin.twoFactorEnabled) {
      if (!twoFactorCode) {
        return NextResponse.json(
          { error: "Two-factor authentication code required" },
          { status: 401 }
        );
      }
      
      // Verify 2FA code (implement your 2FA logic here)
      // const isValid2FA = verifyTwoFactorCode(admin.twoFactorSecret, twoFactorCode);
      // if (!isValid2FA) {
      //   return NextResponse.json({ error: "Invalid 2FA code" }, { status: 401 });
      // }
    }

    // Update login history
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    admin.loginHistory.push({
      timestamp: new Date(),
      ipAddress: clientIP,
      userAgent,
      location: 'Unknown', // You can integrate with IP geolocation service
    });
    
    admin.lastLoginAt = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        permissions: admin.permissions,
      }
    });

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
