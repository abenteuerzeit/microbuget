// src/contexts/TransactionContext.tsx
"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Transaction } from '@/types/types';
import { generateDummyData } from '@/lib/utils';

type TransactionContextType = {
  transactions: Transaction[];
  updateTransaction: (updatedTransaction: Transaction) => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      const initialTransactions = generateDummyData(10, Date.now());
      setTransactions(initialTransactions);
      localStorage.setItem('transactions', JSON.stringify(initialTransactions));
    }
  }, []);

  const updateTransaction = (updatedTransaction: Transaction) => {
    const newTransactions = transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    setTransactions(newTransactions);
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
  };

  return (
    <TransactionContext.Provider value={{ transactions, updateTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};