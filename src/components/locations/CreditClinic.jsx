import React, { useState, useMemo } from 'react';
import { ShieldCheck, TrendingUp, FileText, CheckCircle2, ChevronRight, ArrowLeft, Plus, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { assessCreditHealth } from '../../logic/credit-repair-engine.mjs';

const CreditClinic = () => {
  const navigate = useNavigate();
  const [creditScore, setCreditScore] = useState(620);
  const [disputes, setDisputes] = useState([
    { id: 1, creditor: 'FakeBank Visa', amount: 1200, status: 'Pending', type: 'LATE_PAYMENT', date: '2024-05-10' },
    { id: 2, creditor: 'Old Store Card', amount: 450, status: 'Completed', type: 'COLLECTION', date: '2024-03-15' }
  ]);

  const [newDispute, setNewDispute] = useState({ creditor: '', amount: '', type: 'LATE_PAYMENT' });

  // Wire logic engine
  const health = useMemo(() => {
    // Convert disputes to format expected by engine
    const negativeItems = disputes.map(d => ({ type: d.type, date: d.date, amount: d.amount }));
    return assessCreditHealth(creditScore, negativeItems);
  }, [creditScore, disputes]);

  const addDispute = () => {
    if (newDispute.creditor && newDispute.amount) {
      setDisputes([{ ...newDispute, id: Date.now(), status: 'Pending', date: new Date().toISOString().split('T')[0] }, ...disputes]);
      setNewDispute({ creditor: '', amount: '', type: 'LATE_PAYMENT' });
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
          <div className="text-8xl font-black mb-4" style={{ color: health.rangeColor }}>{creditScore}</div>
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full transition-all duration-1000"
              style={{ width: `${((creditScore - 300) / 550) * 100}%`, backgroundColor: health.rangeColor }}
            ></div>
          </div>
          <div className="bg-green-50 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 text-green-700">
             {health.rangeLabel} Range
          </div>
          <p className="text-sm font-bold text-gray-500">
            {health.assessment}
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
              value={newDispute.type}
              onChange={(e) => setNewDispute({...newDispute, type: e.target.value})}
            >
              <option value="LATE_PAYMENT">Late Payment</option>
              <option value="COLLECTION">Collection Account</option>
              <option value="CHARGE_OFF">Charge-Off</option>
              <option value="BANKRUPTCY">Bankruptcy</option>
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
                  <div className="text-xs font-bold text-gray-400 italic">${dispute.amount} • {dispute.type} • {dispute.date}</div>
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
          <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">Improvement Plan</h3>
          <div className="space-y-6">
            {health.recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="bg-white/20 p-2 rounded-xl">
                  {rec.priority === 'critical' ? <AlertCircle size={24} className="text-red-200" /> : <CheckCircle2 size={24} className="text-green-200" />}
                </div>
                <div>
                  <div className="font-black text-lg">{rec.action}</div>
                  <p className="text-sm text-green-100 font-bold opacity-80">{rec.impact} ({rec.timeline})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditClinic;
