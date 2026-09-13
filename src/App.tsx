import { useState } from 'react';
import { useFinanceStore } from './useFinanceStore';
import { HeaderNav, TabType } from './components/HeaderNav';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { AccountsCardsView } from './components/AccountsCardsView';
import { BudgetsAndGoalsView } from './components/BudgetsAndGoalsView';
import { AIAdvisorView } from './components/AIAdvisorView';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  const {
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
  } = useFinanceStore();

  // Export CSV Helper
  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['ID', 'Descrição', 'Valor', 'Tipo', 'Categoria', 'Conta', 'Data', 'Status', 'Observações'];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.type,
      `"${t.category}"`,
      `"${t.account}"`,
      t.date,
      t.status,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Financas_Pro_Export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* Header with Nav */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        availableMonths={availableMonths}
        onResetData={() => setShowResetConfirmModal(true)}
        onExportCSV={handleExportCSV}
      />

      {/* Main App Content View Switcher */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'dashboard' && (
              <DashboardView
                summary={summary}
                categoryExpenses={categoryExpenses}
                transactions={filteredTransactions}
                onToggleStatus={toggleTransactionStatus}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsView
                transactions={filteredTransactions}
                accounts={accounts}
                onAddTransaction={addTransaction}
                onUpdateTransaction={updateTransaction}
                onRemoveTransaction={removeTransaction}
                onToggleStatus={toggleTransactionStatus}
              />
            )}

            {activeTab === 'accounts' && (
              <AccountsCardsView
                accounts={accounts}
                onAddAccount={addAccount}
                onUpdateAccount={updateAccount}
                onRemoveAccount={removeAccount}
              />
            )}

            {activeTab === 'budgets' && (
              <BudgetsAndGoalsView
                budgets={budgets}
                goals={goals}
                categoryExpenses={categoryExpenses}
                onUpdateBudget={updateBudget}
                onAddBudget={addBudget}
                onAddGoal={addGoal}
                onAddContributionToGoal={addContributionToGoal}
                onRemoveGoal={removeGoal}
              />
            )}

            {activeTab === 'advisor' && (
              <AIAdvisorView
                summary={summary}
                transactions={filteredTransactions}
                budgets={budgets}
                goals={goals}
                categoryExpenses={categoryExpenses}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 dark:border-stone-800/80 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <p>© 2026 Finanças Pro. Todos os dados são salvos localmente no seu dispositivo.</p>
      </footer>

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-center"
          >
            <h3 className="text-lg font-bold font-display text-stone-900 dark:text-stone-50 mb-2">Restaurar Dados?</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
              Isso irá recarregar o conjunto de dados demonstrativos do Finanças Pro.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setShowResetConfirmModal(false);
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-xl text-xs shadow-md shadow-orange-500/20"
              >
                Restaurar
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
