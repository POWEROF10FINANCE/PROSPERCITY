import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Dices, 
  Trophy, 
  Sparkles, 
  Coins, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Gamepad2,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { calculateDTI } from '../../logic/dti-calculator.mjs';

// --- CONSTANTS ---

const ROULETTE_CATEGORIES = [
  { id: 1, name: 'Rent (1BR)', avg: 1200, icon: '🏠', tip: 'Housing is the biggest expense' },
  { id: 2, name: 'Car Payment', avg: 500, icon: '🚗', tip: 'Always factor in insurance + gas' },
  { id: 3, name: 'Groceries', avg: 350, icon: '🛒', tip: 'Meal prep saves money' },
  { id: 4, name: 'Phone Plan', avg: 75, icon: '📱', tip: 'Compare providers annually' },
  { id: 5, name: 'Electricity', avg: 100, icon: '💡', tip: 'Energy-efficient appliances help' },
  { id: 6, name: 'Health Insurance', avg: 450, icon: '🏥', tip: 'Employer plans are cheaper' },
  { id: 7, name: 'Public Transit', avg: 80, icon: '🚌', tip: 'Cheaper than car ownership' },
  { id: 8, name: 'Dining Out', avg: 200, icon: '☕', tip: 'The "latte factor" adds up' },
  { id: 9, name: 'Streaming/Entertainment', avg: 50, icon: '🎬', tip: 'Audit subscriptions quarterly' },
  { id: 10, name: 'Pet Care', avg: 100, icon: '🐾', tip: 'Pets are a long-term commitment' },
  { id: 11, name: 'Student Loans', avg: 300, icon: '🏫', tip: 'Income-driven plans exist' },
  { id: 12, name: 'Gifts/Holidays', avg: 100, icon: '🎁', tip: 'Budget for holidays year-round' },
];

const INCOME_CARDS = [
  { rank: 'A♠', val: 4000, desc: 'Software Developer' },
  { rank: 'K♠', val: 3200, desc: 'Registered Nurse' },
  { rank: 'Q♠', val: 2800, desc: 'Teacher' },
  { rank: 'J♠', val: 2500, desc: 'Admin Assistant' },
  { rank: '10♠', val: 2000, desc: 'Retail Manager' },
  { rank: '9♠', val: 1800, desc: 'Server/Bartender' },
  { rank: '8♠', val: 1500, desc: 'Freelancer' },
  { rank: '7♠', val: 1200, desc: 'Part-time Worker' },
  { rank: '6♠', val: 800, desc: 'Student/Intern' },
];

const DEBT_CARDS = [
  { rank: 'A♥', val: 1200, desc: 'Mortgage' },
  { rank: 'K♥', val: 500, desc: 'Car Loan' },
  { rank: 'Q♥', val: 400, desc: 'Student Loan' },
  { rank: 'J♥', val: 300, desc: 'Personal Loan' },
  { rank: '10♥', val: 200, desc: 'Credit Card (min)' },
  { rank: '9♥', val: 150, desc: 'Medical Debt' },
  { rank: '8♥', val: 100, desc: 'Buy Now Pay Later' },
  { rank: '7♥', val: 75, desc: 'Subscription Loans' },
  { rank: '6♥', val: 50, desc: 'Small Debt' },
];

const CREDIT_FACTORS = [
  { name: 'Payment History', weight: '35%', desc: 'Your track record of on-time payments' },
  { name: 'Credit Utilization', weight: '30%', desc: 'How much of your available credit you use' },
  { name: 'Length of History', weight: '15%', desc: 'How long you have had credit accounts' },
  { name: 'Credit Mix', weight: '10%', desc: 'The variety of credit types you have' },
  { name: 'New Credit', weight: '10%', desc: 'Don\'t open too many accounts at once' },
  { name: 'Hard Inquiries', weight: '5% (penalty)', desc: 'Each time you apply for a new loan' },
];

