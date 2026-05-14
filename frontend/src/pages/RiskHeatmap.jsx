import { useState } from 'react';
import { Download, Filter } from 'lucide-react';

export default function RiskHeatmap() {
  const [filter, setFilter] = useState('All');
  
  const riskCategories = ['Liquidity', 'Profitability', 'Leverage', 'Fraud', 'Bankruptcy', 'Growth'];
  
  // Generate mock portfolio data
  const companies = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    name: `Portfolio Co. ${String.fromCharCode(65 + i)}`,
    risks: riskCategories.reduce((acc, cat) => {
      // Generate risk score 0-100
      acc[cat] = Math.floor(Math.random() * 100);
      return acc;
    }, {})
  }));

  const getColor = (score) => {
    if (score < 30) return 'bg-green-500/20 text-green-400 border border-green-500/20'; // Low Risk
    if (score < 70) return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'; // Med Risk
    return 'bg-red-500/40 text-red-200 border border-red-500/40 shadow-[inset_0_0_15px_rgba(239,68,68,0.3)]'; // High Risk
  };

  const getIntensity = (score) => {
    // Return pure color block for classic heatmap look
    if (score < 30) return `rgb(34, 197, 94, ${0.2 + (score/100)*0.3})`;
    if (score < 70) return `rgb(234, 179, 8, ${0.4 + (score/100)*0.4})`;
    return `rgb(239, 68, 68, ${0.6 + (score/100)*0.4})`;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Risk Heatmap</h1>
          <p className="text-gray-400">2D visualization of risk categories across the entire portfolio.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <select 
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold outline-none appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="High Risk">High Risk Only</option>
            </select>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} /> Print Ready format
          </button>
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-4 bg-navy/50 sticky left-0 z-10 border-b border-white/10 font-bold text-gray-300">Company</th>
              {riskCategories.map(cat => (
                <th key={cat} className="p-4 border-b border-white/10 text-center text-xs uppercase tracking-wider font-bold text-gray-400">
                  {cat}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="p-4 bg-navy/80 group-hover:bg-transparent sticky left-0 font-medium text-white shadow-[1px_0_0_rgba(255,255,255,0.05)]">
                  {company.name}
                </td>
                {riskCategories.map(cat => (
                  <td key={cat} className="p-1">
                    <div 
                      className="w-full h-12 rounded flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:ring-2 hover:ring-white/50 transition-all text-white/90"
                      style={{ backgroundColor: getIntensity(company.risks[cat]) }}
                      title={`${company.name} - ${cat}: ${company.risks[cat]}`}
                    >
                      {company.risks[cat]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-6 justify-end items-center text-sm text-gray-400">
        <span className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-500/40"></div> Low Risk (0-29)</span>
        <span className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-500/60"></div> Moderate Risk (30-69)</span>
        <span className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-500/80"></div> High Risk (70-100)</span>
      </div>
    </div>
  );
}
