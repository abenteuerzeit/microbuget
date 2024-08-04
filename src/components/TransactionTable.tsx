// src/components/transaction-table.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useTransactions } from "@/contexts/TransactionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/types";

// Define possible variant values
type BadgeVariant = "default" | "outline" | "destructive" | "secondary";

// Define the status options and their corresponding variants
const variantMap: Record<"Completed" | "Pending" | "Cancelled", BadgeVariant> = {
  Completed: "default",
  Pending: "outline",
  Cancelled: "destructive",
};

// Function to get the variant based on status
function getVariant(status: string): BadgeVariant | "destructive" {
  return variantMap[status as keyof typeof variantMap] || "destructive";
}

// EditTransactionForm component with read-only props
function EditTransactionForm({
                               transaction,
                               onUpdate,
                             }: Readonly<{
  transaction: Transaction;
  onUpdate: (t: Transaction) => void;
}>) {
  const [editedTransaction, setEditedTransaction] = useState<Transaction>(transaction);

  const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdate(editedTransaction);
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {["date", "category", "description", "method"].map((field) => (
            <div key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <Input
                  id={field}
                  name={field}
                  type={field === "date" ? "date" : "text"}
                  value={(editedTransaction as any)[field]}
                  onChange={handleChange}
              />
            </div>
        ))}
        <div>
          <label htmlFor="status">Status</label>
          <select
              id="status"
              name="status"
              value={editedTransaction.status}
              onChange={handleChange}
          >
            {["Completed", "Pending", "Cancelled"].map((status) => (
                <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <Button type="submit">Update Transaction</Button>
      </form>
  );
}

// Main component
export default function TransactionTable() {
  const { transactions, updateTransaction } = useTransactions();
  const [filter, setFilter] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<keyof Transaction | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleSort = (column: keyof Transaction) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedTransactions = transactions
      .filter((t) =>
          [t.date, t.category, t.description, t.method].some((value) =>
              value.toString().toLowerCase().includes(filter.toLowerCase())
          ) ||
          t.receiptItems.some((item) =>
              Object.values(item).some((value) =>
                  value.toString().toLowerCase().includes(filter.toLowerCase())
              )
          )
      )
      .sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

  return (
      <div>
        <div className="flex justify-between mb-4">
          <Input
              placeholder="Filter transactions..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
          />
        </div>
        <Table>
          <TableCaption>Your recent transactions</TableCaption>
          <TableHeader>
            <TableRow>
              {["id", "date", "category", "description", "amount", "method", "status"].map((column) => (
                  <TableHead
                      key={column}
                      onClick={() => handleSort(column as keyof Transaction)}
                      className="cursor-pointer"
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                    {sortColumn === column && (sortDirection === "asc" ? " ↑" : " ↓")}
                  </TableHead>
              ))}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Link
                        href={`/transactions/${transaction.id}`}
                        className="text-blue-600 hover:underline"
                    >
                      {transaction.id}
                    </Link>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={Number(transaction.amount) >= 0 ? "text-green-600" : "text-red-600"}>
                    ${Math.abs(Number(transaction.amount))}
                  </TableCell>
                  <TableCell>{transaction.method}</TableCell>
                  <TableCell>
                    <Badge variant={getVariant(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTransaction(transaction)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Transaction</DialogTitle>
                        </DialogHeader>
                        {editingTransaction && (
                            <EditTransactionForm
                                transaction={editingTransaction}
                                onUpdate={(updatedTransaction) => {
                                  updateTransaction(updatedTransaction);
                                  setIsDialogOpen(false);
                                }}
                            />
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
}
