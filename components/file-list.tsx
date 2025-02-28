"use client";

import { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import Link from "next/link";

export const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        if (!response.ok) throw new Error('Failed to fetch files');
        const data = await response.json();
        setFiles(data.files || []);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <div>กำลังโหลดไฟล์...</div>;

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto">
      <p className="text-center font-bold text-xl">เอกสาร</p>
      <div className="flex flex-col gap-2">
        {files.map((file) => (

          <Link 
            href={`https://utfs.io/f/${(file as { key: string }).key}`}
            key={(file as { key: string }).key}
            target="_blank"
            className="flex gap-2 border-2 border-red-400 bg-red-50 rounded-md p-2 cursor-pointer hover:bg-red-100 transition-colors"
          >
            <div>
            <FaFilePdf size={20} color="red"/>
            </div>
            {(file as { name: string }).name}
          </Link>
        ))}
      </div>
    </div>
  );
};