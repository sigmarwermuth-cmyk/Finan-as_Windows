import React from 'react';
import { PWAInstallButton } from '../PWAInstallButton';
import { LayoutDashboard, Receipt, Wallet, Target, Sparkles, Calendar, RotateCcw, Download } from 'lucide-react';
import { motion } from 'motion/react';

export type TabType = 'dashboard' | 'transactions' | 'accounts' | 'budgets' | 'advisor';

interface HeaderNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  availableMonths: string[];
  onResetData: () => void;
  onExportCSV: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  selectedMonth,
  setSelectedMonth,
  availableMonths,
  onResetData,
  onExportCSV,
}) => {
  const formatMonthLabel = (ym: string) => {
    if (ym === 'all') return 'Todas as Datas';
    const [year, month] = ym.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthName = date.toLocaleString('pt-BR', { month: 'long' });
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} / ${year}`;
  };

  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as TabType, label: 'Transações', icon: Receipt },
    { id: 'accounts' as TabType, label: 'Contas & Cartões', icon: Wallet },
    { id: 'budgets' as TabType, label: 'Orçamentos & Metas', icon: Target },
    { id: 'advisor' as TabType, label: 'IA Assistente', icon: Sparkles },
  ];

  return (
    <header className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-30 border-b border-stone-200/60 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Logo & Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-bold font-display text-xl">
                F
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-display">
                    Finanças Pro
                  </h1>
                  <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide border border-orange-500/20">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Gestão Financeira Completa</p>
              </div>
            </div>

            {/* Mobile PWA Install */}
            <div className="md:hidden flex items-center gap-2">
              <PWAInstallButton />
            </div>
          </div>

          {/* Month Selector & Global Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Month Dropdown */}
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
              <Calendar className="w-4 h-4 text-orange-500" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-sm font-medium text-stone-800 dark:text-stone-200 outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-white dark:bg-stone-900">Todas as Datas</option>
                {availableMonths.map((ym) => (
                  <option key={ym} value={ym} className="bg-white dark:bg-stone-900">
                    {formatMonthLabel(ym)}
                  </option>
                ))}
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={onExportCSV}
              title="Exportar Transações (CSV)"
              className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700/80 px-3 py-2 rounded-xl border border-stone-200/60 dark:border-stone-700/60 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            {/* Reset Sample Data Button */}
            <button
              onClick={onResetData}
              title="Restaurar dados de exemplo"
              className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700/80 px-3 py-2 rounded-xl border border-stone-200/60 dark:border-stone-700/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>

            {/* Desktop PWA Install */}
            <div className="hidden md:block">
              <PWAInstallButton />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-orange-600 dark:text-orange-400 font-semibold bg-orange-500/10 dark:bg-orange-500/15'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-stone-400'}`} />
                <span>{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