const SAVINGS_SCENARIOS = [
  { roll: 1, name: 'EMERGENCY', target: 6000, monthly: 200, question: 'Monthly expenses are $2,000. To build a 3-month fund, how long if you save $200/mo?', options: ['12 months', '24 months', '30 months', '36 months'], correct: 2, explanation: '$2,000 x 3 = $6,000. $6,000 / $200 = 30 months.' },
  { roll: 2, name: 'VACATION', target: 1500, months: 8, question: 'Trip costs $1,500 and is 8 months away. How much do you need to save each month?', options: ['$125.50', '$187.50', '$250.00', '$300.00'], correct: 1, explanation: '$1,500 / 8 = $187.50.' },
  { roll: 3, name: 'BIG PURCHASE', target: 1000, months: 5, question: 'Gaming setup costs $1,000. In 5 months, how much per month?', options: ['$100', '$150', '$200', '$250'], correct: 2, explanation: '$1,000 / 5 = $200.' },
  { roll: 4, name: 'CAR REPAIR', target: 800, months: 3, question: 'Repair costs $800, needed in 3 months. Monthly savings?', options: ['$266.67', '$200.00', '$300.00', '$400.00'], correct: 0, explanation: '$800 / 3 = $266.67.' },
  { roll: 5, name: 'COLLEGE FUND', income: 2500, rate: 0.1, question: 'Monthly income is $2,500. Save 10%. How much in 12 months?', options: ['$1,500', '$2,500', '$3,000', '$4,000'], correct: 2, explanation: '$2,500 x 0.1 = $250. $250 x 12 = $3,000.' },
  { roll: 6, name: 'RAINY DAY', target: 1800, monthly: 150, question: 'Save 1 month expenses ($1,800). If saving $150/mo, how long?', options: ['10 months', '12 months', '15 months', '18 months'], correct: 1, explanation: '$1,800 / $150 = 12 months.' },
];

// --- COMPONENT: CASINO DISTRICT ---

const CasinoDistrict = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [activeGame, setActiveGame] = useState(null);
  
  // Fake local state for streak for now (would be in state usually)
  const streak = 5;
  const multiplier = 1.5;

  if (activeGame) {
    return <GameShell gameId={activeGame} onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="min-h-full bg-[#0A0E27] text-white rounded-[3rem] overflow-hidden shadow-2xl border-4 border-purple-900/30 flex flex-col">
      {/* Header */}
      <header className="p-8 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md">
        <button 
          onClick={() => navigate('/game')}
          className="flex items-center gap-2 text-pink-400 font-black hover:text-pink-300 transition-colors uppercase tracking-widest text-sm"
        >
          <ArrowLeft size={20} /> Back to Map
        </button>
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 uppercase drop-shadow-[0_0_15px_rgba(255,45,142,0.5)]">
            Casino District
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/20 px-4 py-2 rounded-2xl border border-blue-500/50 flex items-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Star size={18} className="text-blue-400 fill-blue-400" />
            <span className="font-black text-xl">{state.stars}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Streak & Stats */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-pink-500/10 p-4 rounded-3xl border-2 border-pink-500/30 shadow-[0_0_20px_rgba(255,45,142,0.1)]">
              <div className="relative">
                <Flame size={32} className="text-pink-500 animate-pulse" />
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0E27]">
                  {streak}
                </span>
              </div>
              <div>
                <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-none mb-1">Current Streak</div>
                <div className="font-black text-lg text-white">5 DAYS 🔥</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-blue-500/10 p-4 rounded-3xl border-2 border-blue-500/30 shadow-[0_0_20px_rgba(0,212,255,0.1)]">
              <TrendingUp size={32} className="text-blue-500" />
              <div>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">XP Multiplier</div>
                <div className="font-black text-lg text-white">{multiplier}x</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 p-4 rounded-3xl border-2 border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Gamepad2 size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Free Spins Remaining</span>
            </div>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(108,43,217,0.5)]"></div>
              ))}
            </div>
          </div>
        </div>

        {/* NPC Intro */}
        <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-30 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-40 h-40 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-[7rem] shadow-2xl relative">
            <div className="absolute inset-0 bg-pink-500/10 rounded-full animate-ping opacity-20"></div>
            🪙
            <div className="absolute -top-4 -right-2 rotate-12 bg-black/80 px-3 py-1 rounded-lg border border-white/20 text-xs font-black">PENNY</div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white/90">
              "Step right up! Let's spin some financial knowledge!"
            </h2>
            <p className="text-white/60 font-bold leading-relaxed max-w-2xl">
              Welcome, high-roller! I'm Penny, your host in the Casino District. 
              In this casino, the house always teaches! We play high-stakes games 
              using chips and real-world financial rules.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['3 Daily Spins', 'Streak Bonuses', 'Star Rewards', 'Real Finance'].map(tag => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          <GameCard 
            id="roulette"
            name="Budgeting Roulette"
            icon="🎰"
            desc="Spin the wheel of life expenses and guess the costs!"
            color="pink"
            stars="3★ MAX"
            onClick={() => setActiveGame('roulette')}
          />
          <GameCard 
            id="blackjack"
            name="DTI Blackjack"
            icon="🃏"
            desc="Draw income and debt cards. Stay under 36% to win!"
            color="blue"
            stars="3★ MAX"
            onClick={() => setActiveGame('blackjack')}
          />
          <GameCard 
            id="flip"
            name="Credit Flip"
            icon="🃏"
            desc="Match credit factors to their impact. Memory is key!"
            color="purple"
            stars="3★ MAX"
            onClick={() => setActiveGame('flip')}
          />
          <GameCard 
            id="dice"
            name="Savings Dice"
            icon="🎲"
            desc="Roll for scenarios and calculate your savings path!"
            color="mint"
            stars="3★ MAX"
            onClick={() => setActiveGame('dice')}
          />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
        <span>Luck is where preparation meets opportunity</span>
        <span>ProsperCity Casino v1.0</span>
      </footer>
    </div>
  );
};

