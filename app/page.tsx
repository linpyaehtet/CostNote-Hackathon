'use client';
import { useState, FormEvent, useEffect } from 'react';
import { Zap, Book, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExpenseData {
  raw: string;
  category?: string;
  amount?: number;
  insight?: string;
  area_average?: number;
  price_difference?: number;
  deal_quality?: 'good_deal' | 'about_average' | 'above_average' | string;
  cheaper_alternative?: string;
}

const COLORS = ['#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#3b82f6'];

export default function CostNote() {
  const [activeTab, setActiveTab] = useState<'diary' | 'breakdown'>('diary');
  const [inputText, setInputText] = useState('');
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingBudget, setOnboardingBudget] = useState('');
  const [onboardingSavings, setOnboardingSavings] = useState('');

  // BACKEND SIMULATION: Load saved data when the app starts
  useEffect(() => {
    const savedData = localStorage.getItem('costnote_expenses');
    if (savedData) {
      setExpenses(JSON.parse(savedData));
    }

    const savedBudget = localStorage.getItem('costnote_budget');
    if (savedBudget) {
      try {
        const parsed = JSON.parse(savedBudget);
        if (typeof parsed.monthlyBudget === 'number') {
          setMonthlyBudget(parsed.monthlyBudget);
        }
        if (typeof parsed.monthlySavingsGoal === 'number') {
          setMonthlySavingsGoal(parsed.monthlySavingsGoal);
        }
      } catch {
        // ignore parse errors and fall back to onboarding
      }
    } else {
      setShowOnboarding(true);
    }
  }, []);

  // BACKEND SIMULATION: Save data automatically whenever an expense is added
  useEffect(() => {
    localStorage.setItem('costnote_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleLogExpense = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText) return;
    setIsParsing(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: inputText })
      });
      
      const aiData = await res.json();
      
      if (aiData.error) {
        alert("API Error - check terminal!");
        setIsParsing(false);
        return;
      }
      
      setExpenses([{ raw: inputText, ...aiData }, ...expenses]);
      setInputText('');
    } catch (error) {
      console.error("Error logging expense");
    } finally {
      setIsParsing(false);
    }
  };

  // Calculate data for the Pie Chart
  const chartData = expenses.reduce((acc: any[], curr) => {
    if (!curr.category || !curr.amount) return acc;
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const now = new Date();
  const currentMonthLabel = now.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const remainingBudget =
    monthlyBudget !== null ? Math.max(monthlyBudget - totalSpent, 0) : null;

  const spendableBudget =
    monthlyBudget !== null && monthlySavingsGoal !== null
      ? Math.max(monthlyBudget - monthlySavingsGoal, 0)
      : monthlyBudget;

  const safeRemaining =
    spendableBudget !== null ? Math.max(spendableBudget - totalSpent, 0) : null;

  const budgetUsageRatio =
    spendableBudget && spendableBudget > 0 ? totalSpent / spendableBudget : null;

  const budgetStatus =
    !spendableBudget || spendableBudget <= 0
      ? 'none'
      : totalSpent > spendableBudget
      ? 'over_goal'
      : budgetUsageRatio !== null && budgetUsageRatio >= 0.9
      ? 'budget_near_limit'
      : budgetUsageRatio !== null && budgetUsageRatio >= 0.75
      ? 'at_risk'
      : 'on_track';

  const formatCurrency = (value?: number) =>
    value !== undefined ? `$${value.toFixed(2)}` : '-';

  const getDealLabelAndColor = (quality?: ExpenseData['deal_quality']) => {
    switch (quality) {
      case 'good_deal':
        return { label: 'Good deal', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'above_average':
        return { label: 'Above area average', color: 'bg-red-500/15 text-red-300 border-red-500/40' };
      case 'about_average':
        return { label: 'About average', color: 'bg-slate-500/20 text-slate-200 border-slate-500/40' };
      default:
        return { label: 'No benchmark yet', color: 'bg-slate-700/40 text-slate-300 border-slate-600/60' };
    }
  };

  const handleOnboardingSubmit = (e: FormEvent) => {
    e.preventDefault();
    const budget = parseFloat(onboardingBudget);
    const savings = onboardingSavings ? parseFloat(onboardingSavings) : NaN;

    if (!isFinite(budget) || budget <= 0) {
      return;
    }

    const normalizedSavings =
      isFinite(savings) && savings > 0 ? savings : null;

    setMonthlyBudget(budget);
    setMonthlySavingsGoal(normalizedSavings);
    localStorage.setItem(
      'costnote_budget',
      JSON.stringify({
        monthlyBudget: budget,
        monthlySavingsGoal: normalizedSavings,
        month: currentMonthLabel,
      })
    );
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center font-bold">C</div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">CostNote</h1>
              <p className="text-xs text-gray-400">
                {currentMonthLabel} budget
                {monthlyBudget !== null && (
                  <>
                    {' · '}
                    Budget: <span className="font-semibold">{formatCurrency(monthlyBudget)}</span>
                    {remainingBudget !== null && (
                      <>
                        {' · Left: '}
                        <span className={remainingBudget <= 0 ? 'text-red-300 font-semibold' : 'text-emerald-300 font-semibold'}>
                          {formatCurrency(remainingBudget)}
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Type every spend to stay on track for this month&apos;s saving goal.
              </p>
            </div>
          </div>
        </div>

        {/* First-time onboarding overlay */}
        {showOnboarding && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 max-w-sm w-[90%] space-y-4 shadow-2xl">
              <h2 className="text-lg font-bold">Welcome to CostNote 👋</h2>
              <p className="text-xs text-gray-300">
                Let&apos;s set up your <span className="font-semibold">{currentMonthLabel}</span> budget so we can warn you
                before small treats and fare hikes blow your savings.
              </p>
              <form onSubmit={handleOnboardingSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-200 block">
                    Monthly money to manage (allowance + side income)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="e.g. 500"
                    value={onboardingBudget}
                    onChange={(e) => setOnboardingBudget(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-200 block">
                    How much do you want to save this month? <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="e.g. 150"
                    value={onboardingSavings}
                    onChange={(e) => setOnboardingSavings(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  We&apos;ll use this to nudge you if your daily spending makes it hard to hit your saving goal.
                </p>
                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  Start my {currentMonthLabel} budget
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-gray-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('diary')}
            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'diary' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
          >
            <Book size={16} /> Diary
          </button>
          <button 
            onClick={() => setActiveTab('breakdown')}
            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'breakdown' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
          >
            <PieChartIcon size={16} /> Breakdown
          </button>
        </div>

        {/* DIARY TAB */}
        {activeTab === 'diary' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {(monthlyBudget !== null || monthlySavingsGoal !== null) && budgetStatus !== 'none' && (
              <div
                className={`rounded-xl border px-3 py-2 text-xs ${
                  budgetStatus === 'over_goal'
                    ? 'bg-red-500/10 border-red-500/40 text-red-100'
                    : budgetStatus === 'budget_near_limit' || budgetStatus === 'at_risk'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-100'
                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100'
                }`}
              >
                <p className="font-semibold flex items-center justify-between">
                  <span>
                    {budgetStatus === 'over_goal'
                      ? 'You are already spending into your savings goal.'
                      : budgetStatus === 'budget_near_limit'
                      ? 'You are very close to your safe spending limit for the month.'
                      : budgetStatus === 'at_risk'
                      ? 'You are on track to hit your limit soon — small treats add up.'
                      : 'You are on track to hit this month’s saving goal.'}
                  </span>
                  {monthlySavingsGoal !== null && (
                    <span className="ml-2 text-[10px] opacity-80">
                      Goal: {formatCurrency(monthlySavingsGoal)}
                    </span>
                  )}
                </p>
                {spendableBudget !== null && (
                  <p className="mt-1">
                    Safe to spend this month:{' '}
                    <span className="font-semibold">{formatCurrency(spendableBudget)}</span>
                    {' · '}
                    Safe left:{' '}
                    <span
                      className={
                        safeRemaining !== null && safeRemaining <= 0
                          ? 'text-red-200 font-semibold'
                          : 'font-semibold'
                      }
                    >
                      {formatCurrency(safeRemaining ?? 0)}
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="bg-gray-800 rounded-xl p-4 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <form onSubmit={handleLogExpense}>
                <textarea 
                  className="w-full bg-transparent text-xl resize-none focus:outline-none mb-4 placeholder-gray-600"
                  placeholder="e.g., chicken rice 8 at Clementi MRT"
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                  type="submit" disabled={isParsing}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full font-medium transition-colors flex justify-center items-center gap-2"
                >
                  {isParsing ? <><Zap size={16} className="animate-pulse" /> Parsing AI...</> : "Log expense"}
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {expenses.map((exp, idx) => (
                <div key={idx} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors space-y-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg capitalize">{exp.category || "Unknown"}</span>
                      <span className="text-xs text-gray-400 break-words">{exp.raw}</span>
                    </div>
                    <span className="font-bold text-red-400 ml-3 whitespace-nowrap">
                      {formatCurrency(exp.amount ?? 0)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-gray-300">
                      {exp.area_average !== undefined && exp.price_difference !== undefined ? (
                        (() => {
                          const diff = exp.price_difference;
                          const pct =
                            exp.area_average > 0
                              ? Math.round((Math.abs(diff) / exp.area_average) * 100)
                              : null;
                          const diffLabel =
                            diff > 0 ? `+${diff.toFixed(2)}` : diff < 0 ? `-${Math.abs(diff).toFixed(2)}` : '0.00';
                          const direction = diff > 0 ? 'higher' : diff < 0 ? 'lower' : 'same as';
                          return (
                            <>
                              Area avg: <span className="font-semibold">{formatCurrency(exp.area_average)}</span>
                              {' · '}You paid:{' '}
                              <span className="font-semibold">{formatCurrency(exp.amount ?? 0)}</span>
                              {' · '}
                              <span className={diff > 0 ? 'text-red-300 font-semibold' : diff < 0 ? 'text-emerald-300 font-semibold' : 'font-semibold'}>
                                {diff > 0 ? '+' : diff < 0 ? '-' : ''}
                                ${diffLabel}{' '}
                                {pct !== null && pct !== 0 && (
                                  <span>({pct}% {direction})</span>
                                )}
                              </span>
                            </>
                          );
                        })()
                      ) : (
                        <span className="text-gray-500">Benchmarking this price…</span>
                      )}
                    </div>

                    <div className="flex-1 flex justify-end">
                      {(() => {
                        const { label, color } = getDealLabelAndColor(exp.deal_quality);
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] uppercase tracking-wide ${color}`}>
                            <PieChartIcon size={10} />
                            {label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {exp.cheaper_alternative && exp.cheaper_alternative.trim().length > 0 && (
                    <p className="text-[11px] text-emerald-200">
                      Nearby cheaper option: <span className="font-medium">{exp.cheaper_alternative}</span>
                    </p>
                  )}

                  {exp.insight && (
                    <p className="text-xs text-gray-300 leading-relaxed">
                      <Zap size={12} className="inline mr-1 text-purple-400" />
                      {exp.insight}
                    </p>
                  )}
                </div>
              ))}
              {expenses.length === 0 && (
                <p className="text-center text-gray-500 text-sm mt-8">Start your expense diary. Just type what you spent!</p>
              )}
            </div>
          </div>
        )}

        {/* BREAKDOWN TAB */}
        {activeTab === 'breakdown' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h2 className="text-lg font-bold mb-4 text-center">Spending Breakdown</h2>
              {chartData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                  No data to display yet.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}