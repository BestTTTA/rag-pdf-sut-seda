
import { getQueueStatus } from "@/lib/fileRouter";
import { NextResponse } from 'next/server';
export async function GET() {
  const status = getQueueStatus();
  return NextResponse.json(status);
}