import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { LoginProvider } from "./LoginContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Forecast",
  description: "Created by Ian Gan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex gap-[25px] p-[25px] dark:bg-[#0F0F0F]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoginProvider>
            <Sidebar />
            <div className="bg-[rgb(246,246,248)] w-full rounded-xl p-[30px] overflow-auto h-[100vh] dark:bg-[#1E1E1E]">
              {children}
            </div>
          </LoginProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
