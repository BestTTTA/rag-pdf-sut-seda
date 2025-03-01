import {
  createUploadthing,
  type FileRouter as UploadThingFileRouter,
} from "uploadthing/next";
import { getDocuments, getIndexFromStore } from "@/lib/ai-engine";

const f = createUploadthing();

// Global processing queue
interface QueueItem {
  fileUrl: string;
  fileName: string;
}

const processingQueue: QueueItem[] = [];
let isProcessing = false;

// Process the queue sequentially
const processQueue = async () => {
  if (isProcessing || processingQueue.length === 0) return;
  
  isProcessing = true;
  
  try {
    // Get the next item from the queue
    const { fileUrl, fileName } = processingQueue[0];
    console.log(`Starting to process ${fileName} (${processingQueue.length} files in queue)`);
    
    // Get index first, outside the file loop
    let index = null;
    let indexRetryCount = 0;
    const maxRetries = 5;
    
    while (!index && indexRetryCount < maxRetries) {
      try {
        console.log(`Getting index from store (attempt ${indexRetryCount + 1})`);
        index = await getIndexFromStore();
        if (!index) {
          throw new Error("Index is null");
        }
      } catch (err) {
        indexRetryCount++;
        console.error(`Failed to get index (attempt ${indexRetryCount}):`, err);
        // Wait longer between retries
        await new Promise(resolve => setTimeout(resolve, 2000 * indexRetryCount));
      }
    }
    
    if (!index) {
      throw new Error(`Failed to initialize index after ${maxRetries} retries`);
    }
    
    // Get documents from the file
    const documents = await getDocuments(fileUrl);
    console.log(`Extracted ${documents.length} documents from ${fileName}`);
    
    // Process documents one by one - SEQUENTIAL PROCESSING
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      let docRetryCount = 0;
      let docInserted = false;
      
      // Retry document insertion if it fails
      while (!docInserted && docRetryCount < 3) {
        try {
          await index.insert(document);
          docInserted = true;
          console.log(`Inserted document ${i + 1}/${documents.length} from ${fileName}`);
        } catch (err) {
          docRetryCount++;
          console.error(`Error inserting document ${i + 1} (attempt ${docRetryCount}):`, err);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!docInserted) {
        console.error(`Failed to insert document ${i + 1} after 3 attempts`);
      }
      
      // Add a small pause between documents
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Completed processing file: ${fileName}`);
  } catch (error) {
    console.error("Error processing file:", error);
  } finally {
    // Remove the processed item from the queue
    processingQueue.shift();
    isProcessing = false;
    
    // Process the next item in the queue
    setTimeout(processQueue, 500);
  }
};

const fileRouter: UploadThingFileRouter = {
  fileUploader: f({ pdf: { maxFileSize: "1GB", maxFileCount: 50 } })
    .middleware(({ files }) => {
      console.log(`Received ${files.length} files for upload`);
      return { uploadId: `upload-${Date.now()}` };
    })
    .onUploadComplete(async ({ file }) => {
      try {
        console.log(`File uploaded: ${file.name}`);
        
        // Add the file to the processing queue
        processingQueue.push({
          fileUrl: file.url,
          fileName: file.name
        });
        
        // Start processing the queue if it's not already running
        processQueue();
        
        return { 
          success: true, 
          message: "File added to processing queue", 
          url: file.url 
        };
      } catch (error) {
        console.error(`Error handling upload for ${file.name}:`, error);
        return { 
          success: false, 
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    }),
};

// Get queue status
export const getQueueStatus = () => {
  return {
    queueLength: processingQueue.length,
    isProcessing,
    currentFile: processingQueue.length > 0 ? processingQueue[0].fileName : null
  };
};

export type FileRouter = typeof fileRouter;
export { fileRouter };