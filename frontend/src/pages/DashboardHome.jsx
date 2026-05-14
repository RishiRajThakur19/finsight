import { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, X, Copy, Download, Loader2 } from 'lucide-react';

export default function DashboardHome() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [financials, setFinancials] = useState([]);
  
  // Story Generator State
  const [showStory, setShowStory] = useState(false);
  const [storyGenerating, setStoryGenerating] = useState(false);
  const [storyText, setStoryText] = useState(null);

  useEffect(() => {
    api.get('/dashboard/companies').then(res => {
      setCompanies(res.data);
      if(res.data.length > 0) setSelectedCompany(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      api.get(`/dashboard/financials?company=${selectedCompany}`).then(res => {
        setFinancials(res.data);
      });
      setStoryText(null); // reset story when company changes
    }
  }, [selectedCompany]);

  const generateStory = () => {
    setShowStory(true);
    setStoryGenerating(true);
    // Mock API call to Groq
    setTimeout(() => {
      setStoryText({
        situation: `${selectedCompany} has maintained steady revenue growth over the past 5 years, reaching a peak in the most recent fiscal year.`,
        complication: `However, operating margins are under pressure due to rising COGS and SG&A expenses, causing profit growth to lag behind revenue.`,
        resolution: `Management has initiated a cost-reduction program aimed at supply chain optimization to restore historical margin levels.`,
        risk: `The primary risk is a potential liquidity crunch if the cost-reduction program fails to yield results within the next 2 quarters, given current debt covenants.`,
        recommendation: `Maintain a 'Hold' rating. Closely monitor the upcoming quarter's operating cash flow. Reassess if margins do not improve by at least 150 bps.`
      });
      setStoryGenerating(false);
    }, 2500);
  };

  const copyStory = () => {
    if (!storyText) return;
    const text = `Data Story: ${selectedCompany}\n\nSituation: ${storyText.situation}\n\nComplication: ${storyText.complication}\n\nResolution: ${storyText.resolution}\n\nRisk: ${storyText.risk}\n\nRecommendation: ${storyText.recommendation}`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Executive Dashboard</h1>
          <p className="text-gray-400">Overview of financial health and performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={generateStory}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles size={18} /> Generate Story
          </button>
          <select 
            className="bg-navy border border-white/20 rounded px-4 py-2 text-white outline-none cursor-pointer"
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
          >
            {companies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-t-4 border-t-gold">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Latest Revenue</h3>
          <p className="text-4xl font-bold text-white mt-2">
            ${financials.length > 0 ? (financials[financials.length-1].revenue / 1000000).toFixed(2) : '0'}M
          </p>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-green-500">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Latest Profit</h3>
          <p className="text-4xl font-bold text-white mt-2">
            ${financials.length > 0 ? (financials[financials.length-1].profit / 1000000).toFixed(2) : '0'}M
          </p>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-blue-500">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold">Total Assets</h3>
          <p className="text-4xl font-bold text-white mt-2">
            ${financials.length > 0 ? (financials[financials.length-1].assets / 1000000).toFixed(2) : '0'}M
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-6">Revenue vs Profit Trend</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financials}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="year" stroke="#ffffff80" axisLine={false} tickLine={false} />
              <YAxis stroke="#ffffff80" tickFormatter={(v) => `$${(v/1000000).toFixed(0)}M`} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a1628', border: '1px solid #ffffff20', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                formatter={(value) => [`$${(value/1000000).toFixed(2)}M`]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#f0b429" strokeWidth={4} dot={{ r: 6, fill: '#0a1628', strokeWidth: 2 }} activeDot={{ r: 8 }} name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={4} dot={{ r: 6, fill: '#0a1628', strokeWidth: 2 }} activeDot={{ r: 8 }} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Story Generator Modal */}
      {showStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#112240] border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-navy rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/20 rounded-lg text-gold"><Sparkles size={24} /></div>
                <div>
                  <h2 className="text-2xl font-bold text-white">AI Data Story</h2>
                  <p className="text-sm text-gray-400">Consulting Narrative for {selectedCompany}</p>
                </div>
              </div>
              <button onClick={() => setShowStory(false)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              {storyGenerating ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 size={48} className="text-gold animate-spin" />
                  <p className="text-gray-400 animate-pulse text-lg">Groq AI is analyzing financials...</p>
                </div>
              ) : storyText && (
                <div className="space-y-6 text-gray-200 leading-relaxed">
                  <div className="bg-white/5 p-5 rounded-xl border-l-4 border-blue-500">
                    <h4 className="text-blue-400 font-bold mb-2 uppercase tracking-wide text-xs">1. Situation</h4>
                    <p>{storyText.situation}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-xl border-l-4 border-yellow-500">
                    <h4 className="text-yellow-400 font-bold mb-2 uppercase tracking-wide text-xs">2. Complication</h4>
                    <p>{storyText.complication}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-xl border-l-4 border-green-500">
                    <h4 className="text-green-400 font-bold mb-2 uppercase tracking-wide text-xs">3. Resolution</h4>
                    <p>{storyText.resolution}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-xl border-l-4 border-red-500">
                    <h4 className="text-red-400 font-bold mb-2 uppercase tracking-wide text-xs">4. Risk</h4>
                    <p>{storyText.risk}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-xl border-l-4 border-gold">
                    <h4 className="text-gold font-bold mb-2 uppercase tracking-wide text-xs">5. Recommendation</h4>
                    <p className="font-medium">{storyText.recommendation}</p>
                  </div>
                </div>
              )}
            </div>

            {!storyGenerating && storyText && (
              <div className="p-6 border-t border-white/10 bg-navy flex justify-end gap-4 rounded-b-2xl">
                <button onClick={copyStory} className="btn-secondary flex items-center gap-2">
                  <Copy size={18} /> Copy Narrative
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <Download size={18} /> Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
