import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Microbudget",
  description: "Micromanage your personal finance. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={""}>{children}</body>
    </html>
  );
}
