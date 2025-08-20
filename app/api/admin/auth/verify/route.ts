interface AdminTokenPayload {
  adminId: string;
  // add other fields if needed
}
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import connectDB from "@/lib/db";

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get('cookie');
    const adminToken = cookies?.split(';')
      .find(cookie => cookie.trim().startsWith('admin-token='))
      ?.split('=')[1];

    if (!adminToken) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET!) as AdminTokenPayload;
    
    // Optional: Check if admin still exists and is active
    await connectDB();
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: "Admin not found or inactive" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}
