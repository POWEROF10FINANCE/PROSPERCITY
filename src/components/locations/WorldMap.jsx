import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { Home, Landmark, Plane, ShieldAlert, Sparkles, TrendingUp, Lock, ShieldCheck, BookOpen, Upload, Dices } from 'lucide-react';

const WorldMap = () => {
  const { state } = useGame();
  const navigate = useNavigate();

  const locations = [
    { id: 'home', path: '/game/home', name: 'Home Base', icon: <Home size={40} />, color: 'bg-blue-400', stars: 3 },
    { id: 'casino', path: '/game/casino', name: 'Casino District', icon: <Dices size={40} />, color: 'bg-gradient-to-br from-amber-400 to-purple-600', stars: 0 },
    { id: 'upload', path: '/game/upload', name: 'Bank Upload', icon: <Upload size={40} />, color: 'bg-indigo-400', stars: 0 },
    { id: 'credit', path: '/game/credit', name: 'Credit Clinic', icon: <ShieldCheck size={40} />, color: 'bg-indigo-600', stars: 2 },
    { id: 'travel', path: '/game/travel', name: 'Travel Agency', icon: <Plane size={40} />, color: 'bg-amber-400', stars: 4 },
    { id: 'emergency', path: '/game/emergency', name: 'Emergency HQ', icon: <ShieldAlert size={40} />, color: 'bg-green-500', stars: 4 },
    { id: 'library', path: '/game/library', name: 'How-To Library', icon: <BookOpen size={40} />, color: 'bg-cyan-500', stars: 5 },
    { id: 'confidence', path: '/game/confidence', name: 'Confidence Corner', icon: <Sparkles size={40} />, color: 'bg-purple-400', stars: 0 },
    { id: 'investment', path: '/game/investment', name: 'Investment Island', icon: <TrendingUp size={40} />, color: 'bg-emerald-400', stars: 5 },
  ];

  return (
    <div className="py-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-green-900 tracking-tight underline decoration-green-300 decoration-8 underline-offset-4 uppercase">World Map</h2>
        <p className="text-green-700 font-bold italic mt-2">Manage your money, learn the rules, grow your roots!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {locations.map((loc) => {
          const isUnlocked = state.unlockedLocations.includes(loc.path) || 
                             ['home', 'credit', 'library', 'upload', 'casino'].includes(loc.id);
          
          return (
            <button
              key={loc.id}
              onClick={() => isUnlocked && navigate(loc.path)}
              disabled={!isUnlocked}
              className={`relative group aspect-square rounded-[2.5rem] flex flex-col items-center justify-center transition-all border-b-8 border-r-8 ${
                isUnlocked 
                  ? `${loc.color} border-black/10 hover:-translate-y-2 hover:shadow-2xl cursor-pointer` 
                  : 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-70'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute top-4 right-4 bg-white/80 p-1.5 rounded-full shadow-sm">
                  <Lock size={16} className="text-gray-500" />
                </div>
              )}
              
              <div className={`mb-3 p-4 rounded-3xl bg-white/20 text-white shadow-inner ${isUnlocked ? 'animate-pulse-soft' : ''}`}>
                {loc.icon}
              </div>
              
              <span className={`font-black text-xs md:text-sm ${isUnlocked ? 'text-white' : 'text-gray-400'} drop-shadow-sm uppercase tracking-tight`}>
                {loc.name}
              </span>

              {isUnlocked ? (
                <div className="mt-2 flex gap-0.5">
                  {loc.stars > 0 && [...Array(loc.stars)].map((_, i) => (
                    <span key={i} className="text-amber-300 text-[10px]">⭐</span>
                  ))}
                  {loc.stars === 0 && <span className="text-white/50 text-[10px] font-black uppercase">Start</span>}
                </div>
              ) : (
                <div className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Locked</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorldMap;
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
