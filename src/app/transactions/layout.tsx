// src/app/transactions/layout.tsx
import { ReactNode } from "react";
import TransactionTable from "@/components/TransactionTable";

export default function TransactionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        {children}
      </div>
    </div>
  );
}
