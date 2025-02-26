"use client";

import { generateReactHelpers } from "@uploadthing/react";
import { FileRouter } from "@/lib/fileRouter";
import { useRef, useState } from "react";
import { LuUpload } from "react-icons/lu";

// Generate helper functions to manually upload files with the correct URL
const { uploadFiles } = generateReactHelpers<FileRouter>({
  url: "/api/upload"
});

export const UploadButton = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload function with proper progress calculation
  const uploadSelectedFiles = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    setIsUploading(true);
    setProgress(0);

    try {
      const res = await uploadFiles("fileUploader", {
        files: selectedFiles,
        onUploadProgress: (opts) => {
          // Make sure progress is correctly calculated as a percentage between 0-100
          const calculatedProgress = Math.round(opts.totalProgress);
          setProgress(calculatedProgress);
        },
      });
      console.log("Uploaded files:", res);
      setProgress(100);
      alert("Upload completed successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert(`ERROR! ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsUploading(false);
      // Only clear files after upload is complete
      setTimeout(() => {
        setFiles([]);
      }, 1000); // Short delay to show completion
    }
  };

  // Handle selecting files via input - auto-upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      uploadSelectedFiles(selectedFiles);
    }
  };

  // Handle drag-and-drop - auto-upload
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFiles = Array.from(e.dataTransfer.files);
      uploadSelectedFiles(selectedFiles);
      e.dataTransfer.clearData();
    }
  };

  // Allow dropping
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Drag-and-Drop Area */}
      <div
        className={`w-full text-gray-500 underline font-bold py-4 px-4 rounded-md shadow-md transition-colors border-dashed border-2 ${isUploading
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
          } focus:outline-none focus:ring focus:ring-gray-300 focus:border-gray-400 flex flex-col items-center justify-center`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <LuUpload className="inline-block mb-2" size={20} />
        {isUploading ? (
          <>
            <div>Uploading... {progress}%</div>
            <div className="text-blue-500">
              {files.map((file) => (
                <div key={file.name} className="text-sm">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              ))}
            </div>
          </>
        ) : files.length > 0 ? (
          files.map((file) => (
            <div key={file.name} className="text-sm">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          ))
        ) : (
          <span>Upload File Here!</span>
        )}
      </div>

      {/* Hidden File Input for Multiple Files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Progress Display shown inside the drop area now */}
    </div>
  );
};