const GameCard = ({ id, name, icon, desc, color, stars, onClick }) => {
  const colors = {
    pink: 'from-pink-600/20 to-pink-900/40 border-pink-500/30 text-pink-500 group-hover:border-pink-500 group-hover:shadow-[0_0_30px_rgba(255,45,142,0.2)]',
    blue: 'from-blue-600/20 to-blue-900/40 border-blue-500/30 text-blue-500 group-hover:border-blue-500 group-hover:shadow-[0_0_30_rgba(0,212,255,0.2)]',
    purple: 'from-purple-600/20 to-purple-900/40 border-purple-500/30 text-purple-500 group-hover:border-purple-500 group-hover:shadow-[0_0_30_rgba(108,43,217,0.2)]',
    mint: 'from-emerald-600/20 to-emerald-900/40 border-emerald-500/30 text-emerald-500 group-hover:border-emerald-500 group-hover:shadow-[0_0_30_rgba(0,255,170,0.2)]',
  };

  return (
    <button 
      onClick={onClick}
      className={`group relative p-8 rounded-[3rem] border-2 bg-gradient-to-br ${colors[color]} text-left transition-all duration-300 hover:-translate-y-2`}
    >
      <div className="flex justify-between items-start mb-6">
        <span className="text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">{icon}</span>
        <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50 border border-white/5">
          {stars}
        </div>
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{name}</h3>
      <p className="text-white/40 font-bold text-sm mb-8 leading-relaxed line-clamp-2">
        {desc}
      </p>
      <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
        <span>Play Round</span>
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};

// --- GAME CONTAINER ---

const GameShell = ({ gameId, onBack }) => {
  return (
    <div className="min-h-full bg-[#0A0E27] text-white rounded-[3rem] overflow-hidden shadow-2xl border-4 border-purple-900/30 flex flex-col animate-pop-in">
      <header className="p-6 flex items-center justify-between border-b border-white/10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 font-black hover:text-white transition-colors uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} /> Quit Game
        </button>
        <div className="font-black uppercase tracking-widest text-sm text-pink-500 drop-shadow-[0_0_10px_rgba(255,45,142,0.3)]">
          {gameId.replace('-', ' ')}
        </div>
        <div className="w-20"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent">
        {gameId === 'roulette' && <RouletteGame />}
        {gameId === 'blackjack' && <BlackjackGame />}
        {gameId === 'flip' && <FlipGame />}
        {gameId === 'dice' && <DiceGame />}
      </div>
    </div>
  );
};

// --- SUB-GAME: BUDGETING ROULETTE ---

const RouletteGame = () => {
  const { dispatch } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [guess, setGuess] = useState(0);
  const [result, setResult] = useState(null);

  const spin = () => {
    setSpinning(true);
    setSelected(null);
    setResult(null);
    setGuess(500);

    setTimeout(() => {
      const winner = ROULETTE_CATEGORIES[Math.floor(Math.random() * ROULETTE_CATEGORIES.length)];
      setSelected(winner);
      setSpinning(false);
    }, 3000);
  };

  const submitGuess = () => {
    const diff = Math.abs(guess - selected.avg);
    const percentOff = (diff / selected.avg) * 100;
    
    let stars = 0;
    let label = '';
    
    if (percentOff <= 10) { stars = 3; label = '🎰🎰🎰 JACKPOT!'; }
    else if (percentOff <= 25) { stars = 2; label = '🎰🎰 GOOD!'; }
    else if (percentOff <= 50) { stars = 1; label = '🎰 OK!'; }
    else { stars = 0; label = '❌ CLOSE!'; }

    setResult({ stars, label });
    if (stars > 0) {
      dispatch({ type: 'EARN_STARS', payload: stars });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 flex flex-col items-center">
      {/* Wheel Visual */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        <div 
          className={`w-full h-full rounded-full border-8 border-white/10 shadow-[0_0_50px_rgba(255,45,142,0.2)] transition-transform duration-[3000ms] cubic-bezier(0.1, 0, 0.1, 1) relative overflow-hidden ${spinning ? 'rotate-[1440deg]' : 'rotate-0'}`}
          style={{ 
            background: `conic-gradient(${ROULETTE_CATEGORIES.map((c, i) => `${i % 2 ? '#FF2D8E' : '#6C2BD9'} ${i * (360/12)}deg ${(i+1) * (360/12)}deg`).join(', ')})`
          }}
        >
          {ROULETTE_CATEGORIES.map((c, i) => (
            <div 
              key={c.id} 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center pt-8"
              style={{ transform: `translate(-50%, -50%) rotate(${i * 30 + 15}deg)` }}
            >
              <span className="text-2xl drop-shadow-lg">{c.icon}</span>
            </div>
          ))}
          <div className="absolute inset-4 rounded-full border-4 border-white/10 pointer-events-none"></div>
        </div>
        {/* Indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        
        {/* Center Button / Selected */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-[#0A0E27] rounded-full border-4 border-white/20 shadow-2xl flex items-center justify-center text-3xl">
            {spinning ? '🌀' : selected ? selected.icon : '🎰'}
          </div>
        </div>
      </div>

      {!selected && !spinning && (
        <button 
          onClick={spin}
          className="bg-pink-600 text-white px-12 py-5 rounded-[2rem] font-black text-2xl shadow-[0_0_30px_rgba(219,39,119,0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          SPIN FOR $1 STAR
        </button>
      )}

      {selected && !spinning && !result && (
        <div className="w-full bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-8 animate-pop-in">
          <div className="text-center">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-pink-400">{selected.name}</h3>
            <p className="text-white/60 font-bold italic">What's the average monthly cost?</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between font-black text-xl px-2">
              <span>$0</span>
              <span className="text-pink-500 text-3xl">${guess}</span>
              <span>$2,000</span>
            </div>
            <input 
              type="range" min="0" max="2000" step="50"
              className="w-full accent-pink-500 h-4 rounded-full appearance-none bg-white/10 cursor-pointer"
              value={guess}
              onChange={(e) => setGuess(parseInt(e.target.value))}
            />
          </div>

          <button 
            onClick={submitGuess}
            className="w-full bg-white text-pink-600 py-5 rounded-3xl font-black text-xl hover:bg-pink-50 transition-colors shadow-xl"
          >
            SUBMIT GUESS
          </button>
        </div>
      )}

      {result && (
        <div className="w-full bg-white/5 p-8 rounded-[3rem] border-2 border-pink-500/50 space-y-6 text-center animate-pop-in">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-pink-500 mb-2">{result.label}</h3>
          <div className="space-y-2">
            <p className="text-xl font-bold">The average for <span className="text-pink-400">{selected.name}</span> is <span className="text-white text-2xl font-black">${selected.avg}/mo</span></p>
            <p className="text-white/50 font-bold italic">"{selected.tip}"</p>
          </div>
          <div className="pt-6 border-t border-white/10">
            <div className="bg-blue-500/20 inline-flex items-center gap-2 px-6 py-2 rounded-full border border-blue-500/50 mb-6">
              <Star className="text-blue-400 fill-blue-400" size={20} />
              <span className="font-black text-xl">+{result.stars} STARS</span>
            </div>
            <button 
              onClick={spin}
              className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-500 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-GAME: DTI BLACKJACK ---

const BlackjackGame = () => {
  const { dispatch } = useGame();
  const [incomes, setIncomes] = useState([]);
  const [debts, setDebts] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, playing, won, push, bust

  const totalIncome = incomes.reduce((sum, c) => sum + c.val, 0);
  const totalDebt = debts.reduce((sum, c) => sum + c.val, 0);
  const dti = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 0;

  const start = () => {
    const inc1 = INCOME_CARDS[Math.floor(Math.random() * INCOME_CARDS.length)];
    const inc2 = INCOME_CARDS[Math.floor(Math.random() * INCOME_CARDS.length)];
    const deb1 = DEBT_CARDS[Math.floor(Math.random() * DEBT_CARDS.length)];
    
    setIncomes([inc1, inc2]);
    setDebts([deb1]);
    setStatus('playing');
  };

  const hit = () => {
    const newDebt = DEBT_CARDS[Math.floor(Math.random() * DEBT_CARDS.length)];
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    
    const newTotalDebt = newDebts.reduce((sum, c) => sum + c.val, 0);
    const newDti = (newTotalDebt / totalIncome) * 100;
    
    if (newDti > 43) {
      setStatus('bust');
    }
  };

  const stand = () => {
    // Convert current cards to format expected by logic engine
    const dtiResult = calculateDTI(totalIncome, debts.map(d => ({ name: d.desc, amount: d.val })));
    
    if (dtiResult.isHealthy) setStatus('won');
    else if (dtiResult.isCaution) setStatus('push');
    else setStatus('bust');
  };

  useEffect(() => {
    if (status === 'won') {
      dispatch({ type: 'EARN_STARS', payload: 2 });
    }
  }, [status]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Table Area */}
      <div className="relative bg-emerald-900/40 rounded-[4rem] border-[12px] border-emerald-900/60 p-12 shadow-2xl min-h-[500px] flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none"></div>
        
        {/* Income Row */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Monthly Income</div>
            {status !== 'idle' && <div className="font-black text-xl text-emerald-400">${totalIncome}</div>}
          </div>
          <div className="flex gap-4 flex-wrap">
            {incomes.map((card, i) => (
              <PlayingCard key={i} card={card} type="income" />
            ))}
            {status === 'idle' && <div className="w-24 h-36 border-2 border-dashed border-white/10 rounded-xl"></div>}
          </div>
        </div>

        {/* Meter */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-full max-w-md h-6 bg-black/40 rounded-full border-2 border-white/10 overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-500 ${dti <= 36 ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : dti <= 43 ? 'bg-amber-400' : 'bg-red-500'}`}
              style={{ width: `${Math.min(dti * 2, 100)}%` }}
            ></div>
            <div className="absolute top-0 left-[72%] w-0.5 h-full bg-white z-10 shadow-[0_0_5px_white]"></div>
            <div className="absolute top-0 left-[86%] w-0.5 h-full bg-red-500/50 z-10"></div>
          </div>
          <div className="flex justify-between w-full max-w-md text-[10px] font-black uppercase text-white/40 px-1">
            <span>0%</span>
            <span className="text-emerald-400">Target 36%</span>
            <span className="text-red-500">Bust 43%</span>
          </div>
          {status !== 'idle' && (
            <div className={`text-4xl font-black italic tracking-tighter mt-2 ${dti <= 36 ? 'text-emerald-400' : dti <= 43 ? 'text-amber-400' : 'text-red-500'}`}>
              DTI: {dti.toFixed(1)}%
            </div>
          )}
        </div>

        {/* Debt Row */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Monthly Debts</div>
            {status !== 'idle' && <div className="font-black text-xl text-red-400">${totalDebt}</div>}
          </div>
          <div className="flex gap-4 flex-wrap">
            {debts.map((card, i) => (
              <PlayingCard key={i} card={card} type="debt" />
            ))}
            {status === 'idle' && <div className="w-24 h-36 border-2 border-dashed border-white/10 rounded-xl"></div>}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-6">
        {status === 'idle' && (
          <button 
            onClick={start}
            className="bg-blue-600 text-white px-16 py-6 rounded-[2rem] font-black text-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
          >
            Deal me in!
          </button>
        )}
        
        {status === 'playing' && (
          <>
            <button 
              onClick={hit}
              className="flex-1 bg-red-600 text-white py-6 rounded-3xl font-black text-2xl hover:bg-red-500 shadow-xl transition-all uppercase"
            >
              HIT (Add Debt)
            </button>
            <button 
              onClick={stand}
              className="flex-1 bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl hover:bg-emerald-500 shadow-xl transition-all uppercase"
            >
              STAND (Stay)
            </button>
          </>
        )}

        {(status === 'won' || status === 'push' || status === 'bust') && (
          <div className="w-full text-center space-y-6 animate-pop-in">
            <div className={`p-8 rounded-[3rem] border-4 ${status === 'won' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : status === 'push' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-red-500/20 border-red-500 text-red-500'}`}>
              <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-4">
                {status === 'won' ? '🎉 WINNER!' : status === 'push' ? '⚠️ PUSH' : '💥 BUSTED!'}
              </h3>
              <p className="text-xl font-bold text-white/80 max-w-md mx-auto">
                {status === 'won' ? 'Great debt management! Lenders love seeing a DTI under 36%.' : 
                 status === 'push' ? 'You are in the gray zone (36-43%). Most lenders prefer lower!' : 
                 'Whoops! Too much debt for this income. In real life, this leads to rejected loans.'}
              </p>
              {status === 'won' && (
                <div className="mt-6 flex items-center justify-center gap-2 text-blue-400">
                  <Star size={24} className="fill-current" />
                  <span className="text-3xl font-black">+2 STARS</span>
                </div>
              )}
            </div>
            <button 
              onClick={start}
              className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/90 transition-colors shadow-2xl"
            >
              Play Another Hand
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PlayingCard = ({ card, type }) => (
  <div className={`w-24 h-36 bg-white rounded-xl shadow-2xl flex flex-col justify-between p-3 animate-pop-in border-4 ${type === 'income' ? 'border-emerald-500' : 'border-red-500'}`}>
    <div className={`font-black text-lg ${type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{card.rank}</div>
    <div className="text-center">
      <div className="text-black font-black text-lg">${card.val}</div>
      <div className="text-[8px] font-black uppercase text-gray-400 leading-none">{card.desc}</div>
    </div>
    <div className={`font-black text-lg self-end rotate-180 ${type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{card.rank}</div>
  </div>
);

// --- SUB-GAME: CREDIT FLIP ---

const FlipGame = () => {
  const { dispatch } = useGame();
  const [level, setLevel] = useState('medium');
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    init();
  }, [level]);

  const init = () => {
    const numPairs = level === 'easy' ? 3 : 6;
    const subset = [...CREDIT_FACTORS].sort(() => Math.random() - 0.5).slice(0, numPairs);
    const cards = [];
    subset.forEach(f => {
      cards.push({ id: `f-${f.name}`, content: f.name, type: 'factor', match: f.weight });
      cards.push({ id: `w-${f.name}`, content: f.weight, type: 'weight', match: f.name });
    });
    setDeck(cards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setComplete(false);
  };

  const handleFlip = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) return;
    
    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const c1 = deck.find(c => c.id === newFlipped[0]);
      const c2 = deck.find(c => c.id === newFlipped[1]);
      
      if (c1.match === c2.content || c2.match === c1.content) {
        setMatched(m => [...m, c1.id, c2.id]);
        setFlipped([]);
        if (matched.length + 2 === deck.length) {
          setComplete(true);
          dispatch({ type: 'EARN_STARS', payload: level === 'easy' ? 1 : level === 'medium' ? 2 : 3 });
        }
      } else {
        setTimeout(() => setFlipped([]), 1500);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
        <div className="flex gap-2">
          {['easy', 'medium', 'hard'].map(l => (
            <button 
              key={l} 
              onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${level === l ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(108,43,217,0.5)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-6 font-black uppercase tracking-widest text-xs">
          <div className="text-purple-400">Moves: <span className="text-white">{moves}</span></div>
          <div className="text-purple-400">Matched: <span className="text-white">{matched.length / 2} / {deck.length / 2}</span></div>
        </div>
      </div>

      {!complete ? (
        <div className={`grid gap-4 ${level === 'easy' ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {deck.map((card) => {
            const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
            const isMatched = matched.includes(card.id);
            
            return (
              <div 
                key={card.id}
                onClick={() => handleFlip(card)}
                className="aspect-[3/4] perspective-1000 cursor-pointer group"
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-purple-900/50 border-2 border-purple-500/30 rounded-2xl flex items-center justify-center text-5xl shadow-xl group-hover:border-purple-500/60 transition-colors">
                    <ShieldCheck size={48} className="text-purple-500/20" />
                  </div>
                  {/* Back */}
                  <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 flex flex-col items-center justify-center p-4 text-center ${isMatched ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-white border-white'}`}>
                    <div className={`font-black uppercase leading-tight ${isMatched ? 'text-emerald-400' : 'text-purple-900'} ${card.type === 'factor' ? 'text-[10px]' : 'text-2xl'}`}>
                      {card.content}
                    </div>
                    {isMatched && (
                      <div className="mt-2">
                        <CheckCircle2 size={24} className="text-emerald-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/5 p-12 rounded-[3rem] border-2 border-purple-500/50 text-center space-y-8 animate-pop-in">
          <div className="w-32 h-32 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto text-6xl shadow-2xl">🏆</div>
          <h3 className="text-5xl font-black uppercase italic tracking-tighter text-purple-500">MATCH MASTER!</h3>
          <p className="text-xl font-bold text-white/60">You matched all the credit factors in {moves} moves!</p>
          <div className="bg-blue-500/20 inline-flex items-center gap-2 px-8 py-3 rounded-full border border-blue-500/50">
            <Star className="text-blue-400 fill-blue-400" size={24} />
            <span className="text-3xl font-black">+{level === 'easy' ? 1 : level === 'medium' ? 2 : 3} STARS</span>
          </div>
          <div className="pt-8">
            <button 
              onClick={init}
              className="bg-purple-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-500 transition-colors shadow-xl"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-GAME: SAVINGS DICE ---

const DiceGame = () => {
  const { dispatch } = useGame();
  const [rolling, setRolling] = useState(false);
  const [scenario, setScenario] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const roll = () => {
    setRolling(true);
    setScenario(null);
    setUserAnswer(null);
    setFeedback(null);
    
    setTimeout(() => {
      const num = Math.floor(Math.random() * 6) + 1;
      setScenario(SAVINGS_SCENARIOS.find(s => s.roll === num));
      setRolling(false);
    }, 1500);
  };

  const checkAnswer = (idx) => {
    setUserAnswer(idx);
    if (idx === scenario.correct) {
      setFeedback('correct');
      dispatch({ type: 'EARN_STARS', payload: 3 });
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 flex flex-col items-center">
      {/* 3D Dice Visual */}
      <div className={`w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-black text-6xl shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all duration-300 ${rolling ? 'animate-bounce' : ''}`}>
        {rolling ? '🎲' : scenario ? ['⚀','⚁','⚂','⚃','⚄','⚅'][scenario.roll-1] : '🎲'}
      </div>

      {!scenario && !rolling && (
        <button 
          onClick={roll}
          className="bg-emerald-600 text-white px-16 py-6 rounded-[2rem] font-black text-2xl shadow-[0_0_30px_rgba(5,150,105,0.4)] hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
        >
          Roll for Scenario
        </button>
      )}

      {scenario && !rolling && (
        <div className="w-full space-y-8 animate-pop-in">
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
            <div className="flex justify-between items-center">
              <span className="bg-emerald-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{scenario.name}</span>
              <div className="text-white/40 flex items-center gap-1">
                <HelpCircle size={14} />
                <span className="text-[10px] font-black uppercase">Savings Logic</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-white leading-tight">{scenario.question}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {scenario.options.map((opt, i) => (
                <button 
                  key={i}
                  disabled={feedback === 'correct'}
                  onClick={() => checkAnswer(i)}
                  className={`p-6 rounded-2xl font-black text-xl border-2 transition-all ${
                    userAnswer === i 
                      ? (i === scenario.correct ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-red-500 border-red-400 text-white')
                      : 'bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/10 text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {feedback && (
            <div className={`p-8 rounded-[3rem] border-4 text-center space-y-4 animate-pop-in ${feedback === 'correct' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-500'}`}>
              <h4 className="text-3xl font-black uppercase italic tracking-tighter">
                {feedback === 'correct' ? '🎲 JACKPOT!' : '🎲 TRY AGAIN!'}
              </h4>
              <p className="font-bold text-white/80">
                {feedback === 'correct' ? scenario.explanation : 'Not quite right. Think about the math!'}
              </p>
              {feedback === 'correct' ? (
                <div className="pt-4 space-y-6">
                  <div className="bg-blue-500/20 inline-flex items-center gap-2 px-6 py-2 rounded-full border border-blue-500/50">
                    <Star className="text-blue-400 fill-blue-400" size={20} />
                    <span className="font-black text-xl">+3 STARS</span>
                  </div>
                  <button onClick={roll} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors">
                    Next Roll
                  </button>
                </div>
              ) : (
                <p className="text-sm font-black text-white/40 uppercase tracking-widest pt-2">Pick another option!</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CasinoDistrict;
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
