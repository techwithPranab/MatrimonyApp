import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Revenue from "@/models/Revenue";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const revenueType = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: Record<string, unknown> = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (revenueType) {
      filter.revenueType = revenueType;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) (filter.createdAt as Record<string, unknown>)["$gte"] = new Date(startDate);
      if (endDate) (filter.createdAt as Record<string, unknown>)["$lte"] = new Date(endDate);
    }
    
    // Get revenue records
    const revenues = await Revenue.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count
    const total = await Revenue.countDocuments(filter);
    
    // Get summary statistics
    const summary = await Revenue.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$netAmount' },
          totalTransactions: { $sum: 1 },
          completedRevenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$netAmount', 0]
            }
          },
          pendingRevenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$netAmount', 0]
            }
          }
        }
      }
    ]);
    
    return NextResponse.json({
      revenues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: summary[0] || {
        totalRevenue: 0,
        totalTransactions: 0,
        completedRevenue: 0,
        pendingRevenue: 0
      }
    });

  } catch (error) {
    console.error("Revenue GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Calculate net amount (amount - tax - processing fee)
    const netAmount = body.amount - (body.taxAmount || 0) - (body.processingFee || 0);
    
    const revenue = await Revenue.create({
      ...body,
      netAmount,
      transactionId: body.transactionId || `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    });

    return NextResponse.json(revenue);

  } catch (error) {
    console.error("Revenue POST error:", error);
    return NextResponse.json(
      { error: "Failed to create revenue record" },
      { status: 500 }
    );
  }
}
