"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  saveThemeToLocalStorage,
  applyTheme,
  loadThemeFromLocalStorage,
} from "../../../pages/api/utils/theme"; // Import the utility functions

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  // Function to handle theme change and save to localStorage
  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    saveThemeToLocalStorage(selectedTheme); // Save theme to localStorage using the utility function
    applyTheme(selectedTheme); // Apply the theme using the utility function
  };

  // Effect to set theme from localStorage if available
  React.useEffect(() => {
    const savedTheme = loadThemeFromLocalStorage(); // Load theme from localStorage using the utility function
    setTheme(savedTheme);
    applyTheme(savedTheme); // Apply the loaded theme
  }, [setTheme]);

  return (
    <div className="flex space-x-8 items-center pt-4">
      <div className="flex flex-col items-center justify-center">
        <Card
          className="w-56 h-36 bg-gray-300 hover:border hover:border-black"
          onClick={() => handleThemeChange("light")}
        >
          <CardContent className="p-0 flex justify-center items-center">
            <div className="flex flex-col space-y-3 items-center justify-center bg-white w-52 h-32">
              <Skeleton className="h-[50px] w-48 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div>Light</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Card
          className="w-56 h-36 bg-gray-300 hover:border hover:border-black"
          onClick={() => handleThemeChange("dark")}
        >
          <CardContent className="p-0 flex justify-center items-center">
            <div className="flex flex-col space-y-3 items-center justify-center bg-black w-52 h-32">
              <Skeleton className="h-[50px] w-48 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div>Dark</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Card
          className="w-60 h-36 bg-gray-300 hover:border hover:border-black"
          onClick={() => handleThemeChange("system")}
        >
          <CardContent className="p-0 flex justify-center items-center">
            <div className="flex flex-col space-y-3 items-center justify-center bg-white w-28 h-32">
              <Skeleton className="h-[50px] w-24 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex flex-col space-y-3 items-center justify-center bg-black w-28 h-32">
              <Skeleton className="h-[50px] w-24 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div>System Default</div>
      </div>
    </div>
  );
}
