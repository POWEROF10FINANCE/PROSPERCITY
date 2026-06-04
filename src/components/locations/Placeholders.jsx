import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Plane, ShieldAlert, Sparkles, TrendingUp, RefreshCw } from 'lucide-react';

// Logic Engines
import { calculateDTI, DTI_RATINGS } from '../../logic/dti-calculator.mjs';
import { calculateTripCost } from '../../logic/vacation-forecaster.mjs';
import { calculateEmergencyFundTarget } from '../../logic/emergency-fund-planner.mjs';
import { getRandomAffirmation } from '../../logic/affirmation-engine.mjs';

const LocationShell = ({ name, icon, description, children }) => {
  const navigate = useNavigate();

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
          <h1 className="text-4xl font-black text-green-900 tracking-tight flex items-center justify-end gap-2">
            {icon} {name}
          </h1>
          <p className="text-green-700 font-bold">{description}</p>
        </div>
      </header>
      {children}
    </div>
  );
};

export const TheBank = () => {
  const [income, setIncome] = useState(3000);
  const [debt, setDebt] = useState(1000);
  
  const dti = useMemo(() => calculateDTI(income, debt), [income, debt]);

  return (
    <LocationShell name="The Bank" icon={<Landmark />} description="Debt-to-Income (DTI) Simulator">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-playful bg-white">
          <h3 className="text-xl font-black text-green-800 mb-6 uppercase tracking-tighter">Loan Readiness</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Monthly Gross Income</label>
              <input 
                type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full p-4 rounded-2xl border-2 border-green-50 font-black text-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Total Monthly Debt</label>
              <input 
                type="number" value={debt} onChange={(e) => setDebt(Number(e.target.value))}
                className="w-full p-4 rounded-2xl border-2 border-green-50 font-black text-2xl"
              />
            </div>
          </div>
        </div>

        <div className="card-playful bg-green-500 text-white flex flex-col items-center justify-center text-center">
          <div className="text-sm font-black uppercase tracking-[0.2em] mb-2 opacity-80">Your DTI Ratio</div>
          <div className="text-7xl font-black mb-4">{dti.ratio}%</div>
          <div className="bg-white/20 px-6 py-2 rounded-full font-black text-xl uppercase tracking-widest mb-4">
            {dti.rating}
          </div>
          <p className="font-bold max-w-[200px]">
            Banks like to see a DTI below 36%. You're in the <span className="underline italic">"{dti.rating}"</span> zone!
          </p>
        </div>
      </div>
    </LocationShell>
  );
};

