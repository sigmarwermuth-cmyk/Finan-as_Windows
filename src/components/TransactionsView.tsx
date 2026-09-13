import React, { useState } from 'react';
import { Account, Transaction, TransactionType } from '../types';
import { Plus, Search, Filter, Trash2, CheckCircle, Clock, ArrowUpRight, ArrowDownRight, ArrowLeftRight, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onRemoveTransaction: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  accounts,
  onAddTransaction,
  onRemoveTransaction,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState(accounts[0]?.name || 'Banco Nubank');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'paid' | 'pending'>('paid');
  const [notes, setNotes] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Categories list derived from current transactions + defaults
  const categoriesList = Array.from(
    new Set([
      'Alimentação',
      'Moradia',
      'Transporte',
      'Salário',
      'Freelance',
      'Lazer & Cultura',
      'Saúde & Cuidados',
      'Assinaturas & Serviços',
      'Investimentos',
      ...transactions.map((t) => t.category),
    ])
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) return;

    onAddTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category,
      account,
      date,
      status,
      notes: notes.trim() || undefined,
    });

    // Reset Form
    setDescription('');
    setAmount('');
    setCategory('');
    setNotes('');
    setShowAddModal(false);
  };

  // Filtering Logic
  const filtered = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-stone-900 dark:text-stone-50">Transações</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">Gerencie todas as suas movimentações financeiras</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-3 rounded-2xl shadow-md shadow-orange-500/20 transition-all text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-stone-900/60 rounded-3xl p-4 border border-stone-200/60 dark:border-stone-800 flex flex-col md:flex-row items-center gap-3">
        
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descrição ou categoria..."
            className="w-full bg-stone-100 dark:bg-stone-800/60 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 outline-none border border-transparent focus:border-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          
          {/* Type Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-stone-100 dark:bg-stone-800/60 text-xs font-medium text-stone-700 dark:text-stone-300 rounded-2xl px-3 py-2.5 outline-none border border-transparent focus:border-orange-500 cursor-pointer"
          >
            <option value="all">Todos os Tipos</option>
            <option value="expense">Despesas</option>
            <option value="income">Receitas</option>
            <option value="transfer">Transferências</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-stone-100 dark:bg-stone-800/60 text-xs font-medium text-stone-700 dark:text-stone-300 rounded-2xl px-3 py-2.5 outline-none border border-transparent focus:border-orange-500 cursor-pointer"
          >
            <option value="all">Todas Categorias</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-stone-100 dark:bg-stone-800/60 text-xs font-medium text-stone-700 dark:text-stone-300 rounded-2xl px-3 py-2.5 outline-none border border-transparent focus:border-orange-500 cursor-pointer"
          >
            <option value="all">Todos Status</option>
            <option value="paid">Concluídos / Pagos</option>
            <option value="pending">Pendentes</option>
          </select>

        </div>
      </div>

      {/* Transactions List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-stone-900/60 rounded-3xl p-12 text-center border border-stone-200/60 dark:border-stone-800">
          <p className="text-stone-500 dark:text-stone-400 text-sm">Nenhuma transação encontrada com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {filtered.map((t) => {
              const isIncome = t.type === 'income';
              const isTransfer = t.type === 'transfer';
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  layout
                  className="bg-white dark:bg-stone-900/60 rounded-3xl p-5 border border-stone-200/60 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-orange-500/30 transition-all"
                >
                  {/* Left Info */}
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : isTransfer
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {isIncome ? <ArrowUpRight className="w-5 h-5" /> : isTransfer ? <ArrowLeftRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm font-display">{t.description}</h4>
                      <div className="flex items-center flex-wrap gap-2 mt-1 text-xs text-stone-500 dark:text-stone-400">
                        <span className="bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full font-medium text-stone-700 dark:text-stone-300">
                          {t.category}
                        </span>
                        <span>•</span>
                        <span>{t.account}</span>
                        <span>•</span>
                        <span>{format(parseISO(t.date), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                      </div>
                      {t.notes && <p className="text-[11px] text-stone-400 mt-1 italic">{t.notes}</p>}
                    </div>
                  </div>

                  {/* Right Actions & Amount */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 dark:border-stone-800">
                    
                    {/* Status Pill */}
                    <button
                      onClick={() => onToggleStatus(t.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                        t.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                      }`}
                      title="Clique para alternar o status"
                    >
                      {t.status === 'paid' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      <span>{t.status === 'paid' ? 'Pago / Concluído' : 'Pendente'}</span>
                    </button>

                    {/* Amount */}
                    <span className={`text-base font-bold font-display tracking-tight ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-900 dark:text-stone-50'
                    }`}>
                      {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => onRemoveTransaction(t.id)}
                      className="text-stone-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Excluir Transação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 p-7 shadow-2xl border border-stone-200 dark:border-stone-800 my-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-display text-stone-900 dark:text-stone-50">Nova Transação</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                    type === 'expense' ? 'bg-rose-500 text-white shadow-sm' : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                    type === 'income' ? 'bg-emerald-500 text-white shadow-sm' : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setType('transfer')}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                    type === 'transfer' ? 'bg-blue-500 text-white shadow-sm' : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Transferência
                </button>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Descrição</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Aluguel, Supermercado, Salário"
                  className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Category & Account */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Categoria</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Alimentação"
                    className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Conta / Cartão</label>
                  <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500 cursor-pointer"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.name}>{acc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between bg-stone-100 dark:bg-stone-800/50 p-3 rounded-2xl border border-stone-200/50 dark:border-stone-700/50">
                <span className="text-xs font-medium text-stone-700 dark:text-stone-300">Status do Pagamento</span>
                <button
                  type="button"
                  onClick={() => setStatus(status === 'paid' ? 'pending' : 'paid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    status === 'paid' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}
                >
                  {status === 'paid' ? 'Pago / Concluído' : 'Pendente'}
                </button>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Observações (Opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Parcela 1/3, comprovante no e-mail"
                  className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-sm cursor-pointer"
              >
                Salvar Transação
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
