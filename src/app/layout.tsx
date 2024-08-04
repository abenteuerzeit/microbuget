// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { TransactionProvider } from '@/contexts/TransactionContext';
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Microbudget",
  description: "Micromanage your personal finance.",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <TransactionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <Navbar />
            <main className="p-8">
              {children}
            </main>
          </ThemeProvider>
        </TransactionProvider>
      </body>
    </html>
  );
}
