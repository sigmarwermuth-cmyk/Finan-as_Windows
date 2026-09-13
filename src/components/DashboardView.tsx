import React from 'react';
import { FinancialSummary, Transaction } from '../types';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, AlertCircle, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'motion/react';
import { getDueDateInfo } from '../utils/dateUtils';

interface DashboardViewProps {
  summary: FinancialSummary;
  categoryExpenses: { name: string; value: number }[];
  transactions: Transaction[];
  onToggleStatus: (id: string) => void;
  onNavigateToTab: (tab: any) => void;
}

const CATEGORY_COLORS = ['#F97316', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#6366F1', '#F59E0B', '#14B8A6'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  categoryExpenses,
  transactions,
  onToggleStatus,
  onNavigateToTab,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const pendingTransactions = transactions.filter((t) => t.status === 'pending');
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      
      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Net Worth / Balance */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/15 relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-100 font-display">Patrimônio Líquido</span>
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Wallet className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold font-display tracking-tight mt-1">
              {formatCurrency(summary.balance)}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-orange-100/90 pt-3 border-t border-white/10">
            <span>Saldos de todas as contas</span>
            <button onClick={() => onNavigateToTab('accounts')} className="underline hover:text-white">Ver contas</button>
          </div>
        </motion.div>

        {/* Monthly Income */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-stone-900/60 rounded-3xl p-6 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-display">Receitas (Mês)</span>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-display tracking-tight text-stone-900 dark:text-stone-50 mt-1">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>
          <div className="mt-4 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            + {formatCurrency(summary.pendingIncome)} a receber
          </div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-stone-900/60 rounded-3xl p-6 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-display">Despesas (Mês)</span>
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-display tracking-tight text-stone-900 dark:text-stone-50 mt-1">
              {formatCurrency(summary.totalExpense)}
            </p>
          </div>
          <div className="mt-4 text-xs text-rose-600 dark:text-rose-400 font-medium">
            - {formatCurrency(summary.pendingExpense)} pendente de pagamento
          </div>
        </motion.div>

        {/* Savings Rate % */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-stone-900/60 rounded-3xl p-6 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-display">Taxa de Poupança</span>
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-display tracking-tight text-stone-900 dark:text-stone-50 mt-1">
              {summary.savingsRate.toFixed(1)}%
            </p>
          </div>
          <div className="mt-4 text-xs text-stone-500 dark:text-stone-400">
            {summary.savingsRate >= 20 ? ' Meta ideal alcançada (20%+)' : ' Meta recomendada: 20% do salário'}
          </div>
        </motion.div>

      </div>

      {/* 2. Charts & Financial Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Expenses Pie Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900/60 rounded-3xl p-6 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold font-display text-stone-900 dark:text-stone-50">Despesas por Categoria</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Distribuição dos gastos no período selecionado</p>
            </div>
          </div>

          {categoryExpenses.length === 0 ? (
            <div className="py-16 text-center text-stone-400 dark:text-stone-500 text-sm">
              Nenhuma despesa registrada para exibir o gráfico.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
              <div className="md:col-span-7 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryExpenses}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {categoryExpenses.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => formatCurrency(Number(val))}
                      contentStyle={{
                        backgroundColor: '#1c1917',
                        borderColor: '#44403c',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="md:col-span-5 flex flex-col gap-2 max-h-56 overflow-y-auto no-scrollbar">
                {categoryExpenses.map((cat, idx) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                      />
                      <span className="text-stone-700 dark:text-stone-300 font-medium truncate">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 ml-2">
                      {formatCurrency(cat.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Insights & Pending Bills Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Financial Health Tip */}
          <div className="bg-stone-900 dark:bg-stone-950 rounded-3xl p-6 text-stone-100 border border-stone-800">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-semibold text-sm font-display tracking-wide uppercase">Saúde Financeira</h4>
            </div>
            <p className="text-sm leading-relaxed text-stone-300">
              {summary.totalIncome > summary.totalExpense
                ? `Você está economizando ${formatCurrency(summary.totalIncome - summary.totalExpense)} este mês. Ótimo trabalho! Lembre-se de destinar essa folga para suas metas.`
                : summary.totalExpense > 0
                ? 'Atenção: Suas despesas estão superando ou igualando suas receitas no período. Avalie seus orçamentos por categoria.'
                : 'Registre suas receitas e despesas para obter diagnósticos completos da sua saúde financeira.'}
            </p>
          </div>

          {/* Pending Bills */}
          <div className="bg-white dark:bg-stone-900/60 rounded-3xl p-6 border border-stone-200/60 dark:border-stone-800 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-bold font-display text-stone-900 dark:text-stone-50">Contas a Pagar / Receber</h4>
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {pendingTransactions.length} pendentes
                </span>
              </div>

              {pendingTransactions.length === 0 ? (
                <div className="py-6 text-center text-stone-400 dark:text-stone-500 text-xs">
                  Nenhuma conta pendente no momento. Tudo em dia!
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto no-scrollbar">
                  {pendingTransactions.map((t) => {
                    const dueInfo = getDueDateInfo(t.date, t.status);
                    return (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between p-3 rounded-2xl text-xs border transition-all ${
                          dueInfo?.type === 'overdue'
                            ? 'bg-rose-500/10 border-rose-500/20 text-stone-900 dark:text-stone-100'
                            : 'bg-stone-50 dark:bg-stone-800/50 border-stone-100 dark:border-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {dueInfo?.type === 'overdue' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          )}
                          <div className="truncate">
                            <div className="flex items-center gap-1.5 truncate">
                              <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">{t.description}</p>
                              {dueInfo && (
                                <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${dueInfo.badgeClass}`}>
                                  {dueInfo.label}
                                </span>
                              )}
                            </div>
                            <p className="text-stone-500 dark:text-stone-400 text-[11px]">{t.category} • {t.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-stone-900 dark:text-stone-100'}`}>
                            {formatCurrency(t.amount)}
                          </span>
                          <button
                            onClick={() => onToggleStatus(t.id)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Marcar como Pago"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigateToTab('transactions')}
              className="mt-4 w-full text-center text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline pt-2"
            >
              Ver Extrato Completo →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
