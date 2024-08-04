"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Transaction, ReceiptItem } from '@/types/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTransactions } from '@/contexts/TransactionContext';
import { toast } from "sonner";

type TransactionDetailsProps = {
  transactionId: string;
};

export default function TransactionDetails({ transactionId }: TransactionDetailsProps) {
  const params = useParams();
  const router = useRouter();
  const { transactions, updateTransaction } = useTransactions();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const foundTransaction = transactions.find(t => t.id === params.id);
    if (foundTransaction) setTransaction(foundTransaction);
  }, [params.id, transactions]);

  const updateReceiptItem = (updatedItem: ReceiptItem) => {
    if (!transaction) return;
    const updatedItems = transaction.receiptItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    const updatedTransaction = {
      ...transaction,
      receiptItems: updatedItems,
      amount: calculateTotalAmount(updatedItems)
    };
    setTransaction(updatedTransaction);
  };

  const addReceiptItem = () => {
    if (!transaction) return;
    const newItem: ReceiptItem = {
      id: `ITEM${String(transaction.receiptItems.length + 1).padStart(3, '0')}`,
      description: '',
      quantity: 1,
      price: 0,
    };
    const updatedItems = [...transaction.receiptItems, newItem];
    const updatedTransaction = {
      ...transaction,
      receiptItems: updatedItems,
      amount: calculateTotalAmount(updatedItems)
    };
    setTransaction(updatedTransaction);
  };

  const deleteReceiptItem = (itemId: string) => {
    if (!transaction) return;
    const updatedItems = transaction.receiptItems.filter(item => item.id !== itemId);
    const updatedTransaction = {
      ...transaction,
      receiptItems: updatedItems,
      amount: calculateTotalAmount(updatedItems)
    };
    setTransaction(updatedTransaction);
  };

  const calculateTotalAmount = (items: ReceiptItem[]): string => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
  };

  const saveTransaction = () => {
    if (transaction) {
      try {
        updateTransaction(transaction);
        toast.success("Transaction updated successfully.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update transaction.");
      }
    }
  };

  const currentIndex = transactions.findIndex(t => t.id === params.id);
  const previousTransaction = currentIndex > 0 ? transactions[currentIndex - 1] : null;
  const nextTransaction = currentIndex < transactions.length - 1 ? transactions[currentIndex + 1] : null;

  const handleBackClick = () => {
    if (previousTransaction) {
      router.push(`/transactions/${previousTransaction.id}`);
    }
  };

  const handleNextClick = () => {
    if (nextTransaction) {
      router.push(`/transactions/${nextTransaction.id}`);
    }
  };

  if (!transaction) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-background dark:bg-background-dark shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark">Transaction Details</h1>
        <Button 
          onClick={saveTransaction} 
          className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Save Transaction
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div><strong>ID:</strong> {transaction.id}</div>
        <div><strong>Date:</strong> {transaction.date}</div>
        <div><strong>Category:</strong> {transaction.category}</div>
        <div><strong>Description:</strong> {transaction.description}</div>
        <div><strong>Amount:</strong> ${transaction.amount}</div>
        <div><strong>Method:</strong> {transaction.method}</div>
        <div><strong>Status:</strong> {transaction.status}</div>
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-foreground dark:text-foreground-dark">Receipt Items</h2>
      <Button 
        onClick={addReceiptItem} 
        className="mb-4 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
      >
        Add Item
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaction.receiptItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Input
                  value={item.description}
                  onChange={(e) => updateReceiptItem({ ...item, description: e.target.value })}
                  placeholder="Item description"
                  className="dark:bg-input-dark"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateReceiptItem({ ...item, quantity: Number(e.target.value) })}
                  placeholder="Quantity"
                  className="dark:bg-input-dark"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateReceiptItem({ ...item, price: Number(e.target.value) })}
                  placeholder="Price"
                  className="dark:bg-input-dark"
                />
              </TableCell>
              <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
              <TableCell>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteReceiptItem(item.id)}
                  className="dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-6">
        <Button 
          onClick={handleBackClick} 
          disabled={!previousTransaction} 
          variant="outline"
          className="dark:text-foreground-dark dark:border-foreground-dark dark:hover:bg-background-dark"
        >
          Back
        </Button>
        <Button 
          onClick={handleNextClick} 
          disabled={!nextTransaction} 
          variant="outline"
          className="dark:text-foreground-dark dark:border-foreground-dark dark:hover:bg-background-dark"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
