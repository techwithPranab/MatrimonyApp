import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Admin authentication middleware
async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { action } = await request.json();
    const { id: userId } = await params;

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updateData: Partial<{
      isSuspended: boolean;
      suspensionDate: Date | null;
      suspensionReason: string | null;
      verificationStatus: string;
      verifiedAt: Date;
      rejectedAt: Date;
      rejectionReason: string;
    }> = {};

    switch (action) {
      case 'suspend':
        updateData = {
          isSuspended: true,
          suspensionDate: new Date(),
          suspensionReason: 'Administrative action',
        };
        break;

      case 'unsuspend':
        updateData = {
          isSuspended: false,
          suspensionDate: null,
          suspensionReason: null,
        };
        break;

      case 'verify':
        updateData = {
          verificationStatus: 'verified',
          verifiedAt: new Date(),
        };
        break;

      case 'reject':
        updateData = {
          verificationStatus: 'rejected',
          rejectedAt: new Date(),
          rejectionReason: 'Administrative review',
        };
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    // Log the admin action for audit purposes
    console.log(`Admin action: ${action} performed on user ${userId} by admin ${(await getServerSession(authOptions))?.user?.email}`);

    return NextResponse.json({
      success: true,
      message: `User ${action} successful`,
      user: {
        _id: updatedUser._id.toString(),
        verificationStatus: updatedUser.verificationStatus,
        isSuspended: updatedUser.isSuspended,
      },
    });

  } catch (error) {
    console.error("Admin user action error:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 }
    );
  }
}
