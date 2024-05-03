"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";
import { Sidebar } from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClientProvider } from "react-query";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [queryClient, setQueryClient] = useState(null);

  useEffect(() => {
    const { QueryClient, QueryClientProvider } = require("react-query");
    const client = new QueryClient();
    setQueryClient(client);

    return () => {
      client.clear();
    };
  }, []);

  return (
    <html lang="en">
      <body className="flex gap-[25px] p-[25px]">
        {queryClient && (
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
              <Sidebar />
              <div className="bg-[rgb(246,246,248)] w-full rounded-xl p-[30px] overflow-auto min-w-[1600px]">
                {children}
              </div>
            </QueryClientProvider>
          </ThemeProvider>
        )}
      </body>
    </html>
  );
};

export default RootLayout;
