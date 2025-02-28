// app/api/files/route.js (for App Router)
import { listFiles } from "@/lib/file-upload/api-client";

export async function GET() {
  try {
    const files = await listFiles();
    return Response.json(files);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
