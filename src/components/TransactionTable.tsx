// src/components/transaction-table.tsx
"use client";
import { useState } from "react";
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

function EditTransactionForm({
  transaction,
  onUpdate,
}: {
  transaction: Transaction;
  onUpdate: (t: Transaction) => void;
}) {
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditedTransaction({
      ...editedTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedTransaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date">Date</label>
        <Input
          type="date"
          id="date"
          name="date"
          value={editedTransaction.date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <Input
          id="category"
          name="category"
          value={editedTransaction.category}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <Input
          id="description"
          name="description"
          value={editedTransaction.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="method">Method</label>
        <Input
          id="method"
          name="method"
          value={editedTransaction.method}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={editedTransaction.status}
          onChange={handleChange}
        >
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <Button type="submit">Update Transaction</Button>
    </form>
  );
}

export default function TransactionTable() {
  const { transactions, updateTransaction } = useTransactions();
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Transaction | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const handleSort = (column: keyof Transaction) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedTransactions = transactions
    .filter(
      (t) =>
        Object.values(t).some((value) =>
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
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
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
            {[
              "id",
              "date",
              "category",
              "description",
              "amount",
              "method",
              "status",
            ].map((column) => (
              <TableHead
                key={column}
                onClick={() => handleSort(column as keyof Transaction)}
                className="cursor-pointer"
              >
                {column.charAt(0).toUpperCase() + column.slice(1)}
                {sortColumn === column &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
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
              <TableCell
                className={
                  Number(transaction.amount) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ${Math.abs(Number(transaction.amount))}
              </TableCell>
              <TableCell>{transaction.method}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    transaction.status === "Completed"
                      ? "default"
                      : transaction.status === "Pending"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
