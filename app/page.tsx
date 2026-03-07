'use client';
import { useState } from 'react';
import { Zap } from 'lucide-react';

export default function CostNote() {
  const [inputText, setInputText] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [isParsing, setIsParsing] = useState(false);

  const handleLogExpense = async (e) => {
    e.preventDefault();
    if (!inputText) return;
    setIsParsing(true);

    try {
      // Call our Next.js API route
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: inputText })
      });
      
      const aiData = await res.json();
      
      setExpenses([{ raw: inputText, ...aiData }, ...expenses]);
      setInputText('');
    } catch (error) {
      console.error("Error logging expense");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold">CostNote</h1>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <form onSubmit={handleLogExpense}>
            <textarea 
              className="w-full bg-transparent text-xl resize-none focus:outline-none mb-4"
              placeholder="coffee 5..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit" disabled={isParsing}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full"
            >
              {isParsing ? "Parsing AI..." : "Log expense"}
            </button>
          </form>
        </div>

        {/* Display the AI Results */}
        <div className="space-y-4">
          {expenses.map((exp, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-xl border border-purple-500/30">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-lg capitalize">{exp.category}</span>
                <span className="font-bold text-red-400">${exp.amount}</span>
              </div>
              <p className="text-xs text-gray-300"><Zap size={12} className="inline mr-1"/> {exp.insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}