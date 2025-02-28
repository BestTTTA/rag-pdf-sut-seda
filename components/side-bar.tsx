"use client"
import Chat from "./chat"
import { Files } from "./files"
import { useState, useEffect } from "react"
import { BiSolidArrowFromLeft } from "react-icons/bi";
import { BiSolidArrowFromRight } from "react-icons/bi";

export default function SideBar() {
  const [isFilesOpen, setIsFilesOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setIsFilesOpen(false);
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
      <div className="flex w-full h-full relative">
          {/* Sidebar - fixed on mobile, inline on desktop */}
          <div className={`transition-all duration-300 ${
              isMobile 
                ? 'fixed top-0 left-0 h-full z-20' 
                : 'relative'
            } ${
              isFilesOpen 
                ? 'w-80' 
                : 'w-0'
            } overflow-hidden`}
          >
              <div className="h-full w-80 bg-white">
                  <Files />
              </div>
              
              {isFilesOpen && (
                <button 
                    onClick={() => setIsFilesOpen(false)}
                    className="absolute top-4 right-2 p-1 rounded-full hover:bg-gray-300"
                    aria-label="Close sidebar"
                >
                    <BiSolidArrowFromRight size={30} className="dark:text-white"/>
                </button>
              )}
          </div>
          
          {/* Overlay for mobile */}
          {isMobile && isFilesOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-10"
              onClick={() => setIsFilesOpen(false)}
            />
          )}
          
          {/* Main content */}
          <div className="flex-1">
              {!isFilesOpen && (
                  <button 
                      onClick={() => setIsFilesOpen(true)}
                      className="absolute top-4 left-2 p-1 rounded-full hover:bg-gray-300 z-10 dark:text-white"
                      aria-label="Open sidebar"
                  >
                      <BiSolidArrowFromLeft size={30} />
                  </button>
              )}
              <div className="w-full h-full">
                  <Chat />
              </div>
          </div>
      </div>
  )
}