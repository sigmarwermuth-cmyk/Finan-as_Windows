export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'paid' | 'pending';
export type AccountType = 'checking' | 'savings' | 'credit' | 'cash' | 'investment';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  account: string;
  date: string; // YYYY-MM-DD
  status: TransactionStatus;
  notes?: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  limit?: number; // for credit card
  closingDay?: number; // for credit card
  dueDay?: number; // for credit card
}

export interface CategoryBudget {
  id: string;
  category: string;
  allocatedAmount: number;
  color: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  color: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  pendingExpense: number;
  pendingIncome: number;
  savingsRate: number;
}
