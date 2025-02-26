import {
    createUploadthing,
    type FileRouter as UploadThingFileRouter,
  } from "uploadthing/next";
  import { getDocuments, getIndexFromStore } from "@/lib/ai-engine";
  
  const f = createUploadthing();
  
  const fileRouter: UploadThingFileRouter = {
    fileUploader: f({ pdf: { maxFileSize: "1GB", maxFileCount: 30 } })
      .onUploadComplete(async ({ file }) => {
        try {
          const documents = await getDocuments(file.url);
          const index = await getIndexFromStore();
  
          if (!index) {
            throw new Error("Failed to initialize index");
          }
  
          for (const document of documents) {
            await index.insert(document);
          }
  
          return { success: true, url: file.url };
        } catch (error) {
          console.error(error);
          return { success: false, message: "Failed to process file" };
        }
      }),
  };
  
  export type FileRouter = typeof fileRouter;
  export { fileRouter };
  