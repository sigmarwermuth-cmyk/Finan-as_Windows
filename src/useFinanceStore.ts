import { useState, useEffect, useMemo } from 'react';
import { Account, CategoryBudget, FinancialGoal, FinancialSummary, Transaction } from './types';
import { INITIAL_ACCOUNTS, INITIAL_BUDGETS, INITIAL_GOALS, INITIAL_TRANSACTIONS } from './defaultData';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  TRANSACTIONS: 'financas_pro_transactions_v2',
  ACCOUNTS: 'financas_pro_accounts_v2',
  BUDGETS: 'financas_pro_budgets_v2',
  GOALS: 'financas_pro_goals_v2',
};

export function useFinanceStore() {
  // 1. Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // 2. Accounts
  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return stored ? JSON.parse(stored) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  // 3. Budgets
  const [budgets, setBudgets] = useState<CategoryBudget[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return stored ? JSON.parse(stored) : INITIAL_BUDGETS;
    } catch {
      return INITIAL_BUDGETS;
    }
  });

  // 4. Goals
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
      return stored ? JSON.parse(stored) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  // 5. Selected Month Filter (e.g., 'all' or '2026-09')
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const current = new Date().toISOString().substring(0, 7);
    return current;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  // Actions: Transactions
  const addTransaction = (tData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...tData,
      id: uuidv4(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Update account balance
    if (tData.status === 'paid') {
      setAccounts((prevAccs) =>
        prevAccs.map((acc) => {
          if (acc.name === tData.account) {
            const delta = tData.type === 'income' ? tData.amount : -tData.amount;
            return { ...acc, balance: acc.balance + delta };
          }
          return acc;
        })
      );
    }
  };

  const removeTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (target && target.status === 'paid') {
      // Revert account balance
      setAccounts((prevAccs) =>
        prevAccs.map((acc) => {
          if (acc.name === target.account) {
            const delta = target.type === 'income' ? -target.amount : target.amount;
            return { ...acc, balance: acc.balance + delta };
          }
          return acc;
        })
      );
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    const oldTransaction = transactions.find((t) => t.id === updatedTransaction.id);
    if (!oldTransaction) return;

    setAccounts((prevAccs) => {
      let nextAccs = [...prevAccs];
      // Revert old transaction effect if old status was 'paid'
      if (oldTransaction.status === 'paid') {
        nextAccs = nextAccs.map((acc) => {
          if (acc.name === oldTransaction.account) {
            const revertDelta = oldTransaction.type === 'income' ? -oldTransaction.amount : oldTransaction.amount;
            return { ...acc, balance: acc.balance + revertDelta };
          }
          return acc;
        });
      }

      // Apply new transaction effect if new status is 'paid'
      if (updatedTransaction.status === 'paid') {
        nextAccs = nextAccs.map((acc) => {
          if (acc.name === updatedTransaction.account) {
            const applyDelta = updatedTransaction.type === 'income' ? updatedTransaction.amount : -updatedTransaction.amount;
            return { ...acc, balance: acc.balance + applyDelta };
          }
          return acc;
        });
      }

      return nextAccs;
    });

    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const toggleTransactionStatus = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'paid' ? 'pending' : 'paid';
          // Adjust balance
          const delta = newStatus === 'paid' ? (t.type === 'income' ? t.amount : -t.amount) : (t.type === 'income' ? -t.amount : t.amount);
          setAccounts((prevAccs) =>
            prevAccs.map((acc) => {
              if (acc.name === t.account) {
                return { ...acc, balance: acc.balance + delta };
              }
              return acc;
            })
          );
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  // Actions: Accounts
  const addAccount = (accData: Omit<Account, 'id'>) => {
    const newAcc: Account = {
      ...accData,
      id: uuidv4(),
    };
    setAccounts((prev) => [...prev, newAcc]);
  };

  const updateAccount = (updatedAcc: Account) => {
    const oldAcc = accounts.find((a) => a.id === updatedAcc.id);
    if (oldAcc && oldAcc.name !== updatedAcc.name) {
      setTransactions((prev) =>
        prev.map((t) => (t.account === oldAcc.name ? { ...t, account: updatedAcc.name } : t))
      );
    }
    setAccounts((prev) => prev.map((a) => (a.id === updatedAcc.id ? updatedAcc : a)));
  };

  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // Actions: Goals
  const addGoal = (goalData: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: uuidv4(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const addContributionToGoal = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Actions: Budgets
  const updateBudget = (category: string, allocatedAmount: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, allocatedAmount } : b))
    );
  };

  const addBudget = (category: string, allocatedAmount: number, color: string) => {
    setBudgets((prev) => [...prev, { id: uuidv4(), category, allocatedAmount, color }]);
  };

  // Reset & Import
  const resetToSampleData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setAccounts(INITIAL_ACCOUNTS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
  };

  const clearAllData = () => {
    setTransactions([]);
    setAccounts([]);
    setBudgets([]);
    setGoals([]);
  };

  // Filtered Transactions by selected month
  const filteredTransactions = useMemo(() => {
    if (selectedMonth === 'all') return transactions;
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Overall Financial Summary
  const summary = useMemo<FinancialSummary>(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let pendingExpense = 0;
    let pendingIncome = 0;

    filteredTransactions.forEach((t) => {
      if (t.type === 'income') {
        if (t.status === 'paid') totalIncome += t.amount;
        else pendingIncome += t.amount;
      } else if (t.type === 'expense') {
        if (t.status === 'paid') totalExpense += t.amount;
        else pendingExpense += t.amount;
      }
    });

    const totalNetBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalNetBalance,
      pendingExpense,
      pendingIncome,
      savingsRate,
    };
  }, [filteredTransactions, accounts]);

  // Category Expense Breakdown
  const categoryExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.type === 'expense' && t.status === 'paid')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.entries(map).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [filteredTransactions]);

  // Available Months for dropdown
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    const current = new Date().toISOString().substring(0, 7);
    set.add(current);
    transactions.forEach((t) => {
      if (t.date && t.date.length >= 7) {
        set.add(t.date.substring(0, 7));
      }
    });
    return Array.from(set).sort().reverse();
  }, [transactions]);

  return {
    transactions,
    filteredTransactions,
    accounts,
    budgets,
    goals,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    summary,
    categoryExpenses,
    addTransaction,
    updateTransaction,
    removeTransaction,
    toggleTransactionStatus,
    addAccount,
    updateAccount,
    removeAccount,
    addGoal,
    addContributionToGoal,
    removeGoal,
    updateBudget,
    addBudget,
    resetToSampleData,
    clearAllData,
  };
}
