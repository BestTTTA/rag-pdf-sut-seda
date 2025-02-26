import { createRouteHandler } from "uploadthing/next";
import { fileRouter } from "@/lib/fileRouter"; // adjust the path if needed

export const { GET, POST } = createRouteHandler({
  router: fileRouter,
});
