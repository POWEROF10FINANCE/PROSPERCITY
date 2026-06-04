import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { parseCSV } from '../../logic/bank-statement-parser.mjs';

const UploadCenter = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvText = event.target.result;
          const transactions = parseCSV(csvText);
          setPreview(transactions.slice(0, 5));
        } catch (err) {
          setError("Could not parse file. Please use a standard bank CSV.");
          console.error(err);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setParsing(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target.result;
        const transactions = parseCSV(csvText);
        
        // Update global state
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
        
        // Simulate a short delay for "AI processing" effect
        setTimeout(() => {
          setParsing(false);
          navigate('/game/home');
        }, 1500);
      } catch (err) {
        setParsing(false);
        setError("Error during final upload. Please try again.");
      }
    };
    reader.readAsText(file);
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
          <h1 className="text-4xl font-black text-green-900 tracking-tight">Upload Center</h1>
          <p className="text-green-700 font-bold italic">Import Real Financial Data</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className={`card-playful bg-white border-4 border-dashed p-12 text-center transition-all ${file ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
          <input 
            type="file" 
            accept=".csv" 
            id="csv-upload" 
            className="hidden" 
            onChange={handleFileChange}
            disabled={parsing}
          />
          
          <label htmlFor="csv-upload" className="cursor-pointer group">
            <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${file ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Upload size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">
              {file ? file.name : 'Drop your bank CSV here'}
            </h2>
            <p className="text-gray-500 font-bold">
              {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports Chase, BoA, and standard formats'}
            </p>
          </label>

          {file && !error && (
            <div className="mt-8 animate-slide-up">
              <div className="text-left mb-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Data Preview</h3>
                <div className="mt-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 font-black text-gray-400">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="font-bold text-gray-700">
                      {preview.map((tx, i) => (
                        <tr key={i} className="border-t border-gray-50">
                          <td className="p-3">{tx.date}</td>
                          <td className="p-3 truncate max-w-[150px]">{tx.description}</td>
                          <td className={`p-3 text-right ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button 
                onClick={handleUpload}
                disabled={parsing}
                className="w-full bg-green-500 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {parsing ? (
                  <>
                    <Loader2 className="animate-spin" /> ANALYZING TRANSACTIONS...
                  </>
                ) : (
                  <>
                    <CheckCircle2 /> IMPORT TO BUDGET
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold border-2 border-red-100 animate-pop-in">
              <AlertCircle /> {error}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-4 bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-100 text-amber-900">
          <div className="text-4xl">💡</div>
          <div>
            <h4 className="font-black text-lg">Don't have a CSV?</h4>
            <p className="font-bold text-sm opacity-80">
              Download our <a href="/sample.csv" download className="underline hover:text-amber-700 transition-colors">sample statement</a> to try out the dashboard!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCenter;
