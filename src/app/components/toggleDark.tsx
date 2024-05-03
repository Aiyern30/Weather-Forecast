"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <>
      <div className="flex space-x-8 items-center pt-4">
        <div className="flex flex-col items-center justify-center">
          <Card
            className="w-56 h-36 bg-gray-300 hover:border hover:border-black"
            onClick={() => setTheme("light")}
          >
            <CardContent className="p-0 flex justify-center items-center">
              <div className="flex flex-col space-y-3 items-center justify-center bg-white w-52 h-32 ">
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
            onClick={() => setTheme("dark")}
          >
            <CardContent className="p-0 flex justify-center items-center">
              <div className="flex flex-col space-y-3 items-center justify-center bg-black w-52 h-32 ">
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
            onClick={() => setTheme("system")}
          >
            <CardContent className="p-0 flex justify-center items-center">
              <div className="flex flex-col space-y-3 items-center justify-center bg-white w-28 h-32 ">
                <Skeleton className="h-[50px] w-24 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex flex-col space-y-3 items-center justify-center bg-black w-28 h-32 ">
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
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </>
  );
}
