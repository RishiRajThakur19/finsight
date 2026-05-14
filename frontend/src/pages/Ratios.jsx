import { useState, useEffect } from 'react';
import api from '../services/api';
import { X, TrendingUp, TrendingDown, Target, Zap, AlertCircle } from 'lucide-react';

export default function Ratios() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [ratios, setRatios] = useState(null);
  
  const [selectedRatio, setSelectedRatio] = useState(null);

  useEffect(() => {
    api.get('/dashboard/companies').then(res => {
      setCompanies(res.data);
      if(res.data.length > 0) setSelectedCompany(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      api.get(`/dashboard/ratios?company=${selectedCompany}`).then(res => {
        setRatios(res.data);
      }).catch(() => setRatios(null));
    }
  }, [selectedCompany]);

  const getStatusColor = (status) => {
    if (status === 'healthy') return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (status === 'warning') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const handleRatioClick = (key, data) => {
    // Generate some mock deep analysis data based on the selected ratio
    const details = {
      key,
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: data.value,
      status: data.status,
      formula: key === 'current_ratio' ? 'Current Assets / Current Liabilities' :
               key === 'debt_to_equity' ? 'Total Debt / Total Equity' :
               'Net Income / Total Revenue',
      industryAvg: key === 'current_ratio' ? '1.5' : key === 'debt_to_equity' ? '1.2' : '12%',
      percentile: Math.floor(Math.random() * 40) + 60, // 60th to 99th
      trend: [
        { year: 2021, val: Number(data.value) * 0.8 },
        { year: 2022, val: Number(data.value) * 0.9 },
        { year: 2023, val: Number(data.value) },
      ],
      aiInsight: `This ${data.status} ratio indicates ${data.status === 'healthy' ? 'strong operational efficiency' : 'potential liquidity constraints'}. Compared to the industry median, ${selectedCompany} is performing in the ${Math.floor(Math.random() * 40) + 60}th percentile.`
    };
    setSelectedRatio(details);
  };

  return (
    <div className="space-y-6 animate-slide-up h-full flex flex-col relative">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold">Financial Ratios</h1>
          <p className="text-gray-400 mt-1">Click any ratio card for Deep Analysis.</p>
        </div>
        <select 
          className="bg-navy border border-white/20 rounded px-4 py-2 text-white outline-none cursor-pointer"
          value={selectedCompany}
          onChange={e => setSelectedCompany(e.target.value)}
        >
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {ratios ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(ratios).map(([key, data]) => (
            <div 
              key={key} 
              onClick={() => handleRatioClick(key, data)}
              className="glass-card p-6 cursor-pointer hover:-translate-y-1 hover:shadow-gold/20 transition-all border-t-2 border-transparent hover:border-gold relative group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Target size={18} className="text-gold" />
              </div>
              <h3 className="text-gray-400 text-sm mb-2 uppercase tracking-wider font-bold">
                {key.replace(/_/g, ' ')}
              </h3>
              <div className="flex items-end gap-4">
                <span className="text-4xl font-bold">{data.value}{key === 'profit_margin' ? '%' : ''}</span>
                <span className={`px-3 py-1 rounded text-xs border font-bold ${getStatusColor(data.status)}`}>
                  {data.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                {key === 'current_ratio' ? 'Measures ability to pay short-term obligations.' :
                 key === 'debt_to_equity' ? 'Indicates proportion of equity and debt.' :
                 'Percentage of revenue remaining after expenses.'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-10 text-center animate-pulse text-gray-400">Loading ratios...</div>
      )}

      {/* Deep Ratio Analysis Modal */}
      {selectedRatio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#112240] border border-white/20 rounded-2xl shadow-2xl max-w-3xl w-full animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-navy rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {selectedRatio.name} Deep Analysis
                </h2>
                <p className="text-sm text-gray-400 mt-1">{selectedCompany}</p>
              </div>
              <button onClick={() => setSelectedRatio(null)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Formula Breakdown</h4>
                  <div className="p-3 bg-navy rounded-lg border border-white/5 font-mono text-sm text-gold text-center shadow-inner">
                    {selectedRatio.formula}
                  </div>
                </div>

                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3 flex justify-between">
                    <span>3-Year Trend</span>
                    <TrendingUp size={14} className="text-green-400" />
                  </h4>
                  <div className="space-y-3">
                    {selectedRatio.trend.map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-10">{t.year}</span>
                        <div className="flex-1 bg-navy h-4 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-gold h-full rounded-full opacity-80" 
                            style={{ width: `${Math.min(100, (t.val / Number(selectedRatio.value)) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold w-12 text-right">{typeof t.val === 'number' ? t.val.toFixed(2) : t.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Industry Avg</p>
                    <p className="text-2xl font-bold">{selectedRatio.industryAvg}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Percentile</p>
                    <p className="text-2xl font-bold text-green-400">{selectedRatio.percentile}th</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/40 to-navy p-5 rounded-xl border border-blue-500/30 relative overflow-hidden">
                  <Zap size={80} className="absolute -bottom-4 -right-4 text-blue-500/10 rotate-12" />
                  <h4 className="text-xs text-blue-300 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                    <AlertCircle size={14} /> AI Interpretation
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed relative z-10">
                    {selectedRatio.aiInsight}
                  </p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Action Items</h4>
                  <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4 marker:text-gold">
                    <li>Renegotiate short-term vendor payment terms.</li>
                    <li>Audit inventory turnover rates for specific product lines.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
