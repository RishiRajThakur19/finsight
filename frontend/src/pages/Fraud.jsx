import { useState, useEffect } from 'react';
import api from '../services/api';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, CheckCircle, X, Search, FileText, Activity } from 'lucide-react';

export default function Fraud() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);

  useEffect(() => {
    api.get('/ml/fraud-detection').then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center p-10 animate-pulse text-gray-400">Loading AI Fraud Detection Model...</div>;

  const normalTransactions = data.scatter_data.filter(d => !d.is_anomaly_pred);
  const anomalousTransactions = data.scatter_data.filter(d => d.is_anomaly_pred);

  const handlePointClick = (point) => {
    if (point.is_anomaly_pred) {
      setSelectedAnomaly(point);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up flex flex-col h-[calc(100vh-8rem)]">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold">Fraud Detection AI</h1>
        <p className="text-gray-400 mt-1">Isolation Forest transaction monitoring and anomaly explanation.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-green-500">
          <CheckCircle size={40} className="text-green-500" />
          <div>
            <h3 className="text-gray-400 text-sm uppercase font-bold tracking-wider">Total Analyzed</h3>
            <p className="text-3xl font-bold">{data.total_transactions}</p>
          </div>
        </div>
        
        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-red-500">
          <ShieldAlert size={40} className="text-red-500" />
          <div>
            <h3 className="text-gray-400 text-sm uppercase font-bold tracking-wider">Anomalies Detected</h3>
            <p className="text-3xl font-bold text-red-400">{data.anomalies_detected}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0 relative overflow-hidden">
        {/* Main Chart */}
        <div className={`glass-card p-6 flex flex-col transition-all duration-300 ${selectedAnomaly ? 'w-2/3' : 'w-full'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">Transaction Anomaly Scatter Plot</h3>
              <p className="text-sm text-gray-400">Click any red anomaly point to view the AI explanation.</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" dataKey="id" name="Transaction ID" stroke="#ffffff80" />
                <YAxis type="number" dataKey="amount" name="Amount ($)" stroke="#ffffff80" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0a1628', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                <Scatter name="Normal" data={normalTransactions} fill="#22c55e" opacity={0.6} />
                <Scatter 
                  name="Anomaly" 
                  data={anomalousTransactions} 
                  fill="#ef4444" 
                  opacity={0.8} 
                  onClick={(e) => handlePointClick(e.payload)}
                  className="cursor-pointer hover:stroke-white hover:stroke-2" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Smart Anomaly Explainer */}
        {selectedAnomaly && (
          <div className="glass-card w-1/3 flex flex-col border-t-4 border-t-red-500 animate-in slide-in-from-right-8 overflow-hidden h-full">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-red-500/10">
              <div className="flex items-center gap-2 text-red-400">
                <Activity size={20} />
                <h3 className="font-bold">Anomaly Explainer</h3>
              </div>
              <button onClick={() => setSelectedAnomaly(null)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Transaction Details</h4>
                <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center border border-white/10">
                  <span className="text-gray-400">ID: #{selectedAnomaly.id}</span>
                  <span className="text-xl font-bold text-white">${selectedAnomaly.amount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Plain English Summary</h4>
                <div className="bg-[#0a1628] p-4 rounded-lg border border-red-500/30 text-sm leading-relaxed text-gray-300">
                  <span className="text-gold font-bold">Groq Analysis:</span> This transaction amount is <strong className="text-red-400">3.4x higher</strong> than the 95th percentile of historical transactions for this vendor category. It bypasses the standard approval threshold of $10,000, suggesting potential invoice splitting or unapproved emergency procurement.
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Historical Pattern Matching</h4>
                <div className="space-y-2">
                  <div className="bg-white/5 p-2 rounded text-sm flex justify-between border-l-2 border-yellow-500">
                    <span className="text-gray-400">Similar vendor anomalies</span>
                    <span className="font-bold">2 past instances</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded text-sm flex justify-between border-l-2 border-red-500">
                    <span className="text-gray-400">Time-of-day risk</span>
                    <span className="font-bold text-red-400">High (Weekend)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recommended Action</h4>
                <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
                  <p className="text-sm text-green-400">Temporarily freeze payment and request manual verification from the department head.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/10 bg-navy/50 flex gap-2 shrink-0">
              <button className="flex-1 btn-primary text-sm py-2">Freeze</button>
              <button className="flex-1 btn-secondary text-sm py-2">Investigate</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
