import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GameShell from './components/layout/GameShell';
import WorldMap from './components/locations/WorldMap';
import HomeBase from './components/locations/HomeBase';
import UploadCenter from './components/locations/UploadCenter';
import CreditRepairHub from './components/locations/CreditRepairHub';
import HowToLibrary from './components/locations/HowToLibrary';
import TravelAgency from './components/locations/TravelAgency';
import CasinoDistrict from './components/locations/CasinoDistrict';
import { 
  EmergencyHQ, 
  ConfidenceCorner, 
  InvestmentIsland 
} from './components/locations/Placeholders';

const TitleScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-green-500 flex flex-col items-center justify-center p-4 text-white text-center">
      <div className="w-48 h-48 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center mb-8 rotate-6 animate-pulse-soft">
        <span className="text-8xl">🌱</span>
      </div>
      <h1 className="text-6xl font-black mb-2 drop-shadow-lg tracking-tight">ProsperCity</h1>
      <p className="text-2xl font-bold mb-12 opacity-90 italic">"Learn Money. Live Rich."</p>
      
      <button 
        onClick={() => navigate('/onboarding')}
        className="btn-playful bg-white text-green-600 text-2xl px-12 py-5 shadow-2xl hover:scale-110 active:scale-95"
      >
        TAP TO START
      </button>

      <div className="mt-16 text-sm opacity-70 font-bold uppercase tracking-widest">
        Parent? Set up here →
      </div>
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md w-full animate-pop-in">
        <h2 className="text-3xl font-black text-green-800 mb-6">Welcome to ProsperCity!</h2>
        <div className="space-y-6 text-left">
          <div className="card-playful p-8 bg-green-50">
            <p className="text-lg font-bold text-green-900 leading-snug">
              "Hi! I'm Penny. I'll help you grow your financial roots. Let's get started!"
            </p>
          </div>
          <button 
            onClick={() => navigate('/game')}
            className="w-full btn-playful text-xl"
          >
            I'M READY!
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<TitleScreen />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/game" element={<GameShell />}>
        <Route index element={<WorldMap />} />
        <Route path="home" element={<HomeBase />} />
        <Route path="upload" element={<UploadCenter />} />
        <Route path="credit" element={<CreditRepairHub />} />
        <Route path="travel" element={<TravelAgency />} />
        <Route path="casino" element={<CasinoDistrict />} />
        <Route path="emergency" element={<EmergencyHQ />} />
        <Route path="confidence" element={<ConfidenceCorner />} />
        <Route path="investment" element={<InvestmentIsland />} />
        <Route path="library" element={<HowToLibrary />} />
        {/* Legacy redirect or alternate mapping if needed */}
        <Route path="bank" element={<CreditRepairHub />} />
      </Route>
    </Routes>
  );
}

export default App;
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
