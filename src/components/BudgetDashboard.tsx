// src/components/BudgetDashboard.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import TransactionBarChart from './TransactionBarChart';
import TransactionPieChart from './TransactionPieChart';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/types";

const BudgetDashboard: React.FC = () => {
  const { transactions } = useTransactions();
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [timeRange, setTimeRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (timeRange !== 'all') {
      const now = new Date();
      const pastDate = new Date(now.setMonth(now.getMonth() - parseInt(timeRange)));
      filtered = filtered.filter(t => new Date(t.date) >= pastDate);
    }

    return filtered;
  }, [transactions, timeRange]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const categoryTransactions = selectedCategory
    ? filteredTransactions.filter(t => t.category === selectedCategory)
    : [];

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budget Dashboard</h1>
        <Select onValueChange={(value) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="1">Last month</SelectItem>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex justify-end mb-2">
            <Button 
              variant={chartType === 'bar' ? 'default' : 'outline'} 
              onClick={() => setChartType('bar')}
              className="mr-2"
            >
              Bar Chart
            </Button>
            <Button 
              variant={chartType === 'pie' ? 'default' : 'outline'} 
              onClick={() => setChartType('pie')}
            >
              Pie Chart
            </Button>
          </div>
          <div className="w-full overflow-x-auto">
            {chartType === 'bar' ? (
              <TransactionBarChart 
                transactions={filteredTransactions} 
                onCategorySelect={handleCategorySelect}
              />
            ) : (
              <TransactionPieChart 
                transactions={filteredTransactions}
                onCategorySelect={handleCategorySelect}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {selectedCategory && (
        <Card className="w-full mt-4">
          <CardHeader>
            <CardTitle>{selectedCategory} Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {categoryTransactions.map((transaction: Transaction) => (
                <li key={transaction.id} className="flex justify-between items-center">
                  <span>{transaction.description}</span>
                  <span className={Number(transaction.amount) >= 0 ? "text-green-600" : "text-red-600"}>
                    ${Math.abs(Number(transaction.amount)).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetDashboard;
