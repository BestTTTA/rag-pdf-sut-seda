"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { BiSun, BiMoon } from "react-icons/bi";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <BiSun className="h-5 w-5 text-yellow-500" />
      ) : (
        <BiMoon className="h-5 w-5 text-gray-700" />
      )}
    </Button>
  );
};