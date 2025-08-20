import { NextResponse } from "next/server";
import { getPlansFromModel } from "./model";

export async function GET() {
  const plans = await getPlansFromModel();
  return NextResponse.json(plans);
}
