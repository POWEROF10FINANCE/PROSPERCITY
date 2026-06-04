import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  Plane, 
  ShieldAlert, 
  Sparkles, 
  Lock,
  Coins,
  Star,
  Map as MapIcon,
  BookOpen,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

const GameShell = () => {
  const { state } = useGame();
  const location = useLocation();
  
  const navItems = [
    { to: '/game', icon: <MapIcon size={20} />, label: 'Map' },
    { to: '/game/home', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/game/upload', icon: <Upload size={20} />, label: 'Upload' },
    { to: '/game/credit', icon: <ShieldCheck size={20} />, label: 'Credit' },
    { to: '/game/library', icon: <BookOpen size={20} />, label: 'Library' },
  ];

  const sideNavItems = [
    ...navItems,
    { to: '/game/travel', icon: <Plane size={20} />, label: 'Travel' },
    { to: '/game/emergency', icon: <ShieldAlert size={20} />, label: 'Emergency' },
    { to: '/game/investment', icon: <TrendingUp size={20} />, label: 'Invest' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f0fdf4]">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r-4 border-green-100 flex-col sticky top-0 h-screen z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg rotate-3">P</div>
            <span className="font-black text-2xl tracking-tight text-green-800">ProsperCity</span>
          </div>

          <nav className="space-y-2">
            {sideNavItems.map((item) => {
              const isUnlocked = state.unlockedLocations.includes(item.to) || 
                                 ['/game', '/game/home', '/game/library', '/game/credit', '/game/upload'].includes(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={isUnlocked ? item.to : '#'}
                  onClick={(e) => !isUnlocked && e.preventDefault()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-4 rounded-2xl font-black transition-all ${
                      !isUnlocked 
                        ? 'opacity-30 grayscale cursor-not-allowed text-gray-400' 
                        : isActive 
                          ? 'bg-green-500 text-white shadow-lg -translate-y-1' 
                          : 'text-gray-500 hover:bg-green-50 hover:text-green-600'
                    }`
                  }
                >
                  {isUnlocked ? item.icon : <Lock size={20} />}
                  <span className="uppercase tracking-tight text-sm">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="bg-amber-50 p-4 rounded-3xl border-2 border-amber-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Coins size={20} className="text-amber-500" />
              <span className="font-black text-amber-800">{state.coins}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={20} className="text-blue-500 fill-blue-500" />
              <span className="font-black text-blue-800">{state.stars}</span>
            </div>
          </div>
          <div className="text-[10px] font-black text-gray-300 text-center uppercase tracking-widest">
            Rich Roots Method™ v1.0
          </div>
        </div>
      </aside>

      {/* Top Mobile Bar */}
      <header className="md:hidden bg-white border-b-4 border-green-100 px-4 py-2 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner rotate-3">P</div>
          <span className="font-black text-2xl tracking-tight text-green-800">ProsperCity</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-50 px-3 py-1 rounded-full border-2 border-amber-200 flex items-center gap-1.5 shadow-sm">
            <Coins size={16} className="text-amber-500" />
            <span className="font-black text-amber-800 text-sm">{state.coins}</span>
          </div>
          <div className="bg-blue-50 px-3 py-1 rounded-full border-2 border-blue-200 flex items-center gap-1.5 shadow-sm">
            <Star size={16} className="text-blue-500 fill-blue-500" />
            <span className="font-black text-blue-800 text-sm">{state.stars}</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-slide-up">
          <Outlet />
        </div>
      </main>

      {/* NPC Context Bar (Floating) */}
      <div className="fixed bottom-20 md:bottom-8 right-4 left-4 md:left-auto md:w-80 z-40">
        <div className="bg-white p-4 rounded-3xl shadow-2xl border-2 border-green-200 flex items-center gap-3 animate-pop-in">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-3xl">🪙</div>
          <div className="flex-1">
            <div className="text-[10px] font-black text-green-600 uppercase tracking-widest">Penny says:</div>
            <p className="text-sm font-bold text-gray-700 leading-tight">
              {location.pathname === '/game' ? "Welcome! Where should we visit first?" : "You're doing great! Keep growing those roots."}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-green-100 px-2 py-1 flex items-center justify-around z-50 safe-area-inset-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isUnlocked = state.unlockedLocations.includes(item.to) || 
                             ['/game', '/game/home', '/game/library', '/game/credit', '/game/upload'].includes(item.to);
          return (
            <NavLink
              key={item.to}
              to={isUnlocked ? item.to : '#'}
              onClick={(e) => !isUnlocked && e.preventDefault()}
              className={({ isActive }) =>
                `nav-item min-w-[64px] ${
                  !isUnlocked 
                    ? 'opacity-30 grayscale cursor-not-allowed' 
                    : isActive 
                      ? 'active scale-110' 
                      : 'text-gray-400 hover:text-green-500'
                }`
              }
            >
              {isUnlocked ? item.icon : <Lock size={18} />}
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default GameShell;
