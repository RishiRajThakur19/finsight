import { useState } from 'react';
import { AlertTriangle, Zap, Download, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StressTesting() {
  const [selectedScenario, setSelectedScenario] = useState('recession');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const scenarios = [
    { id: 'recession', name: 'Global Recession', desc: 'Revenue -30%, Costs +20%', icon: <TrendingDown /> },
    { id: 'market_crash', name: 'Market Crash', desc: 'Asset Values -40%', icon: <TrendingDown /> },
    { id: 'liquidity_crisis', name: 'Liquidity Crisis', desc: 'Cash Reserves -60%', icon: <AlertTriangle /> },
    { id: 'interest_hike', name: 'Interest Rate Spike', desc: 'Debt Servicing Cost +150%', icon: <Zap /> },
  ];

  // Dummy chart data representing Time to Insolvency prediction
  const chartData = [
    { month: 'Month 1', base: 100, stressed: 100 },
    { month: 'Month 2', base: 98, stressed: 80 },
    { month: 'Month 3', base: 97, stressed: 55 },
    { month: 'Month 4', base: 95, stressed: 30 },
    { month: 'Month 5', base: 96, stressed: 10 },
    { month: 'Month 6', base: 94, stressed: -5 }, // Insolvency point
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setShowResults(false);
    setTimeout(() => {
      setIsSimulating(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Stress Testing Engine</h1>
          <p className="text-gray-400">Run macro-economic shocks against portfolio companies.</p>
        </div>
        <button 
          onClick={handleSimulate}
          disabled={isSimulating}
          className="btn-primary flex items-center gap-2"
        >
          {isSimulating ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />} 
          {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {scenarios.map(s => (
          <div 
            key={s.id} 
            onClick={() => setSelectedScenario(s.id)}
            className={`glass-card p-4 cursor-pointer transition-all border-2 ${selectedScenario === s.id ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(240,180,41,0.2)]' : 'border-transparent hover:border-white/20'}`}
          >
            <h3 className="font-bold text-white mb-1">{s.name}</h3>
            <p className="text-xs text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>

      {showResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 border-l-4 border-red-500">
              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Time to Insolvency</h3>
              <p className="text-3xl font-bold text-red-400">5.2 Months</p>
              <p className="text-sm text-gray-400 mt-2">Decreased from 36+ months</p>
            </div>
            <div className="glass-card p-6 border-l-4 border-orange-500">
              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Bankruptcy Prob.</h3>
              <p className="text-3xl font-bold text-orange-400">84%</p>
              <p className="text-sm text-gray-400 mt-2">Increased from 12%</p>
            </div>
            <div className="glass-card p-6 border-l-4 border-yellow-500">
              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Z-Score Impact</h3>
              <p className="text-3xl font-bold text-yellow-400">0.82</p>
              <p className="text-sm text-gray-400 mt-2">Fell from 2.45 (Safe Zone)</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Cash Reserve Projection under Stress</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip contentStyle={{ backgroundColor: '#0a1628', border: '1px solid #ffffff20' }} />
                  <Area type="monotone" dataKey="base" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} name="Base Scenario" />
                  <Area type="monotone" dataKey="stressed" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Stressed Scenario" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex gap-3">
              <AlertTriangle className="shrink-0" />
              <p>Under the {scenarios.find(s=>s.id === selectedScenario)?.name} scenario, the model predicts liquidity exhaustion by Month 6. Immediate capital injection or severe cost cutting would be required by Month 3 to avert insolvency.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Temporary internal component for icon
function TrendingDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-down"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
  );
}
