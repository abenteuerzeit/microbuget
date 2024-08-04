// src/app/layout.tsx or src/app/page.tsx

import TransactionTable from "@/components/TransactionTable";

export default function TransactionsPage({ children }: { children: React.ReactNode }) {
  return (
    <TransactionTable />
  );
}
