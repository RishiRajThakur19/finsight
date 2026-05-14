import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Sparkles, Download, Target, TrendingUp } from 'lucide-react';

export default function CompetitorDeepDive() {
  const [selectedCompetitor, setSelectedCompetitor] = useState('GlobalCorp');
  
  const competitors = ['GlobalCorp', 'TechFin LLC', 'Alpha Services'];
  const baseCompany = 'YourCompany (Base)';

  const radarData = [
    { subject: 'Liquidity', base: 85, comp: 70 },
    { subject: 'Profitability', base: 65, comp: 80 },
    { subject: 'Leverage', base: 90, comp: 60 },
    { subject: 'Efficiency', base: 75, comp: 85 },
    { subject: 'Growth', base: 80, comp: 95 },
    { subject: 'Market Share', base: 60, comp: 75 },
    { subject: 'Innovation', base: 95, comp: 65 },
    { subject: 'Resilience', base: 85, comp: 80 },
  ];

  const ratioComparison = [
    { metric: 'Current Ratio', base: '1.8', comp: '1.4', gap: '+0.4', status: 'ahead' },
    { metric: 'Quick Ratio', base: '1.2', comp: '0.9', gap: '+0.3', status: 'ahead' },
    { metric: 'Debt to Equity', base: '0.5', comp: '0.8', gap: '-0.3', status: 'behind' },
    { metric: 'ROE', base: '14.5%', comp: '18.2%', gap: '-3.7%', status: 'behind' },
    { metric: 'Operating Margin', base: '22.0%', comp: '25.5%', gap: '-3.5%', status: 'behind' },
    { metric: 'Asset Turnover', base: '0.9', comp: '0.8', gap: '+0.1', status: 'ahead' },
  ];

  const trendData = [
    { year: '2021', baseRev: 4000, compRev: 2400 },
    { year: '2022', baseRev: 3000, compRev: 1398 },
    { year: '2023', baseRev: 2000, compRev: 9800 },
    { year: '2024', baseRev: 2780, compRev: 3908 },
    { year: '2025', baseRev: 1890, compRev: 4800 },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Competitor Deep Dive</h1>
          <p className="text-gray-400">Side-by-side benchmarking against industry peers.</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-navy border border-white/20 rounded px-4 py-2 text-white outline-none cursor-pointer"
            value={selectedCompetitor}
            onChange={e => setSelectedCompetitor(e.target.value)}
          >
            {competitors.map(c => <option key={c} value={c}>vs {c}</option>)}
          </select>
          <button className="btn-primary flex items-center gap-2">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="glass-card p-6 col-span-1 flex flex-col">
          <h3 className="text-xl font-bold mb-4">8-Dimension Analysis</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={baseCompany} dataKey="base" stroke="#f0b429" fill="#f0b429" fillOpacity={0.3} />
                <Radar name={selectedCompetitor} dataKey="comp" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0a1628', border: '1px solid #ffffff20' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Summary and Gap Analysis */}
        <div className="col-span-2 space-y-6">
          <div className="glass-card p-6 border-t-4 border-t-gold relative overflow-hidden">
            <Sparkles size={100} className="absolute -right-10 -bottom-10 text-gold/5" />
            <div className="flex items-center gap-2 mb-4 text-gold">
              <Sparkles size={20} />
              <h3 className="font-bold text-lg text-white">AI Competitive Summary</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              Your company maintains a strong structural advantage in <strong>Liquidity</strong> and <strong>Innovation</strong> compared to {selectedCompetitor}. However, {selectedCompetitor} is outperforming in <strong>Profitability</strong> (driven by a higher operating margin of 25.5% vs 22.0%) and <strong>Growth</strong>. 
              <br/><br/>
              <span className="text-white font-bold">Strategic Recommendation:</span> Focus on cost-containment to close the 3.5% operating margin gap, leveraging your superior innovation pipeline to justify premium pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Target size={18} className="text-gray-400"/> Ratio Gap Analysis</h3>
              <div className="space-y-3">
                {ratioComparison.map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                    <span className="text-gray-400 font-medium">{r.metric}</span>
                    <div className="flex gap-4 items-center w-32 justify-end">
                      <span className="text-white">{r.base}</span>
                      <span className={`font-bold w-12 text-right ${r.status === 'ahead' ? 'text-green-400' : 'text-red-400'}`}>
                        {r.gap}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-gray-400"/> Revenue Growth Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="year" stroke="#ffffff80" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff80" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#0a1628', border: '1px solid #ffffff20', fontSize: '12px' }} />
                    <Bar dataKey="baseRev" fill="#f0b429" radius={[2, 2, 0, 0]} name={baseCompany} />
                    <Bar dataKey="compRev" fill="#3b82f6" radius={[2, 2, 0, 0]} name={selectedCompetitor} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
