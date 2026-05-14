import { useState, useEffect } from 'react';
import { Download, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

export default function ExecutiveScorecard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // We will fetch real data, but for now mock it if api fails or while building
    const fetchScorecard = async () => {
      try {
        const res = await api.get('/dashboard/companies');
        // Let's generate mock scorecard data based on company names
        const mockData = res.data.map((name, i) => ({
          id: i,
          name,
          zScore: (Math.random() * 4).toFixed(2),
          revenue: `$${(Math.random() * 50 + 10).toFixed(1)}M`,
          yoyGrowth: `${(Math.random() * 40 - 10).toFixed(1)}%`,
          fraudRisk: Math.floor(Math.random() * 100),
          lastUpdated: '2 hours ago'
        }));
        setCompanies(mockData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchScorecard();
  }, []);

  const getHealthStatus = (zScore) => {
    if (zScore > 2.99) return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: <CheckCircle size={16} />, label: 'Healthy' };
    if (zScore > 1.81) return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: <Clock size={16} />, label: 'Watch' };
    return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: <AlertCircle size={16} />, label: 'Critical' };
  };

  const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Executive Scorecard</h1>
          <p className="text-gray-400">High-level health overview of all portfolio companies.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold outline-none"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card p-6 h-48 animate-pulse bg-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => {
            const status = getHealthStatus(parseFloat(company.zScore));
            return (
              <div key={company.id} className="glass-card p-6 hover:-translate-y-1 transition-transform cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{company.name}</h3>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.color} ${status.border}`}>
                    {status.icon} {status.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Z-Score</p>
                    <p className="text-2xl font-bold text-white">{company.zScore}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Fraud Risk</p>
                    <p className="text-2xl font-bold text-white">{company.fraudRisk}/100</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Revenue</p>
                    <p className="text-lg font-bold text-white">{company.revenue}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">YoY Growth</p>
                    <p className={`text-lg font-bold ${company.yoyGrowth.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                      {company.yoyGrowth.startsWith('-') ? '' : '+'}{company.yoyGrowth}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                  <span>Last updated: {company.lastUpdated}</span>
                  <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
