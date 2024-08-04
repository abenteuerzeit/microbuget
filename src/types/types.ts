export interface ReceiptItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export interface Transaction {
    id: string;
    date: string;
    category: string;
    description: string;
    amount: string;
    method: string;
    status: string;
    receiptItems: ReceiptItem[];
}