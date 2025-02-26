// app/api/files/route.js (for App Router)
import { listFiles } from "@/lib/file-upload/api-client";

export async function GET() {
  try {
    const files = await listFiles();
    return Response.json(files);
  } catch (error: unknown) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}