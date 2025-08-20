import { NextResponse } from "next/server";
import UserApproval from "@/models/UserApproval";
import Admin from "@/models/Admin";
import connectDB from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const approval = await UserApproval.findById(id);
    
    if (!approval) {
      return NextResponse.json(
        { error: "Approval not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(approval);
  } catch (error) {
    console.error('Get approval error:', error);
    return NextResponse.json(
      { error: "Failed to fetch approval" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { action, reason, adminId = 'admin-123' } = await request.json();
    const { id } = await context.params;
    
    const approval = await UserApproval.findById(id);
    
    if (!approval) {
      return NextResponse.json(
        { error: "Approval not found" },
        { status: 404 }
      );
    }

    // Update approval status
    if (action === 'approve') {
      approval.status = 'approved';
    } else if (action === 'reject') {
      approval.status = 'rejected';
      approval.rejectionReason = reason;
    } else if (action === 'review') {
      approval.status = 'in_review';
    }

    approval.reviewedBy = adminId;
    approval.reviewedAt = new Date();
    approval.reviewNotes = reason;

    await approval.save();

    // Log admin activity
    try {
      const admin = await Admin.findById(adminId);
      if (admin) {
        await admin.logActivity(
          `${action}_approval`,
          'user_approval',
          approval._id,
          { 
            userId: approval.userId,
            submissionType: approval.submissionType,
            reason 
          }
        );
      }
    } catch (logError) {
      console.error('Failed to log admin activity:', logError);
    }

    return NextResponse.json({ success: true, approval });
  } catch (error) {
    console.error('Update approval error:', error);
    return NextResponse.json(
      { error: "Failed to update approval" },
      { status: 500 }
    );
  }
}
