import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Revenue from "@/models/Revenue";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const revenue = await Revenue.findById(id);
    if (!revenue) {
      return NextResponse.json(
        { error: "Revenue record not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(revenue);
  } catch (error) {
    console.error("Revenue GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue record" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await context.params;
    // Recalculate net amount if amount, tax, or fee changed
    if (body.amount !== undefined || body.taxAmount !== undefined || body.processingFee !== undefined) {
      const currentRevenue = await Revenue.findById(id);
      if (currentRevenue) {
        const amount = body.amount !== undefined ? body.amount : currentRevenue.amount;
        const taxAmount = body.taxAmount !== undefined ? body.taxAmount : currentRevenue.taxAmount;
        const processingFee = body.processingFee !== undefined ? body.processingFee : currentRevenue.processingFee;
        body.netAmount = amount - taxAmount - processingFee;
      }
    }
    const revenue = await Revenue.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    if (!revenue) {
      return NextResponse.json(
        { error: "Revenue record not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(revenue);
  } catch (error) {
    console.error("Revenue PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update revenue record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const revenue = await Revenue.findByIdAndDelete(id);
    if (!revenue) {
      return NextResponse.json(
        { error: "Revenue record not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Revenue record deleted successfully" });
  } catch (error) {
    console.error("Revenue DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete revenue record" },
      { status: 500 }
    );
  }
}
