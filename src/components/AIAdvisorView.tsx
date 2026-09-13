import React, { useState } from 'react';
import { FinancialSummary, Transaction, CategoryBudget, FinancialGoal } from '../types';
import { Sparkles, Bot, Lightbulb, TrendingUp, ShieldAlert, Send, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface AIAdvisorViewProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  budgets: CategoryBudget[];
  goals: FinancialGoal[];
  categoryExpenses: { name: string; value: number }[];
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({
  summary,
  transactions,
  budgets,
  goals,
  categoryExpenses,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Olá! Sou o seu Assistente de IA Finanças Pro. Analisei seu extrato atual e estou pronto para te dar dicas personalizadas de economia, investimentos e gestão de orçamento. Como posso te ajudar hoje?',
    },
  ]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Automated Diagnostic Insights
  const topExpense = categoryExpenses.length > 0
    ? [...categoryExpenses].sort((a, b) => b.value - a.value)[0]
    : null;

  const quickQuestions = [
    'Como montar minha reserva de emergência?',
    'Qual a regra 50-30-20 para meu salário?',
    'Como reduzir gastos com alimentação?',
    'Devo quitar dívidas ou investir primeiro?',
  ];

  const handleSendPrompt = async (questionText?: string) => {
    const textToSend = questionText || prompt;
    if (!textToSend.trim()) return;

    // Append User Message
    setChatHistory((prev) => [...prev, { role: 'user', text: textToSend }]);
    if (!questionText) setPrompt('');
    setIsLoading(true);

    try {
      // Create rich context from user financial state
      const context = `
Contexto Financeiro Atual do Usuário:
- Receita Mensal: ${formatCurrency(summary.totalIncome)}
- Despesa Mensal: ${formatCurrency(summary.totalExpense)}
- Saldo Patrimonial: ${formatCurrency(summary.balance)}
- Taxa de Poupança: ${summary.savingsRate.toFixed(1)}%
- Maior Categoria de Gastos: ${topExpense ? `${topExpense.name} (${formatCurrency(topExpense.value)})` : 'N/A'}
- Metas Cadastradas: ${goals.map(g => `${g.title}: ${formatCurrency(g.currentAmount)} de ${formatCurrency(g.targetAmount)}`).join(', ')}
`;

      // Call API or Rule-based response
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, context }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory((prev) => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        // Fallback intelligent response generator
        let reply = '';
        const q = textToSend.toLowerCase();

        if (q.includes('reserva') || q.includes('emergência')) {
          reply = `Para o seu perfil atual, recomendamos uma Reserva de Emergência equivalente a 6 meses do seu custo de vida mensal (aprox. ${formatCurrency(summary.totalExpense * 6)}). Guarde em aplicações de alta liquidez como Tesouro Selic ou CDB 100% CDI com resgate diário.`;
        } else if (q.includes('50-30-20') || q.includes('regra')) {
          reply = `A regra 50-30-20 dividirá sua receita de ${formatCurrency(summary.totalIncome)} da seguinte forma:\n- 50% (Necessidades básicas): ${formatCurrency(summary.totalIncome * 0.50)}\n- 30% (Desejos e Lazer): ${formatCurrency(summary.totalIncome * 0.30)}\n- 20% (Investimentos e Metas): ${formatCurrency(summary.totalIncome * 0.20)}`;
        } else if (q.includes('alimentação') || q.includes('mercado')) {
          reply = topExpense && topExpense.name === 'Alimentação'
            ? `Notamos que Alimentação é atualmente seu maior gasto (${formatCurrency(topExpense.value)}). Dica Pro: Planeje o cardápio semanal antes de ir ao mercado, evite compras com fome e priorize atacadistas para itens não perecíveis.`
            : `Para economizar na alimentação, defina uma lista rígida de compras de supermercado e limite pedimentos de delivery para no máximo 1x por semana.`;
        } else {
          reply = `Com base no seu saldo atual de ${formatCurrency(summary.balance)} e taxa de poupança de ${summary.savingsRate.toFixed(1)}%, você tem excelente potencial financeiro. Manter o controle rigoroso dos orçamentos garantirá que você atinja suas metas no prazo planejado!`;
        }

        setChatHistory((prev) => [...prev, { role: 'assistant', text: reply }]);
      }
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Com base nas suas finanças atuais (Poupança de ${summary.savingsRate.toFixed(1)}%), foque em manter suas despesas abaixo da receita e continuar aportando nas suas metas de economia!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <h2 className="text-xl font-bold font-display">IA Assistente Finanças Pro</h2>
          </div>
          <p className="text-xs text-orange-100">
            Inteligência financeira personalizada com base nos seus dados e hábitos de consumo.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-semibold text-white border border-white/20 self-start sm:self-auto">
          Saúde Financeira: {summary.savingsRate >= 20 ? 'Excelente (85/100)' : summary.savingsRate > 0 ? 'Boa (70/100)' : 'Atenção (45/100)'}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Automated Financial Insights Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Diagnósticos Automáticos
          </h3>

          {/* Insight 1: Savings Rate */}
          <div className="bg-white dark:bg-stone-900/60 rounded-3xl p-5 border border-stone-200/60 dark:border-stone-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>Taxa de Retenção</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Você está poupando <strong className="text-stone-900 dark:text-stone-100">{summary.savingsRate.toFixed(1)}%</strong> da sua receita total neste mês.
            </p>
          </div>

          {/* Insight 2: Top Expense Category */}
          {topExpense && (
            <div className="bg-white dark:bg-stone-900/60 rounded-3xl p-5 border border-stone-200/60 dark:border-stone-800 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-orange-500 text-xs font-semibold">
                <Lightbulb className="w-4 h-4" />
                <span>Ponto Focal de Custo</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Sua maior categoria de despesa é <strong className="text-stone-900 dark:text-stone-100">{topExpense.name}</strong> ({formatCurrency(topExpense.value)}).
              </p>
            </div>
          )}

          {/* Insight 3: Goals progress */}
          <div className="bg-white dark:bg-stone-900/60 rounded-3xl p-5 border border-stone-200/60 dark:border-stone-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-500 text-xs font-semibold">
              <Bot className="w-4 h-4" />
              <span>Progresso de Metas</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Você possui <strong className="text-stone-900 dark:text-stone-100">{goals.length} metas ativas</strong>. Continue os aportes mensais para manter o cronograma!
            </p>
          </div>

        </div>

        {/* Right Column: AI Interactive Chat */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900/60 rounded-3xl border border-stone-200/60 dark:border-stone-800 flex flex-col h-[520px] overflow-hidden">
          
          {/* Chat Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
            {chatHistory.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.role === 'user' ? 'bg-orange-600 text-white' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {msg.role === 'user' ? 'Você' : <Sparkles className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-3xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-orange-600 text-white font-medium rounded-tr-none'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-none border border-stone-200/50 dark:border-stone-700/50'
                }`}>
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
                <span>Analisando suas finanças...</span>
              </div>
            )}
          </div>

          {/* Quick Question Chips */}
          <div className="px-6 py-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(q)}
                className="text-[11px] font-medium text-stone-600 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700/80 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-4 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200/60 dark:border-stone-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Pergunte qualquer coisa sobre suas finanças ou peça conselhos..."
                className="flex-1 bg-white dark:bg-stone-800 rounded-2xl px-4 py-3 text-xs text-stone-900 dark:text-stone-50 outline-none border border-stone-200 dark:border-stone-700 focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white p-3 rounded-2xl transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
