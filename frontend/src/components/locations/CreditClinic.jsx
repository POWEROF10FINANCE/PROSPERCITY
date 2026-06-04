import React, { useState, useMemo } from 'react';
import { ShieldCheck, TrendingUp, FileText, CheckCircle2, ChevronRight, ArrowLeft, Plus, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreditClinic = () => {
  const navigate = useNavigate();
  const [creditScore, setCreditScore] = useState(620);
  const [disputes, setDisputes] = useState([
    { id: 1, creditor: 'FakeBank Visa', amount: 1200, status: 'Pending', date: '2024-05-10' },
    { id: 2, creditor: 'Old Store Card', amount: 450, status: 'Completed', date: '2024-03-15' }
  ]);

  const [newDispute, setNewDispute] = useState({ creditor: '', amount: '', reason: 'not-mine' });

  const scoreColor = useMemo(() => {
    if (creditScore >= 750) return 'text-green-500';
    if (creditScore >= 670) return 'text-blue-500';
    if (creditScore >= 580) return 'text-amber-500';
    return 'text-red-500';
  }, [creditScore]);

  const addDispute = () => {
    if (newDispute.creditor && newDispute.amount) {
      setDisputes([{ ...newDispute, id: Date.now(), status: 'Pending', date: new Date().toISOString().split('T')[0] }, ...disputes]);
      setNewDispute({ creditor: '', amount: '', reason: 'not-mine' });
    }
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
        <div className="text-right">
          <h1 className="text-4xl font-black text-green-900 tracking-tight flex items-center justify-end gap-2">
            <ShieldCheck size={36} /> Credit Clinic
          </h1>
          <p className="text-green-700 font-bold italic">Repair & Build Your Future</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credit Score Card */}
        <div className="card-playful bg-white flex flex-col items-center justify-center text-center p-10">
          <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-4">Current Score</h3>
          <div className={`text-8xl font-black mb-4 ${scoreColor}`}>{creditScore}</div>
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 transition-all duration-1000"
              style={{ width: `${((creditScore - 300) / 550) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm font-bold text-gray-500">
            You're {700 - creditScore > 0 ? `${700 - creditScore} points away from` : 'above'} a "Good" score!
          </p>
        </div>

        {/* Dispute Engine */}
        <div className="lg:col-span-2 card-playful bg-white">
          <h3 className="text-xl font-black text-green-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
            <FileText size={24} /> Dispute letter generator
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Creditor Name" 
                className="p-4 rounded-2xl border-2 border-green-50 focus:border-green-500 outline-none font-bold"
                value={newDispute.creditor}
                onChange={(e) => setNewDispute({...newDispute, creditor: e.target.value})}
              />
              <input 
                type="number" placeholder="Amount ($)" 
                className="p-4 rounded-2xl border-2 border-green-50 focus:border-green-500 outline-none font-bold"
                value={newDispute.amount}
                onChange={(e) => setNewDispute({...newDispute, amount: e.target.value})}
              />
            </div>
            <select 
              className="w-full p-4 rounded-2xl border-2 border-green-50 focus:border-green-500 outline-none font-bold bg-white"
              value={newDispute.reason}
              onChange={(e) => setNewDispute({...newDispute, reason: e.target.value})}
            >
              <option value="not-mine">This account is not mine</option>
              <option value="wrong-amount">The amount listed is incorrect</option>
              <option value="closed">This account should be marked as closed</option>
              <option value="other">Other error</option>
            </select>
            <button 
              onClick={addDispute}
              className="w-full bg-green-500 text-white p-5 rounded-2xl font-black text-lg shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={24} /> GENERATE DISPUTE LETTER
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Disputes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-playful bg-white">
          <h3 className="text-xl font-black text-green-800 mb-6 uppercase tracking-tighter">Active Disputes</h3>
          <div className="space-y-3">
            {disputes.map(dispute => (
              <div key={dispute.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-green-200 transition-all">
                <div>
                  <div className="font-black text-green-900">{dispute.creditor}</div>
                  <div className="text-xs font-bold text-gray-400 italic">${dispute.amount} • {dispute.date}</div>
                </div>
                <div className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  dispute.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {dispute.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-playful bg-green-600 text-white">
          <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">Milestones</h3>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-white/20 p-2 rounded-xl">
                <CheckCircle2 size={24} className="text-green-200" />
              </div>
              <div>
                <div className="font-black text-lg">Identity Verified</div>
                <p className="text-sm text-green-100 font-bold opacity-80">You've successfully linked your real identity.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start opacity-60">
              <div className="bg-white/20 p-2 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="font-black text-lg">Score Booster</div>
                <p className="text-sm text-green-100 font-bold">Increase your score by 20 points.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start opacity-60">
              <div className="bg-white/20 p-2 rounded-xl">
                <AlertCircle size={24} />
              </div>
              <div>
                <div className="font-black text-lg">First Dispute Won</div>
                <p className="text-sm text-green-100 font-bold">Successfully remove an error from your report.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditClinic;
