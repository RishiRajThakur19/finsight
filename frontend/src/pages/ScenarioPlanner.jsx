import { useState, useEffect } from 'react';
import { Save, Download, RotateCcw, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function ScenarioPlanner() {
  const [baseMetrics, setBaseMetrics] = useState({
    revenue: 100000000,
    cogs: 60000000,
    operatingExpenses: 25000000,
    totalAssets: 150000000,
    totalLiabilities: 80000000,
    ebit: 15000000
  });

  const [adjustments, setAdjustments] = useState({
    revenuePct: 0,
    cogsPct: 0,
    opexPct: 0,
    assetsPct: 0
  });

  // Calculate adjusted metrics
  const adjRevenue = baseMetrics.revenue * (1 + adjustments.revenuePct / 100);
  const adjCogs = baseMetrics.cogs * (1 + adjustments.cogsPct / 100);
  const adjOpex = baseMetrics.operatingExpenses * (1 + adjustments.opexPct / 100);
  const adjAssets = baseMetrics.totalAssets * (1 + adjustments.assetsPct / 100);
  
  // Implicitly affected
  const adjEbit = adjRevenue - adjCogs - adjOpex;
  const adjNetIncome = adjEbit * 0.75; // Assuming 25% tax

  // Base Ratios
  const baseMargin = (baseMetrics.ebit / baseMetrics.revenue) * 100;
  const baseROA = ((baseMetrics.ebit * 0.75) / baseMetrics.totalAssets) * 100;
  
  // Adjusted Ratios
  const adjMargin = (adjEbit / adjRevenue) * 100;
  const adjROA = (adjNetIncome / adjAssets) * 100;

  // Mock Z-Score (simplified for demo)
  const calculateZScore = (ebit, assets) => {
    // 1.2A + 1.4B + 3.3C + 0.6D + 1.0E (A=WC/TA, B=RE/TA, C=EBIT/TA, D=MVE/TL, E=S/TA)
    // using a dummy calc for demo
    const c = ebit / assets;
    return (1.2 * 0.2) + (1.4 * 0.3) + (3.3 * c) + (0.6 * 1.5) + (1.0 * 0.8);
  };

  const baseZScore = calculateZScore(baseMetrics.ebit, baseMetrics.totalAssets);
  const adjZScore = calculateZScore(adjEbit, adjAssets);

  const formatCurrency = (val) => `$${(val / 1000000).toFixed(1)}M`;

  const handleReset = () => {
    setAdjustments({ revenuePct: 0, cogsPct: 0, opexPct: 0, assetsPct: 0 });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Scenario Planner</h1>
          <p className="text-gray-400">Stress test financial models by adjusting key drivers.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
            <RotateCcw size={18} /> Reset
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Save size={18} /> Save Scenario
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="glass-card p-6 col-span-1 space-y-6">
          <h3 className="text-xl font-bold border-b border-white/10 pb-4">Adjust Drivers</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">Revenue</label>
                <span className={`text-sm font-bold ${adjustments.revenuePct > 0 ? 'text-green-400' : adjustments.revenuePct < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {adjustments.revenuePct > 0 ? '+' : ''}{adjustments.revenuePct}%
                </span>
              </div>
              <input type="range" min="-50" max="50" value={adjustments.revenuePct} onChange={e => setAdjustments({...adjustments, revenuePct: Number(e.target.value)})} className="w-full accent-gold" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">COGS (Costs)</label>
                <span className={`text-sm font-bold ${adjustments.cogsPct < 0 ? 'text-green-400' : adjustments.cogsPct > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {adjustments.cogsPct > 0 ? '+' : ''}{adjustments.cogsPct}%
                </span>
              </div>
              <input type="range" min="-50" max="50" value={adjustments.cogsPct} onChange={e => setAdjustments({...adjustments, cogsPct: Number(e.target.value)})} className="w-full accent-gold" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">Operating Expenses</label>
                <span className={`text-sm font-bold ${adjustments.opexPct < 0 ? 'text-green-400' : adjustments.opexPct > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {adjustments.opexPct > 0 ? '+' : ''}{adjustments.opexPct}%
                </span>
              </div>
              <input type="range" min="-50" max="50" value={adjustments.opexPct} onChange={e => setAdjustments({...adjustments, opexPct: Number(e.target.value)})} className="w-full accent-gold" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">Total Assets</label>
                <span className={`text-sm font-bold ${adjustments.assetsPct > 0 ? 'text-green-400' : adjustments.assetsPct < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {adjustments.assetsPct > 0 ? '+' : ''}{adjustments.assetsPct}%
                </span>
              </div>
              <input type="range" min="-30" max="30" value={adjustments.assetsPct} onChange={e => setAdjustments({...adjustments, assetsPct: Number(e.target.value)})} className="w-full accent-gold" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* EBIT Card */}
            <div className="glass-card p-6 border-t-4 border-t-blue-500">
              <p className="text-gray-400 text-sm mb-1">Projected EBIT</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-white">{formatCurrency(adjEbit)}</h2>
              </div>
              <p className={`text-sm mt-2 flex items-center gap-1 ${adjEbit >= baseMetrics.ebit ? 'text-green-400' : 'text-red-400'}`}>
                {adjEbit >= baseMetrics.ebit ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                vs {formatCurrency(baseMetrics.ebit)} base
              </p>
            </div>

            {/* Margin Card */}
            <div className="glass-card p-6 border-t-4 border-t-gold">
              <p className="text-gray-400 text-sm mb-1">Operating Margin</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-white">{adjMargin.toFixed(1)}%</h2>
              </div>
              <p className={`text-sm mt-2 flex items-center gap-1 ${adjMargin >= baseMargin ? 'text-green-400' : 'text-red-400'}`}>
                {adjMargin >= baseMargin ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                vs {baseMargin.toFixed(1)}% base
              </p>
            </div>

            {/* Z-Score Card */}
            <div className={`glass-card p-6 border-t-4 ${adjZScore > 2.99 ? 'border-t-green-500' : adjZScore > 1.8 ? 'border-t-yellow-500' : 'border-t-red-500'}`}>
              <p className="text-gray-400 text-sm mb-1">Projected Z-Score</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-white">{adjZScore.toFixed(2)}</h2>
              </div>
              <p className={`text-sm mt-2 flex items-center gap-1 ${adjZScore >= baseZScore ? 'text-green-400' : 'text-red-400'}`}>
                {adjZScore >= baseZScore ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                vs {baseZScore.toFixed(2)} base
              </p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Impact Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm">
                    <th className="pb-3 font-medium">Metric</th>
                    <th className="pb-3 font-medium">Current Base</th>
                    <th className="pb-3 font-medium">Stressed Projection</th>
                    <th className="pb-3 font-medium">Variance</th>
                  </tr>
                </thead>
                <tbody className="text-white text-sm">
                  <tr className="border-b border-white/5">
                    <td className="py-4">Revenue</td>
                    <td>{formatCurrency(baseMetrics.revenue)}</td>
                    <td>{formatCurrency(adjRevenue)}</td>
                    <td className={adjRevenue >= baseMetrics.revenue ? 'text-green-400' : 'text-red-400'}>
                      {((adjRevenue / baseMetrics.revenue - 1) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4">Net Income</td>
                    <td>{formatCurrency(baseMetrics.ebit * 0.75)}</td>
                    <td>{formatCurrency(adjNetIncome)}</td>
                    <td className={adjNetIncome >= baseMetrics.ebit * 0.75 ? 'text-green-400' : 'text-red-400'}>
                      {((adjNetIncome / (baseMetrics.ebit * 0.75) - 1) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4">Return on Assets</td>
                    <td>{baseROA.toFixed(1)}%</td>
                    <td>{adjROA.toFixed(1)}%</td>
                    <td className={adjROA >= baseROA ? 'text-green-400' : 'text-red-400'}>
                      {(adjROA - baseROA).toFixed(1)} bps
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {adjZScore < 1.8 && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-400">
                <AlertTriangle size={24} className="shrink-0" />
                <div>
                  <h4 className="font-bold">Bankruptcy Warning</h4>
                  <p className="text-sm text-red-300 mt-1">This scenario pushes the company into the distress zone. Immediate liquidity actions would be required.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
