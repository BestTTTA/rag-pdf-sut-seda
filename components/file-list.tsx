"use client";

import { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import Link from "next/link";

export const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredFiles = files.filter((file) => 
    (file as { name: string }).name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>กำลังโหลดไฟล์...</div>;

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto">
      <p className="text-center font-bold text-xl">เอกสาร</p>
      <input
        type="text"
        placeholder="ค้นหาหลักสูตร..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border-2 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:border-red-400 dark:focus:border-gray-400"
      />
      <div className="flex flex-col gap-2">
        {filteredFiles.map((file) => (
          <Link 
            href={`https://utfs.io/f/${(file as { key: string }).key}`}
            key={(file as { key: string }).key}
            target="_blank"
            className="flex gap-2 border-2 dark:bg-gray-800 dark:border-white border-red-400 bg-red-50 rounded-md p-2 cursor-pointer hover:bg-red-100 transition-colors dark:text-white dark:hover:bg-gray-700"
          >
            <div>
              <FaFilePdf size={20} className="dark:text-white text-red-500"/>
            </div>
            {(file as { name: string }).name}
          </Link>
        ))}
      </div>
    </div>
  );
};