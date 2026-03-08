'use client';
import { useState, FormEvent, useEffect } from 'react';
import { Zap, Book, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExpenseData {
  raw: string;
  category?: string;
  amount?: number;
  insight?: string;
}

const COLORS = ['#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#3b82f6'];

export default function CostNote() {
  const [activeTab, setActiveTab] = useState<'diary' | 'breakdown'>('diary');
  const [inputText, setInputText] = useState('');
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // BACKEND SIMULATION: Load saved data when the app starts
  useEffect(() => {
    const savedData = localStorage.getItem('costnote_expenses');
    if (savedData) {
      setExpenses(JSON.parse(savedData));
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center font-bold">C</div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">CostNote</h1>
              <p className="text-xs text-gray-400">Total Tracked: ${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

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
            <div className="bg-gray-800 rounded-xl p-4 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <form onSubmit={handleLogExpense}>
                <textarea 
                  className="w-full bg-transparent text-xl resize-none focus:outline-none mb-4 placeholder-gray-600"
                  placeholder="e.g., coffee 5..."
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
                <div key={idx} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-lg capitalize">{exp.category || "Unknown"}</span>
                    <span className="font-bold text-red-400">${exp.amount?.toFixed(2) || "0.00"}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed"><Zap size={12} className="inline mr-1 text-purple-400"/> {exp.insight}</p>
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