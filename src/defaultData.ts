import { Account, CategoryBudget, FinancialGoal, Transaction } from './types';
import { v4 as uuidv4 } from 'uuid';

const getTodayString = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

const getMonthString = (monthsOffset = 0) => {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsOffset);
  return d.toISOString().substring(0, 7); // YYYY-MM
};

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'Nubank (Conta Corrente)',
    type: 'checking',
    balance: 4250.80,
    color: '#8A05BE',
  },
  {
    id: 'acc-2',
    name: 'Cartão Nubank (Roxinho)',
    type: 'credit',
    balance: -1420.50,
    color: '#530080',
    limit: 5000.00,
    closingDay: 20,
    dueDay: 27,
  },
  {
    id: 'acc-3',
    name: 'Banco Itaú',
    type: 'checking',
    balance: 8500.00,
    color: '#EC7000',
  },
  {
    id: 'acc-4',
    name: 'Carteira (Dinheiro)',
    type: 'cash',
    balance: 240.00,
    color: '#10B981',
  },
  {
    id: 'acc-5',
    name: 'XP Investimentos',
    type: 'investment',
    balance: 18500.00,
    color: '#F59E0B',
  },
];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { id: 'b-1', category: 'Alimentação', allocatedAmount: 1800, color: '#F97316' },
  { id: 'b-2', category: 'Moradia', allocatedAmount: 2500, color: '#3B82F6' },
  { id: 'b-3', category: 'Transporte', allocatedAmount: 600, color: '#10B981' },
  { id: 'b-4', category: 'Lazer & Cultura', allocatedAmount: 800, color: '#EC4899' },
  { id: 'b-5', category: 'Saúde & Cuidados', allocatedAmount: 500, color: '#8B5CF6' },
  { id: 'b-6', category: 'Assinaturas & Serviços', allocatedAmount: 300, color: '#6366F1' },
];

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'g-1',
    title: 'Reserva de Emergência',
    targetAmount: 20000,
    currentAmount: 14500,
    deadline: '2026-12-31',
    category: 'Investimentos',
    color: '#10B981',
  },
  {
    id: 'g-2',
    title: 'Viagem de Férias',
    targetAmount: 8000,
    currentAmount: 3200,
    deadline: '2027-02-15',
    category: 'Lazer',
    color: '#F59E0B',
  },
  {
    id: 'g-3',
    title: 'Novo Notebook Pro',
    targetAmount: 9500,
    currentAmount: 6800,
    deadline: '2026-11-30',
    category: 'Eletrônicos',
    color: '#3B82F6',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: uuidv4(),
    description: 'Salário Mensal',
    amount: 8500.00,
    type: 'income',
    category: 'Salário',
    account: 'Banco Itaú',
    date: getTodayString(-10),
    status: 'paid',
    notes: 'Depósito em conta Itaú',
  },
  {
    id: uuidv4(),
    description: 'Projeto Freelance UX/UI',
    amount: 2300.00,
    type: 'income',
    category: 'Freelance',
    account: 'Nubank (Conta Corrente)',
    date: getTodayString(-5),
    status: 'paid',
  },
  {
    id: uuidv4(),
    description: 'Aluguel do Apartamento',
    amount: 1950.00,
    type: 'expense',
    category: 'Moradia',
    account: 'Banco Itaú',
    date: getTodayString(-8),
    status: 'paid',
    notes: 'Transferência referente ao mês',
  },
  {
    id: uuidv4(),
    description: 'Supermercado Carrefour',
    amount: 642.30,
    type: 'expense',
    category: 'Alimentação',
    account: 'Cartão Nubank (Roxinho)',
    date: getTodayString(-4),
    status: 'paid',
  },
  {
    id: uuidv4(),
    description: 'Combustível Posto Shell',
    amount: 180.00,
    type: 'expense',
    category: 'Transporte',
    account: 'Cartão Nubank (Roxinho)',
    date: getTodayString(-3),
    status: 'paid',
  },
  {
    id: uuidv4(),
    description: 'Restaurante Fogo de Chão',
    amount: 245.00,
    type: 'expense',
    category: 'Lazer & Cultura',
    account: 'Cartão Nubank (Roxinho)',
    date: getTodayString(-2),
    status: 'paid',
  },
  {
    id: uuidv4(),
    description: 'Assinatura Netflix & Spotify',
    amount: 79.80,
    type: 'expense',
    category: 'Assinaturas & Serviços',
    account: 'Cartão Nubank (Roxinho)',
    date: getTodayString(-1),
    status: 'paid',
  },
  {
    id: uuidv4(),
    description: 'Conta de Energia (Enel)',
    amount: 165.40,
    type: 'expense',
    category: 'Moradia',
    account: 'Nubank (Conta Corrente)',
    date: getTodayString(3),
    status: 'pending',
    notes: 'Vencimento próximo',
  },
  {
    id: uuidv4(),
    description: 'Plano de Saúde Familiar',
    amount: 480.00,
    type: 'expense',
    category: 'Saúde & Cuidados',
    account: 'Banco Itaú',
    date: getTodayString(5),
    status: 'pending',
  },
  {
    id: uuidv4(),
    description: 'Aporte Mensal Tesouro Selic',
    amount: 1500.00,
    type: 'transfer',
    category: 'Investimentos',
    account: 'XP Investimentos',
    date: getTodayString(-6),
    status: 'paid',
    notes: 'Aporte para reserva de emergência',
  },
];
