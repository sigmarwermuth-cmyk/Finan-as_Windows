import React, { useState } from 'react';
import { CategoryBudget, FinancialGoal, Transaction } from '../types';
import { Target, PieChart as PieIcon, Plus, Trash2, TrendingUp, AlertTriangle, CheckCircle2, DollarSign, X } from 'lucide-react';
import { motion } from 'motion/react';

interface BudgetsAndGoalsViewProps {
  budgets: CategoryBudget[];
  goals: FinancialGoal[];
  categoryExpenses: { name: string; value: number }[];
  onUpdateBudget: (category: string, amount: number) => void;
  onAddBudget: (category: string, amount: number, color: string) => void;
  onAddGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  onAddContributionToGoal: (id: string, amount: number) => void;
  onRemoveGoal: (id: string) => void;
}

export const BudgetsAndGoalsView: React.FC<BudgetsAndGoalsViewProps> = ({
  budgets,
  goals,
  categoryExpenses,
  onUpdateBudget,
  onAddBudget,
  onAddGoal,
  onAddContributionToGoal,
  onRemoveGoal,
}) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState<{ id: string; title: string } | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');

  // New Goal Form
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialSaved, setInitialSaved] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [goalCategory, setGoalCategory] = useState('Reserva');

  // New Budget Form
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !targetAmount) return;

    onAddGoal({
      title: goalTitle,
      targetAmount: parseFloat(targetAmount),
      currentAmount: initialSaved ? parseFloat(initialSaved) : 0,
      deadline,
      category: goalCategory,
      color: '#10B981',
    });

    setGoalTitle('');
    setTargetAmount('');
    setInitialSaved('');
    setShowGoalModal(false);
  };

  const handleContributionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showContributionModal && contributionAmount) {
      onAddContributionToGoal(showContributionModal.id, parseFloat(contributionAmount));
      setShowContributionModal(null);
      setContributionAmount('');
    }
  };

  const handleAddBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBudgetCategory && newBudgetAmount) {
      onAddBudget(newBudgetCategory, parseFloat(newBudgetAmount), '#F97316');
      setNewBudgetCategory('');
      setNewBudgetAmount('');
      setShowAddBudgetModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-display tracking-tight text-stone-900 dark:text-stone-50">Orçamentos & Metas</h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">Planeje seus limites de gastos por categoria e acompanhe suas conquistas</p>
      </div>

      {/* 1. Category Budgets Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-stone-900 dark:text-stone-50 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-orange-500" />
            <span>Teto de Gastos por Categoria</span>
          </h3>

          <button
            onClick={() => setShowAddBudgetModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-500" />
            <span>Novo Orçamento</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const spentObj = categoryExpenses.find((c) => c.name.toLowerCase() === b.category.toLowerCase());
            const spent = spentObj ? spentObj.value : 0;
            const percentage = Math.min(100, (spent / b.allocatedAmount) * 100);
            const isExceeded = spent > b.allocatedAmount;
            const isWarning = percentage >= 80 && !isExceeded;

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-stone-900/60 rounded-3xl p-5 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm font-display">
                      {b.category}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isExceeded
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : isWarning
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {isExceeded ? 'Estourado!' : isWarning ? 'Atenção' : 'Dentro do limite'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs text-stone-500 dark:text-stone-400 mt-1">
                    <span>Gasto: <strong className="text-stone-900 dark:text-stone-100">{formatCurrency(spent)}</strong></span>
                    <span>Limite: <strong className="text-stone-700 dark:text-stone-300">{formatCurrency(b.allocatedAmount)}</strong></span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
                    <span>{percentage.toFixed(0)}% utilizado</span>
                    <span>
                      {isExceeded
                        ? `Excedeu em ${formatCurrency(spent - b.allocatedAmount)}`
                        : `Resta ${formatCurrency(b.allocatedAmount - spent)}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Financial Goals Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-stone-900 dark:text-stone-50 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <span>Metas de Economia</span>
          </h3>

          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2.5 rounded-2xl shadow-md shadow-orange-500/20 transition-all text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Meta</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-stone-900/60 rounded-3xl p-6 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {goal.category}
                    </span>
                    <button
                      onClick={() => onRemoveGoal(goal.id)}
                      className="text-stone-400 hover:text-rose-500 p-1"
                      title="Excluir Meta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-bold text-stone-900 dark:text-stone-50 text-base font-display">{goal.title}</h4>

                  <div className="mt-3">
                    <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(goal.currentAmount)}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Meta: {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Progress Bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>{percentage.toFixed(0)}% concluído</span>
                      <span>Prazo: {goal.deadline}</span>
                    </div>
                  </div>

                  {/* Add Contribution Button */}
                  <button
                    onClick={() => setShowContributionModal({ id: goal.id, title: goal.title })}
                    className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Aportar Valor</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 p-7 shadow-2xl border border-stone-200 dark:border-stone-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-display text-stone-900 dark:text-stone-50">Nova Meta Financeira</h3>
              <button onClick={() => setShowGoalModal(false)} className="text-stone-400 hover:text-stone-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGoalSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Título da Meta</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Ex: Viagem, Entrada do Apartamento"
                  className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Valor Alvo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="10000.00"
                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Já Guardado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={initialSaved}
                    onChange={(e) => setInitialSaved(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Data Limite</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Categoria</label>
                  <input
                    type="text"
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    placeholder="Reserva, Lazer, etc"
                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-sm cursor-pointer"
              >
                Criar Meta
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Contribution Modal */}
      {showContributionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 p-6 shadow-2xl border border-stone-200 dark:border-stone-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold font-display text-stone-900 dark:text-stone-50">
                Aportar em "{showContributionModal.title}"
              </h4>
              <button onClick={() => setShowContributionModal(null)} className="text-stone-400 hover:text-stone-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleContributionSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Valor do Aporte (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="Ex: 250.00"
                  className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-2xl shadow-md shadow-emerald-500/20 transition-all text-xs cursor-pointer"
              >
                Confirmar Aporte
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 p-6 shadow-2xl border border-stone-200 dark:border-stone-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold font-display text-stone-900 dark:text-stone-50">
                Novo Orçamento por Categoria
              </h4>
              <button onClick={() => setShowAddBudgetModal(false)} className="text-stone-400 hover:text-stone-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBudgetSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Categoria</label>
                <input
                  type="text"
                  required
                  value={newBudgetCategory}
                  onChange={(e) => setNewBudgetCategory(e.target.value)}
                  placeholder="Ex: Educação, Pet Shop, Vestuário"
                  className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Limite Mensal (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                  placeholder="500.00"
                  className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-2xl shadow-md shadow-orange-500/20 transition-all text-xs cursor-pointer"
              >
                Salvar Orçamento
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