export const TravelAgency = () => {
  const [destination, setDestination] = useState('tropical');
  const [nights, setNights] = useState(5);
  
  const cost = useMemo(() => calculateTripCost(destination, nights), [destination, nights]);

  return (
    <LocationShell name="Travel Agency" icon={<Plane />} description="Vacation Cost Forecaster">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-playful bg-white">
          <h3 className="text-xl font-black text-green-800 mb-6 uppercase tracking-tighter">Plan Your Getaway</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Destination Type</label>
              <select 
                value={destination} onChange={(e) => setDestination(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-green-50 font-black text-xl bg-white"
              >
                <option value="tropical">Tropical Beach 🏖️</option>
                <option value="city">Big City 🏙️</option>
                <option value="mountains">Mountain Cabin 🏔️</option>
                <option value="theme-park">Theme Park 🎢</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Number of Nights</label>
              <input 
                type="number" value={nights} onChange={(e) => setNights(Number(e.target.value))}
                className="w-full p-4 rounded-2xl border-2 border-green-50 font-black text-2xl"
              />
            </div>
          </div>
        </div>

        <div className="card-playful bg-amber-400 text-white flex flex-col items-center justify-center text-center">
          <div className="text-sm font-black uppercase tracking-[0.2em] mb-2 opacity-80">Estimated Cost</div>
          <div className="text-7xl font-black mb-4">${cost.total.toLocaleString()}</div>
          <div className="space-y-1 font-bold">
            <div className="flex justify-between w-48 border-b border-white/30 pb-1">
              <span>Flights</span> <span>${cost.baseFlights}</span>
            </div>
            <div className="flex justify-between w-48 border-b border-white/30 pb-1">
              <span>Lodging</span> <span>${cost.baseLodging * nights}</span>
            </div>
            <div className="flex justify-between w-48">
              <span>Daily Spending</span> <span>${cost.dailySpending * nights}</span>
            </div>
          </div>
        </div>
      </div>
    </LocationShell>
  );
};

export const EmergencyHQ = () => {
  const [expenses, setExpenses] = useState(2000);
  const target = useMemo(() => calculateEmergencyFundTarget(expenses), [expenses]);

  return (
    <LocationShell name="Emergency HQ" icon={<ShieldAlert />} description="Rainy Day Fund Planner">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-playful bg-white">
          <h3 className="text-xl font-black text-green-800 mb-6 uppercase tracking-tighter">Stability Check</h3>
          <div>
            <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Monthly Living Expenses</label>
            <input 
              type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full p-4 rounded-2xl border-2 border-green-50 font-black text-2xl"
            />
            <p className="mt-4 text-gray-500 font-bold leading-tight">
              An emergency fund should cover 3 to 6 months of your absolute needs.
            </p>
          </div>
        </div>

        <div className="card-playful bg-blue-500 text-white flex flex-col items-center justify-center text-center">
          <div className="text-sm font-black uppercase tracking-[0.2em] mb-2 opacity-80">6-Month Target</div>
          <div className="text-7xl font-black mb-4">${target.conservative.toLocaleString()}</div>
          <div className="bg-white/20 px-6 py-2 rounded-full font-black text-lg uppercase tracking-widest">
            Safe Zone
          </div>
          <div className="mt-6 flex gap-4 text-xs font-black">
            <div className="text-center">
              <div className="opacity-70">3 MONTHS</div>
              <div>${target.minimum.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="opacity-70">RECOMMENDED</div>
              <div>${target.recommended.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </LocationShell>
  );
};

export const ConfidenceCorner = () => {
  const [affirmation, setAffirmation] = useState(getRandomAffirmation());
  
  const refresh = () => setAffirmation(getRandomAffirmation());

  return (
    <LocationShell name="Confidence Corner" icon={<Sparkles />} description="Rich Roots Method™ Mindset">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="card-playful bg-white border-purple-100 p-12 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>
          <div className="text-6xl mb-8">✨</div>
          <blockquote className="text-3xl font-black text-purple-900 italic leading-tight mb-8">
            "{affirmation.text}"
          </blockquote>
          <div className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-10">
            {affirmation.tags[0]}
          </div>
          
          <button 
            onClick={refresh}
            className="flex items-center gap-2 mx-auto bg-purple-600 text-white px-8 py-4 rounded-2xl font-black hover:scale-110 active:scale-95 transition-all shadow-xl"
          >
            <RefreshCw size={20} /> NEW AFFIRMATION
          </button>
        </div>
      </div>
    </LocationShell>
  );
};

export const InvestmentIsland = () => (
  <LocationShell name="Investment Island" icon={<TrendingUp />} description="Stocks & Growth">
    <div className="bg-white p-16 rounded-[4rem] border-8 border-dashed border-green-100 flex flex-col items-center justify-center text-center">
      <div className="text-8xl mb-6 animate-bounce">🏝️</div>
      <h2 className="text-3xl font-black text-green-800 tracking-tight">Expanding Soon!</h2>
      <p className="text-green-600 font-bold mt-4 max-w-sm text-lg leading-tight">
        The market is closed for maintenance. We're currently building the Stock Market Simulator.
      </p>
      <button 
        onClick={() => window.history.back()}
        className="mt-10 btn-playful text-lg"
      >
        GO BACK
      </button>
    </div>
  </LocationShell>
);
