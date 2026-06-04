import React, { useState, useMemo } from 'react';
import { Plane, ArrowLeft, Calendar, DollarSign, Target, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { calculateTripCost, calculateVacationSavingsTimeline, DESTINATIONS } from '../../logic/vacation-forecaster.mjs';
import { getMonthlySummary } from '../../logic/bank-statement-parser.mjs';

const TravelAgency = () => {
  const navigate = useNavigate();
  const { state } = useGame();
  
  const [goalName, setGoalName] = useState('My Dream Vacation');
  const [selectedDestId, setSelectedDestId] = useState(DESTINATIONS[0].id);
  const [nights, setNights] = useState(5);
  const [currentSaved, setCurrentSaved] = useState(0);

  // Get real surplus from transactions to use as monthly saving
  const monthlySaving = useMemo(() => {
    if (!state.transactions || state.transactions.length === 0) return 200; // Fallback
    const summaries = getMonthlySummary(state.transactions);
    if (summaries.length === 0) return 200;
    // Use last month's net surplus as the monthly saving capacity
    return Math.max(0, summaries[summaries.length - 1].net);
  }, [state.transactions]);

  const tripDetails = useMemo(() => {
    return calculateTripCost(selectedDestId, nights, { includeHiddenCosts: true });
  }, [selectedDestId, nights]);

  const timeline = useMemo(() => {
    return calculateVacationSavingsTimeline(tripDetails.grandTotal, currentSaved, monthlySaving);
  }, [tripDetails.grandTotal, currentSaved, monthlySaving]);

  const destination = DESTINATIONS.find(d => d.id === selectedDestId);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/game')}
          className="flex items-center gap-1 text-green-700 font-bold hover:gap-2 transition-all"
        >
          <ArrowLeft size={20} /> Back to Map
        </button>
        <div className="text-right">
          <h1 className="text-4xl font-black text-green-900 tracking-tight">Travel Agency</h1>
          <p className="text-green-700 font-bold italic">Plan Your Future Rewards</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planner Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-playful bg-white">
            <h3 className="text-xl font-black text-green-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
              <Target className="text-amber-500" /> Goal Setup
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">What are you saving for?</label>
                <input 
                  type="text" 
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-800 focus:border-green-300 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Select Destination</label>
                <div className="grid grid-cols-1 gap-2">
                  {DESTINATIONS.map(dest => (
                    <button 
                      key={dest.id}
                      onClick={() => setSelectedDestId(dest.id)}
                      className={`p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center justify-between ${
                        selectedDestId === dest.id 
                          ? 'bg-green-500 text-white border-green-500 shadow-lg translate-x-2' 
                          : 'bg-white text-gray-600 border-gray-100 hover:border-green-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{dest.emoji}</span> {dest.name}
                      </span>
                      {selectedDestId === dest.id && <Sparkles size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Nights</label>
                  <input 
                    type="number" 
                    value={nights}
                    onChange={(e) => setNights(Number(e.target.value))}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-800 focus:border-green-300 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Already Saved</label>
                  <input 
                    type="number" 
                    value={currentSaved}
                    onChange={(e) => setCurrentSaved(Number(e.target.value))}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-800 focus:border-green-300 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border-4 border-green-100 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <TrendingUp />
              </div>
              <div>
                <h4 className="font-black text-green-800 uppercase tracking-tighter">Budget Sync</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Surplus Used</p>
              </div>
            </div>
            <div className="text-3xl font-black text-green-600">${monthlySaving.toLocaleString()} <span className="text-xs text-gray-400">/ MONTH</span></div>
            <p className="mt-2 text-xs font-bold text-gray-500 italic">
              {state.transactions?.length > 0 
                ? "Penny is using your actual last month surplus to project your timeline!" 
                : " Penny is using a default $200/mo. Upload your statement for a real projection!"}
            </p>
          </div>
        </div>

        {/* Projection Display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-playful bg-amber-400 text-white p-10 relative overflow-hidden">
             <Plane size={200} className="absolute -right-10 -top-10 opacity-10 -rotate-12" />
             
             <div className="relative z-10">
               <h2 className="text-2xl font-black uppercase tracking-widest mb-2 opacity-80">Timeline to {goalName}</h2>
               <div className="flex items-baseline gap-2">
                 <span className="text-8xl font-black tracking-tighter">{timeline.monthsToGoal}</span>
                 <span className="text-3xl font-black uppercase tracking-widest">Months</span>
               </div>
               
               <div className="mt-8">
                 <div className="flex justify-between font-black text-sm uppercase tracking-widest mb-2">
                   <span>Savings Progress</span>
                   <span>{timeline.progressPercent}%</span>
                 </div>
                 <div className="w-full h-8 bg-black/10 rounded-full p-1 overflow-hidden">
                   <div 
                     className="h-full bg-white rounded-full transition-all duration-1000"
                     style={{ width: `${timeline.progressPercent}%` }}
                   ></div>
                 </div>
               </div>

               <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
                   <div className="text-[10px] font-black uppercase opacity-70 mb-1">Total Goal</div>
                   <div className="text-xl font-black">${tripDetails.grandTotal.toLocaleString()}</div>
                 </div>
                 <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
                   <div className="text-[10px] font-black uppercase opacity-70 mb-1">Still Need</div>
                   <div className="text-xl font-black">${timeline.remaining.toLocaleString()}</div>
                 </div>
                 <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
                   <div className="text-[10px] font-black uppercase opacity-70 mb-1">Nights</div>
                   <div className="text-xl font-black">{nights}</div>
                 </div>
                 <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
                   <div className="text-[10px] font-black uppercase opacity-70 mb-1">Est. Date</div>
                   <div className="text-xl font-black">
                     {new Date(Date.now() + timeline.monthsToGoal * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                   </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-playful bg-white">
              <h3 className="text-lg font-black text-green-800 mb-4 uppercase tracking-tighter">Cost Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(tripDetails.breakdown).map(([key, item]) => (
                  <div key={key} className="flex justify-between font-bold text-gray-600 border-b border-gray-50 pb-2">
                    <span className="capitalize">{item.label}</span>
                    <span className="text-gray-800">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                {tripDetails.hiddenCosts.map((hc, i) => (
                  <div key={i} className="flex justify-between font-bold text-amber-500 border-b border-gray-50 pb-2 italic">
                    <span>{hc.name} (Hidden)</span>
                    <span>${hc.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-lg text-green-900 pt-2">
                  <span>Grand Total</span>
                  <span>${tripDetails.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500 p-8 rounded-[3rem] text-white flex flex-col justify-center">
               <h3 className="text-xl font-black uppercase tracking-widest mb-4">Penny's Tip</h3>
               <div className="flex items-start gap-4">
                 <div className="text-4xl animate-bounce">🪙</div>
                 <p className="font-bold italic leading-relaxed">
                   "If you can save just $50 more per month, you'd reach your goal {Math.max(1, timeline.monthsToGoal - Math.ceil(timeline.remaining / (monthlySaving + 50)))} months faster! Can you find $50 of 'Wants' to cut from your budget?"
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAgency;
