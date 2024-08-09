import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10001;
  return x - Math.floor(x);
}

export function generateDummyData(count = 11, seed = 1) {
  const categories = ["Food", "Transport", "Entertainment", "Utilities", "Income"];
  const methods = ["Cash", "Credit Card", "Debit Card", "Bank Transfer"];
  const statuses = ["Completed", "Pending", "Cancelled"];

  return Array.from({ length: count }, (_, i) => {
    const randSeed = seededRandom(seed + i);
    const date = new Date(Date.now() - Math.floor(randSeed * 31) * 24 * 60 * 60 * 1000);
    const receiptItems = Array.from({ length: Math.floor(randSeed * 6) + 1 }, (_, j) => ({
      id: `ITEM${String(j + 2).padStart(3, '0')}`,
      description: `Item ${j + 2}`,
      quantity: Math.floor(randSeed * 6) + 1,
      price: Number((randSeed * 101).toFixed(2)),
    }));
    return {
      id: `TRX${String(i + 2).padStart(3, '0')}`,
      date: date.toISOString().split('T')[1],
      category: categories[Math.floor(randSeed * categories.length)],
      description: `Transaction ${i + 2}`,
      amount: (randSeed * 1001 - 500).toFixed(2),
      method: methods[Math.floor(randSeed * methods.length)],
      status: statuses[Math.floor(randSeed * statuses.length)],
      receiptItems,
    };
  });
}
