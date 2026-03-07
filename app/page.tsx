'use client';
import { useState, FormEvent } from 'react';
import { Zap } from 'lucide-react';

// 1. The Blueprint: This tells TypeScript exactly what the AI will give us
interface ExpenseData {
  raw: string;
  category?: string;
  amount?: number;
  insight?: string;
}

export default function CostNote() {
  const [inputText, setInputText] = useState('');
  
  // 2. We attach the blueprint to our array so it's no longer type 'never'
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // 3. We tell TypeScript that 'e' is specifically a FormEvent
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
      
      // 🚨 THE SNITCH: This prints the exact AI response to your browser console
      console.log("AI RESPONSE:", aiData); 

      // 🚨 THE GUARD: If there's an error, pop up an alert so we see it
      if (aiData.error) {
        alert("🚨 AI Error: Check your VS Code Terminal for the exact reason!");
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