import React, { useState } from 'react';
import { Account, AccountType } from '../types';
import { CreditCard, Wallet, Plus, Trash2, Landmark, DollarSign, X, Pencil } from 'lucide-react';
import { motion } from 'motion/react';

interface AccountsCardsViewProps {
  accounts: Account[];
  onAddAccount: (acc: Omit<Account, 'id'>) => void;
  onUpdateAccount: (acc: Account) => void;
  onRemoveAccount: (id: string) => void;
}

export const AccountsCardsView: React.FC<AccountsCardsViewProps> = ({
  accounts,
  onAddAccount,
  onUpdateAccount,
  onRemoveAccount,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('#F97316');
  const [limit, setLimit] = useState('');
  const [closingDay, setClosingDay] = useState('20');
  const [dueDay, setDueDay] = useState('27');

  const handleOpenAddModal = () => {
    setEditingAccountId(null);
    setName('');
    setType('checking');
    setBalance('');
    setColor('#F97316');
    setLimit('');
    setClosingDay('20');
    setDueDay('27');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (acc: Account) => {
    setEditingAccountId(acc.id);
    setName(acc.name);
    setType(acc.type);
    setBalance(acc.balance.toString());
    setColor(acc.color || '#F97316');
    setLimit(acc.limit ? acc.limit.toString() : '');
    setClosingDay(acc.closingDay ? acc.closingDay.toString() : '20');
    setDueDay(acc.dueDay ? acc.dueDay.toString() : '27');
    setShowAddModal(true);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const creditCards = accounts.filter((a) => a.type === 'credit');
  const otherAccounts = accounts.filter((a) => a.type !== 'credit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;

    if (editingAccountId) {
      onUpdateAccount({
        id: editingAccountId,
        name,
        type,
        balance: parseFloat(balance),
        color,
        limit: type === 'credit' && limit ? parseFloat(limit) : undefined,
        closingDay: type === 'credit' && closingDay ? parseInt(closingDay) : undefined,
        dueDay: type === 'credit' && dueDay ? parseInt(dueDay) : undefined,
      });
    } else {
      onAddAccount({
        name,
        type,
        balance: parseFloat(balance),
        color,
        limit: type === 'credit' && limit ? parseFloat(limit) : undefined,
        closingDay: type === 'credit' && closingDay ? parseInt(closingDay) : undefined,
        dueDay: type === 'credit' && dueDay ? parseInt(dueDay) : undefined,
      });
    }

    setName('');
    setBalance('');
    setLimit('');
    setEditingAccountId(null);
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-stone-900 dark:text-stone-50">Contas & Cartões</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">Gerencie suas contas bancárias, cartões de crédito e carteiras</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-3 rounded-2xl shadow-md shadow-orange-500/20 transition-all text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Conta / Cartão</span>
        </button>
      </div>

      {/* Credit Cards Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold font-display text-stone-900 dark:text-stone-50 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-500" />
          <span>Cartões de Crédito</span>
        </h3>

        {creditCards.length === 0 ? (
          <div className="bg-white dark:bg-stone-900/60 rounded-3xl p-8 text-center border border-stone-200/60 dark:border-stone-800 text-stone-400 text-sm">
            Nenhum cartão de crédito cadastrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creditCards.map((card) => {
              const usedAmount = Math.abs(card.balance);
              const cardLimit = card.limit || 5000;
              const availableLimit = Math.max(0, cardLimit - usedAmount);
              const usedPercentage = Math.min(100, (usedAmount / cardLimit) * 100);

              return (
                <div
                  key={card.id}
                  className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl p-6 border border-stone-800 shadow-xl flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Decorative background circle */}
                  <div
                    className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: card.color || '#8A05BE' }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: card.color }}
                        />
                        <span className="font-semibold text-sm font-display tracking-wide">{card.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(card)}
                          className="text-stone-400 hover:text-orange-400 p-1 rounded transition-colors cursor-pointer"
                          title="Editar Cartão"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveAccount(card.id)}
                          className="text-stone-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                          title="Remover Cartão"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-stone-400 uppercase tracking-widest font-mono">Fatura Atual</p>
                    <p className="text-3xl font-bold font-display text-rose-400 mt-1">
                      {formatCurrency(usedAmount)}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    {/* Usage Progress Bar */}
                    <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
                      <span>Limite Disponível: <strong className="text-emerald-400">{formatCurrency(availableLimit)}</strong></span>
                      <span>{usedPercentage.toFixed(0)}% do limite</span>
                    </div>

                    <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all rounded-full ${
                          usedPercentage > 85 ? 'bg-rose-500' : usedPercentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${usedPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                      <span>Fechamento: Dia {card.closingDay || 20}</span>
                      <span>Vencimento: Dia {card.dueDay || 27}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Other Bank Accounts Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold font-display text-stone-900 dark:text-stone-50 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-orange-500" />
          <span>Contas Correntes, Carteira & Investimentos</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherAccounts.map((acc) => {
            const isNegative = acc.balance < 0;
            return (
              <div
                key={acc.id}
                className="bg-white dark:bg-stone-900/60 rounded-3xl p-6 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {acc.type === 'checking' ? 'Conta Corrente' : acc.type === 'savings' ? 'Poupança' : acc.type === 'investment' ? 'Investimento' : 'Carteira'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(acc)}
                        className="text-stone-400 hover:text-orange-500 p-1 rounded transition-colors cursor-pointer"
                        title="Editar Conta"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveAccount(acc.id)}
                        className="text-stone-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                        title="Excluir Conta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm font-display">{acc.name}</h4>
                  <p className={`text-2xl font-bold font-display mt-2 ${isNegative ? 'text-rose-500' : 'text-stone-900 dark:text-stone-50'}`}>
                    {formatCurrency(acc.balance)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 p-7 shadow-2xl border border-stone-200 dark:border-stone-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-display text-stone-900 dark:text-stone-50">
                {editingAccountId ? 'Editar Conta / Cartão' : 'Nova Conta / Cartão'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAccountId(null);
                }}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Nome da Instituição ou Conta</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Banco Inter, Cartão C6, Mercado Pago"
                  className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Tipo de Conta</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AccountType)}
                    className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500 cursor-pointer"
                  >
                    <option value="checking">Conta Corrente</option>
                    <option value="credit">Cartão de Crédito</option>
                    <option value="savings">Poupança</option>
                    <option value="investment">Investimento</option>
                    <option value="cash">Dinheiro em Mão</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Saldo Inicial (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-50 outline-none border border-transparent focus:border-orange-500"
                  />
                </div>
              </div>

              {type === 'credit' && (
                <div className="grid grid-cols-3 gap-3 bg-stone-100 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200/50 dark:border-stone-700/50">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400">Limite R$</label>
                    <input
                      type="number"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      placeholder="5000"
                      className="bg-white dark:bg-stone-900 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 dark:text-stone-50 outline-none border border-stone-200 dark:border-stone-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400">Dia Fechamento</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={closingDay}
                      onChange={(e) => setClosingDay(e.target.value)}
                      className="bg-white dark:bg-stone-900 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 dark:text-stone-50 outline-none border border-stone-200 dark:border-stone-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-stone-600 dark:text-stone-400">Dia Vencimento</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={dueDay}
                      onChange={(e) => setDueDay(e.target.value)}
                      className="bg-white dark:bg-stone-900 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 dark:text-stone-50 outline-none border border-stone-200 dark:border-stone-700"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-sm cursor-pointer"
              >
                {editingAccountId ? 'Salvar Alterações' : 'Cadastrar Conta'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
