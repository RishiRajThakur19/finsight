import { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function Bankruptcy() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    api.get('/dashboard/companies').then(res => {
      setCompanies(res.data);
      if(res.data.length > 0) setSelectedCompany(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      api.get(`/ml/bankruptcy-prediction?company=${selectedCompany}`).then(res => {
        setPrediction(res.data);
      });
    }
  }, [selectedCompany]);

  const getZoneStyle = (zone) => {
    if (zone === 'Safe') return { color: 'text-green-500', icon: <ShieldCheck size={48} className="text-green-500" />, border: 'border-green-500' };
    if (zone === 'Grey') return { color: 'text-yellow-500', icon: <Info size={48} className="text-yellow-500" />, border: 'border-yellow-500' };
    return { color: 'text-red-500', icon: <AlertTriangle size={48} className="text-red-500" />, border: 'border-red-500' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bankruptcy Prediction (Altman Z-Score)</h1>
        <select 
          className="bg-navy border border-white/20 rounded px-4 py-2 text-white outline-none"
          value={selectedCompany}
          onChange={e => setSelectedCompany(e.target.value)}
        >
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {prediction ? (
        <div className={`glass-card p-10 border-t-4 ${getZoneStyle(prediction.zone).border}`}>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex flex-col items-center">
              {getZoneStyle(prediction.zone).icon}
              <h2 className={`text-4xl font-black mt-4 ${getZoneStyle(prediction.zone).color}`}>{prediction.zone} Zone</h2>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-gray-400">Altman Z-Score</h3>
                <p className="text-5xl font-bold">{prediction.z_score}</p>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="text-sm text-gray-400 mb-1">AI Recommendation</h3>
                <p className="text-lg font-medium">{prediction.recommendation}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-red-500/10 rounded border border-red-500/20">
              <h4 className="text-red-400 font-bold mb-1">Distress Zone</h4>
              <p className="text-sm text-gray-400">&lt; 1.81</p>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded border border-yellow-500/20">
              <h4 className="text-yellow-400 font-bold mb-1">Grey Zone</h4>
              <p className="text-sm text-gray-400">1.81 - 2.99</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded border border-green-500/20">
              <h4 className="text-green-400 font-bold mb-1">Safe Zone</h4>
              <p className="text-sm text-gray-400">&gt; 2.99</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-10 text-center">Loading model...</div>
      )}
    </div>
  );
}
