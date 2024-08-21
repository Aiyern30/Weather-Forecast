"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";
import { Sidebar } from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "react-query";
import { LoginProvider } from "./LoginContext";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [queryClient, setQueryClient] = useState<QueryClient | null>(null);

  useEffect(() => {
    const client = new QueryClient();
    setQueryClient(client);

    return () => {
      client.clear();
    };
  }, []);

  if (!queryClient) return <div>Loading...</div>;

  return (
    <html lang="en">
      <body className="flex gap-[25px] p-[25px] dark:bg-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <LoginProvider>
              <Sidebar />
              <div className="bg-[rgb(246,246,248)] w-full rounded-xl p-[30px] overflow-auto min-w-[1600px] dark:bg-slate-800">
                {children}
              </div>
            </LoginProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
