
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Expense, ExpenseSummary, ExpenseCategory, PaymentMode } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Get formatted date string from ISO date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Save expenses to local storage
export function saveExpensesToLocalStorage(expenses: Expense[]): void {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Load expenses from local storage
export function loadExpensesFromLocalStorage(): Expense[] {
  const expenses = localStorage.getItem('expenses');
  return expenses ? JSON.parse(expenses) : [];
}

// Calculate expense summary
export function calculateExpenseSummary(expenses: Expense[]): ExpenseSummary {
  const summary: ExpenseSummary = {
    total: 0,
    byCategory: {
      food: 0,
      shopping: 0,
      bills: 0,
      entertainment: 0,
      transport: 0,
      health: 0,
      others: 0
    },
    byPaymentMode: {
      cash: 0,
      'credit card': 0,
      'debit card': 0,
      'bank transfer': 0,
      'mobile payment': 0,
      other: 0
    }
  };

  expenses.forEach((expense) => {
    summary.total += expense.amount;
    summary.byCategory[expense.category] += expense.amount;
    summary.byPaymentMode[expense.paymentMode] += expense.amount;
  });

  return summary;
}

// Get color for category
export function getCategoryColor(category: ExpenseCategory): string {
  const colors: Record<ExpenseCategory, string> = {
    food: '#4CAF50',
    shopping: '#2196F3',
    bills: '#FF9800',
    entertainment: '#9C27B0',
    transport: '#F44336',
    health: '#E91E63',
    others: '#607D8B'
  };
  
  return colors[category];
}

// Get a human-readable category name
export function getCategoryName(category: ExpenseCategory): string {
  const names: Record<ExpenseCategory, string> = {
    food: 'Food & Dining',
    shopping: 'Shopping',
    bills: 'Bills & Utilities',
    entertainment: 'Entertainment',
    transport: 'Transportation',
    health: 'Healthcare',
    others: 'Others'
  };
  
  return names[category];
}

// Get a human-readable payment mode
export function getPaymentModeName(paymentMode: PaymentMode): string {
  const names: Record<PaymentMode, string> = {
    cash: 'Cash',
    'credit card': 'Credit Card',
    'debit card': 'Debit Card',
    'bank transfer': 'Bank Transfer',
    'mobile payment': 'Mobile Payment',
    'other': 'Other'
  };
  
  return names[paymentMode];
}

// Get all categories
export const allExpenseCategories: ExpenseCategory[] = [
  'food', 'shopping', 'bills', 'entertainment', 'transport', 'health', 'others'
];

// Get all payment modes
export const allPaymentModes: PaymentMode[] = [
  'cash', 'credit card', 'debit card', 'bank transfer', 'mobile payment', 'other'
];
