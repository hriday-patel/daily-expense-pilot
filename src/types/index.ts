
export type ExpenseCategory = 
  | 'food'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'transport'
  | 'health'
  | 'others';

export type PaymentMode =
  | 'cash'
  | 'credit card'
  | 'debit card'
  | 'bank transfer'
  | 'mobile payment'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO string format
  paymentMode: PaymentMode;
  payeeName: string;
  notes?: string;
}

export interface ExpenseSummary {
  total: number;
  byCategory: Record<ExpenseCategory, number>;
  byPaymentMode: Record<PaymentMode, number>;
}
