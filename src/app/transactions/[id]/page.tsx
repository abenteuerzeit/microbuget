// src/app/transactions/[transactionId]/page.tsx
import TransactionDetails from "@/components/TransactionDetails";

export default function TransactionDetailPage({ params }: { params: { transactionId: string } }) {
  return <TransactionDetails transactionId={params.transactionId} />;
}
