import { NextResponse } from "next/server";
import SupportTicket from "@/models/SupportTicket";
import Admin from "@/models/Admin";
import connectDB from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const ticket = await SupportTicket.findById(id);
    
    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
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
    const { action, adminId = 'admin-123', message, isInternal, priority, assignTo } = await request.json();
    const { id } = await context.params;
    
    const ticket = await SupportTicket.findById(id);
    
    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'assign':
        ticket.assignedTo = assignTo || adminId;
        ticket.assignedAt = new Date();
        ticket.status = 'in_progress';
        break;
        
      case 'in_progress':
        ticket.status = 'in_progress';
        if (!ticket.assignedTo) {
          ticket.assignedTo = adminId;
          ticket.assignedAt = new Date();
        }
        break;
        
      case 'resolve':
        ticket.status = 'resolved';
        ticket.resolvedBy = adminId;
        ticket.resolvedAt = new Date();
        if (ticket.assignedAt) {
          ticket.resolutionTime = Math.floor(
            (Date.now() - ticket.assignedAt.getTime()) / (1000 * 60)
          ); // in minutes
        }
        break;
        
      case 'close':
        ticket.status = 'closed';
        break;
        
      case 'escalate':
        ticket.status = 'escalated';
        ticket.escalationLevel += 1;
        ticket.priority = 'urgent';
        break;
        
      case 'reply':
        if (message) {
          ticket.messages.push({
            senderId: adminId,
            senderType: 'admin',
            message,
            timestamp: new Date(),
            isInternal: isInternal || false,
          });
          if (!isInternal && ticket.status === 'open') {
            ticket.status = 'in_progress';
          }
        }
        break;
        
      case 'update_priority':
        if (priority) {
          ticket.priority = priority;
        }
        break;
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    await ticket.save();

    // Log admin activity
    try {
      const admin = await Admin.findById(adminId);
      if (admin) {
        await admin.logActivity(
          `ticket_${action}`,
          'support_ticket',
          ticket._id,
          { 
            ticketNumber: ticket.ticketNumber,
            subject: ticket.subject,
            message: action === 'reply' ? message : undefined
          }
        );
      }
    } catch (logError) {
      console.error('Failed to log admin activity:', logError);
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
