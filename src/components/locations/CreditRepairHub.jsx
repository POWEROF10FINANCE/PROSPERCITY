import React, { useState, useMemo } from 'react';
import { Shield, FileText, TrendingUp, AlertTriangle, ArrowLeft, CheckCircle2, ChevronRight, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { assessCreditHealth, getDisputeTemplates, calculateCreditProjection, createDispute } from '../../logic/credit-repair-engine.mjs';

const CreditRepairHub = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  
  // Mock credit data for now, but in real app this would come from an API or State
  const [creditScore, setCreditScore] = useState(620);
  const [negativeItems, setNegativeItems] = useState([
    { id: 1, type: 'LATE_PAYMENT', creditor: 'Big Bank Visa', date: '2023-11-15', amount: 35 },
    { id: 2, type: 'COLLECTION', creditor: 'Fast Recovery Inc', date: '2024-01-10', amount: 450 }
  ]);
  
  const [disputeForm, setDisputeForm] = useState({
    show: false,
    creditor: '',
    account: '',
    templateId: 'incorrect-balance',
    reason: ''
  });

  const [disputeSent, setDisputeSent] = useState(false);

  const health = useMemo(() => assessCreditHealth(creditScore, negativeItems), [creditScore, negativeItems]);
  const projection = useMemo(() => calculateCreditProjection(creditScore, negativeItems, { onTimePayments: 24, monthsOfHistory: 36 }), [creditScore, negativeItems]);
  const templates = getDisputeTemplates();

  const handleSendDispute = () => {
    // Logic to "send" dispute
    createDispute({
      creditorName: disputeForm.creditor,
      accountNumber: disputeForm.account,
      templateId: disputeForm.templateId,
      reason: disputeForm.reason,
      userInfo: { fullName: state.playerName || 'Player 1' }
    });
    
    setDisputeSent(true);
    dispatch({ type: 'EARN_STARS', payload: 3 });
    
    setTimeout(() => {
      setDisputeSent(false);
      setDisputeForm({ ...disputeForm, show: false });
    }, 2000);
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
          <h1 className="text-4xl font-black text-green-900 tracking-tight">Credit Clinic</h1>
          <p className="text-green-700 font-bold italic">Repair & Build Your Future</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Gauge */}
        <div className="lg:col-span-1 card-playful bg-white flex flex-col items-center justify-center py-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 flex">
            <div className="h-full bg-red-500 w-[20%]"></div>
            <div className="h-full bg-orange-500 w-[20%]"></div>
            <div className="h-full bg-yellow-500 w-[20%]"></div>
            <div className="h-full bg-green-500 w-[20%]"></div>
            <div className="h-full bg-teal-500 w-[20%]"></div>
          </div>
          
          <div className="text-gray-400 font-black text-xs uppercase tracking-widest mb-2">Current Score</div>
          <div className="relative">
             <div className="text-8xl font-black text-gray-800 tracking-tighter">{creditScore}</div>
             <div className={`absolute -right-12 top-0 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest`} style={{ backgroundColor: health.rangeColor }}>
               {health.rangeLabel}
             </div>
          </div>
          <p className="mt-4 text-center px-6 text-gray-500 font-bold text-sm leading-snug">
            {health.assessment}
          </p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 w-full px-6">
            <div className="bg-green-50 p-3 rounded-2xl border border-green-100 text-center">
              <div className="text-green-600 font-black text-lg">+{health.estimatedRecoverablePoints}</div>
              <div className="text-[10px] font-black text-green-700 uppercase">Recoverable</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 text-center">
              <div className="text-blue-600 font-black text-lg">{health.projectedScoreAfterRepair}</div>
              <div className="text-[10px] font-black text-blue-700 uppercase">Projected</div>
            </div>
          </div>
        </div>

        {/* Negative Items & Disputes */}
        <div className="lg:col-span-2 card-playful bg-white">
          <h3 className="text-xl font-black text-green-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
            <AlertTriangle className="text-orange-500" /> Negative Items ({negativeItems.length})
          </h3>
          
          <div className="space-y-4">
            {negativeItems.map((item) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-3xl border-2 border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-red-500">
                    <FileText />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800">{item.creditor}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {item.type.replace('_', ' ')} • {item.date} • ${item.amount}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setDisputeForm({ ...disputeForm, show: true, creditor: item.creditor })}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-black text-xs hover:bg-indigo-600 transition-all shadow-md"
                >
                  DISPUTE
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-black text-indigo-900 mb-2">Credit Building Plan</h4>
              <p className="text-sm font-bold text-indigo-700 mb-4 italic leading-relaxed">
                "Adding positive credit history is just as important as removing negative marks."
              </p>
              <div className="space-y-2">
                {health.recommendations.slice(0, 2).map((rec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-black text-indigo-800">
                    <CheckCircle2 size={14} className="text-indigo-500" /> {rec.action}
                  </div>
                ))}
              </div>
            </div>
            <TrendingUp size={120} className="absolute -right-4 -bottom-4 text-indigo-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* 12 Month Projection Chart Mockup */}
      <div className="card-playful bg-white">
         <h3 className="text-xl font-black text-green-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
            <TrendingUp className="text-green-500" /> 12-Month Score Projection
          </h3>
          <div className="h-48 w-full flex items-end gap-2 px-2 pb-6 border-b-2 border-gray-100">
             {[620, 625, 635, 630, 650, 660, 680, 695, 710, 705, 715, 720].map((val, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="hidden group-hover:block bg-gray-800 text-white text-[10px] px-2 py-1 rounded absolute -mt-8 font-black">{val}</div>
                  <div 
                    className={`w-full rounded-t-lg transition-all ${val > 700 ? 'bg-teal-400' : val > 650 ? 'bg-green-400' : 'bg-orange-400'}`} 
                    style={{ height: `${(val - 300) / 5.5}%` }}
                  ></div>
                  <span className="text-[8px] font-black text-gray-400">M{i+1}</span>
               </div>
             ))}
          </div>
          <p className="mt-4 text-sm font-bold text-gray-500 italic">
            *Projection based on successful disputes and on-time payments. Results may vary.
          </p>
      </div>

      {/* Dispute Modal */}
      {disputeForm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] border-8 border-indigo-100 shadow-2xl overflow-hidden animate-pop-in">
            <div className="bg-indigo-500 p-8 text-white">
              <h2 className="text-3xl font-black mb-2">Draft Dispute</h2>
              <p className="font-bold opacity-80 italic">Formal letter to {disputeForm.creditor}</p>
            </div>
            
            <div className="p-8 space-y-6">
              {disputeSent ? (
                <div className="text-center py-10 animate-bounce">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-green-800">Letter Sent!</h3>
                  <p className="font-bold text-gray-500 italic">+3 Stars Earned</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Reason for Dispute</label>
                      <select 
                        className="w-full bg-gray-100 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-800 focus:border-indigo-300 outline-none transition-all"
                        value={disputeForm.templateId}
                        onChange={(e) => setDisputeForm({ ...disputeForm, templateId: e.target.value })}
                      >
                        {templates.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2 px-2">Additional Notes</label>
                      <textarea 
                        placeholder="Explain why this information is incorrect..."
                        className="w-full bg-gray-100 border-2 border-gray-100 rounded-3xl p-4 font-bold text-gray-800 focus:border-indigo-300 outline-none transition-all h-32 resize-none"
                        value={disputeForm.reason}
                        onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setDisputeForm({ ...disputeForm, show: false })}
                      className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-[2rem] font-black text-lg hover:bg-gray-200 transition-all"
                    >
                      CANCEL
                    </button>
                    <button 
                      onClick={handleSendDispute}
                      className="flex-2 bg-indigo-500 text-white py-4 rounded-[2rem] font-black text-lg hover:bg-indigo-600 shadow-lg active:scale-95 transition-all px-8"
                    >
                      GENERATE & SEND
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditRepairHub;
