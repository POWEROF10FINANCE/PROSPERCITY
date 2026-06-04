import React, { useState, useMemo } from 'react';
import { PiggyBank, Receipt, Wallet, ArrowLeft, Sparkles, Plus, Trash2, Upload, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { calculateBudget, getHealthRating } from '../../logic/budget-engine.mjs';
import { getMonthlySummary } from '../../logic/bank-statement-parser.mjs';

const HomeBase = () => {
  const navigate = useNavigate();
  const { state } = useGame();
  
  const [viewMonth, setViewMonth] = useState('current'); // 'current' or 'last'
  const [manualSavingsGoal, setSavingsGoal] = useState(500);

  // Process real transactions if available
  const monthlySummaries = useMemo(() => {
    if (!state.transactions || state.transactions.length === 0) return null;
    return getMonthlySummary(state.transactions);
  }, [state.transactions]);

  // Determine current and last month data
  const data = useMemo(() => {
    if (!monthlySummaries || monthlySummaries.length === 0) {
      // Fallback/Mock data if no transactions
      return {
        income: 2500,
        expenses: 1800,
        surplus: 700,
        monthName: 'Demo Mode'
      };
    }

    const current = monthlySummaries[monthlySummaries.length - 1];
    const last = monthlySummaries.length > 1 ? monthlySummaries[monthlySummaries.length - 2] : current;
    
    const active = viewMonth === 'current' ? current : last;
    
    return {
      income: active.income,
      expenses: active.expenses,
      surplus: active.net,
      monthName: active.month,
      topCategories: active.topCategories
    };
  }, [monthlySummaries, viewMonth]);

  // Calculate budget health using real or fallback data
  // Note: for real data, we don't have the full expense array yet, 
  // but we can pass the totals or a simplified array.
  const budget = useMemo(() => {
    const mockExpenses = [
      { category: 'needs', name: 'Total Expenses', amount: data.expenses }
    ];
    return calculateBudget(data.income, mockExpenses, manualSavingsGoal);
  }, [data.income, data.expenses, manualSavingsGoal]);

  const healthRating = getHealthRating(budget.healthScore);

  const healthColors = {
    excellent: 'text-green-500',
    good: 'text-blue-500',
    fair: 'text-amber-500',
    'needs-attention': 'text-orange-500',
    critical: 'text-red-500'
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/game')}
          className="flex items-center gap-1 text-green-700 font-bold hover:gap-2 transition-all"
        >
          <ArrowLeft size={20} /> Back to Map
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/game/upload')}
            className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-xl font-black hover:bg-indigo-600 transition-all text-sm shadow-md"
          >
            <Upload size={16} /> UPLOAD STATEMENT
          </button>
        </div>
      </header>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-green-900 tracking-tight">Dashboard</h1>
          <p className="text-green-700 font-bold italic">Rich Roots Method™ Live</p>
        </div>
        
        {monthlySummaries && (
          <div className="bg-white p-1 rounded-2xl border-2 border-green-100 flex shadow-sm">
            <button 
              onClick={() => setViewMonth('last')}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${viewMonth === 'last' ? 'bg-green-500 text-white' : 'text-gray-400'}`}
            >
              LAST MONTH
            </button>
            <button 
              onClick={() => setViewMonth('current')}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${viewMonth === 'current' ? 'bg-green-500 text-white' : 'text-gray-400'}`}
            >
              THIS MONTH
            </button>
          </div>
        )}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-playful border-green-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
            <Wallet size={32} />
          </div>
          <h3 className="text-xl font-black text-green-800 uppercase tracking-tighter">Real Income</h3>
          <div className="text-4xl font-black text-green-600 mt-2">${data.income.toLocaleString()}</div>
          <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">{data.monthName}</p>
        </div>

        <div className="card-playful border-red-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
            <Receipt size={32} />
          </div>
          <h3 className="text-xl font-black text-red-800 uppercase tracking-tighter">Real Expenses</h3>
          <div className="text-4xl font-black text-red-600 mt-2">${data.expenses.toLocaleString()}</div>
          <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">Needs & Wants</p>
        </div>

        <div className="card-playful border-blue-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
            <PiggyBank size={32} />
          </div>
          <h3 className="text-xl font-black text-blue-800 uppercase tracking-tighter">Savings Goal</h3>
          <div className="text-4xl font-black text-blue-600 mt-2">${manualSavingsGoal.toLocaleString()}</div>
          <input 
            type="range" min="0" max="5000" step="50" 
            value={manualSavingsGoal} onChange={(e) => setSavingsGoal(Number(e.target.value))}
            className="w-full mt-4 accent-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score */}
        <div className="bg-white p-8 rounded-[2.5rem] border-4 border-green-100 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-green-900 uppercase tracking-tight">Budget Health</h3>
            <p className="text-gray-500 font-bold">Rich Roots Score</p>
            <div className="mt-4 flex gap-2">
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${data.surplus >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {data.surplus >= 0 ? 'Surplus' : 'Deficit'}
              </div>
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {budget.savingsRate}% Savings
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-7xl font-black ${healthColors[healthRating]}`}>{budget.healthScore}</div>
            <div className={`text-xs font-black uppercase tracking-widest ${healthColors[healthRating]}`}>{healthRating}</div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="card-playful bg-white">
          <h3 className="text-xl font-black text-green-800 mb-4 uppercase tracking-tighter">Top Spending</h3>
          <div className="space-y-3">
            {data.topCategories ? data.topCategories.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-black text-gray-700 mb-1">
                  <span>{cat.name}</span>
                  <span>${cat.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${cat.percent}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-300 font-bold italic">
                Upload data to see spending breakdown
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-playful bg-white border-green-50">
        <h3 className="text-xl font-black text-green-800 mb-4 uppercase tracking-tighter flex items-center gap-2">
           <Sparkles size={20} className="text-amber-400" /> Penny's Insights
        </h3>
        <div className="flex items-start gap-4">
          <div className="text-5xl animate-bounce">🪙</div>
          <div className="bg-green-50 p-6 rounded-3xl border-2 border-green-100 text-green-900 font-bold italic shadow-inner">
            {data.surplus > 0 
              ? `You had a surplus of $${data.surplus.toLocaleString()} in ${data.monthName}! That's money you can put towards your future goals. Keep those Rich Roots growing!` 
              : `Watch out! You had a deficit of $${Math.abs(data.surplus).toLocaleString()} in ${data.monthName}. Try cutting back on non-essentials to get back in the green.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBase;
