// src/app/transactions/layout.tsx
import { ReactNode } from "react";

export default function TransactionLayout({
  children,
}: Readonly<{
    children: ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        {children}
      </div>
    </div>
  );
}
