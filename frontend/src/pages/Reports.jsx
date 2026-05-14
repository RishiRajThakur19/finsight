import { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Download, Bot, Check, X, Mail, MessageSquare, AlertCircle } from 'lucide-react';

export default function Reports() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // New Features State
  const [activeTab, setActiveTab] = useState('generate'); // generate, digest, approvals
  
  // Weekly Digest State
  const [digestLoading, setDigestLoading] = useState(false);
  const [digest, setDigest] = useState(null);

  // Approvals State
  const [pendingReports, setPendingReports] = useState([
    { id: 'REP-091', company: 'HealthInc', author: 'mark.roberts@finsight.com', type: 'Q3 Risk Assessment', date: '2 hours ago', status: 'pending' },
    { id: 'REP-092', company: 'TechCorp', author: 'sarah.j@finsight.com', type: 'M&A Due Diligence', date: '5 hours ago', status: 'pending' },
  ]);

  useEffect(() => {
    api.get('/dashboard/companies').then(res => {
      setCompanies(res.data);
      if(res.data.length > 0) setSelectedCompany(res.data[0]);
    });
  }, []);

  const generateReport = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    try {
      const res = await api.post(`/ai/report?company=${selectedCompany}`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!report) return;
    try {
      const res = await api.get(`/ai/report/pdf?company=${selectedCompany}&narrative=${encodeURIComponent(report.narrative)}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedCompany}_Financial_Report.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const generateWeeklyDigest = () => {
    setDigestLoading(true);
    setTimeout(() => {
      setDigest({
        improved: ['TechCorp (Margin +2%)', 'EnergyLtd (Debt -5%)'],
        deteriorated: ['HealthInc (Liquidity -10%)'],
        fraudCount: 14,
        highestRisk: 'Alpha Services (Z-Score 1.4)',
        recommendation: 'Freeze credit lines for Alpha Services immediately.',
        summary: "This week's portfolio health shows a net positive trend in the tech sector, offsetting slight liquidity crunches in healthcare. However, the isolation forest model detected a 20% spike in anomalous transactions, primarily clustered around offshore vendor payments. Immediate attention is required for Alpha Services as they have breached the critical Z-score threshold."
      });
      setDigestLoading(false);
    }, 2000);
  };

  const handleApproval = (id, action) => {
    if(action === 'reject') {
      const reason = prompt("Enter reason for rejection/changes requested:");
      if(!reason) return;
    }
    setPendingReports(prev => prev.filter(r => r.id !== id));
    alert(`Report ${id} marked as ${action}.`);
  };

  return (
    <div className="space-y-6 animate-slide-up flex flex-col h-full">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold">AI Reports & Workflows</h1>
          <p className="text-gray-400">Generate insights, approve analyst reports, and view digests.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 shrink-0">
        <button 
          onClick={() => setActiveTab('generate')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'generate' ? 'border-gold text-gold' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Report Generator
        </button>
        <button 
          onClick={() => setActiveTab('digest')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'digest' ? 'border-gold text-gold' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Weekly Digest
        </button>
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'approvals' ? 'border-gold text-gold' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Approval Workflow
          {pendingReports.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingReports.length}</span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* TAB: GENERATOR */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            <div className="glass-card p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Bot className="text-gold" />
                  Groq Analyst
                </h3>
                <p className="text-gray-400 text-sm mt-1">Generate comprehensive narrative reports based on latest financial data.</p>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  className="bg-navy border border-white/20 rounded px-4 py-2 text-white outline-none cursor-pointer"
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                >
                  {companies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button 
                  onClick={generateReport}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                  <FileText size={18} />
                </button>
              </div>
            </div>

            {report && (
              <div className="glass-card p-8 relative animate-in fade-in zoom-in-95">
                <button 
                  onClick={downloadPdf}
                  className="absolute top-8 right-8 btn-secondary flex items-center gap-2"
                >
                  <Download size={18} /> Download PDF
                </button>
                
                <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Executive Summary: {report.company}</h2>
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {report.narrative}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: WEEKLY DIGEST */}
        {activeTab === 'digest' && (
          <div className="space-y-6">
            <div className="glass-card p-6 flex items-center justify-between border-t-4 border-t-blue-500">
              <div>
                <h3 className="text-xl font-bold">Automated Weekly Digest</h3>
                <p className="text-gray-400 text-sm mt-1">AI-synthesized portfolio overview for senior management.</p>
              </div>
              <button 
                onClick={generateWeeklyDigest}
                disabled={digestLoading}
                className="btn-primary flex items-center gap-2"
              >
                {digestLoading ? 'Synthesizing...' : 'Generate Digest'}
                <Mail size={18} />
              </button>
            </div>

            {digest && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
                <div className="glass-card p-8 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Executive Summary</h4>
                    <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-gold pl-4">{digest.summary}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Top Recommendation</h4>
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="text-red-400 shrink-0" size={18}/>
                      <p className="text-sm text-red-300">{digest.recommendation}</p>
                    </div>
                  </div>
                  <button className="btn-secondary w-full flex items-center justify-center gap-2">
                    <Download size={18} /> Export as Email HTML
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 border-l-2 border-green-500">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Improved</h4>
                      <ul className="text-sm text-green-400 space-y-1 list-disc pl-4">{digest.improved.map(i=><li key={i}>{i}</li>)}</ul>
                    </div>
                    <div className="glass-card p-4 border-l-2 border-red-500">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deteriorated</h4>
                      <ul className="text-sm text-red-400 space-y-1 list-disc pl-4">{digest.deteriorated.map(i=><li key={i}>{i}</li>)}</ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 text-center">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Fraud Alerts</h4>
                      <p className="text-3xl font-bold text-orange-400">{digest.fraudCount}</p>
                    </div>
                    <div className="glass-card p-4 text-center border-t-2 border-red-500">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Highest Risk</h4>
                      <p className="text-lg font-bold text-red-400 leading-tight mt-2">{digest.highestRisk}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="p-4 bg-navy/50 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">Pending Analyst Reports</h3>
                <span className="text-xs text-gray-400">All approvals are logged to the Immutable Audit Trail.</span>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-4">Report ID / Type</th>
                    <th className="p-4">Target Company</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4 text-right">Manager Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReports.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No pending reports for approval.</td></tr>
                  ) : pendingReports.map(rep => (
                    <tr key={rep.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{rep.id}</div>
                        <div className="text-sm text-gray-400">{rep.type}</div>
                      </td>
                      <td className="p-4 font-bold text-white">{rep.company}</td>
                      <td className="p-4 text-sm text-gray-300">{rep.author}</td>
                      <td className="p-4 text-sm text-gray-400">{rep.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded text-sm font-bold transition-colors flex items-center gap-1"
                          >
                            <FileText size={14}/> View
                          </button>
                          <button 
                            onClick={() => handleAction(rep.id, 'reject')}
                            className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20 rounded text-sm font-bold transition-colors flex items-center gap-1"
                          >
                            <MessageSquare size={14}/> Revise
                          </button>
                          <button 
                            onClick={() => handleAction(rep.id, 'approve')}
                            className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded text-sm font-bold transition-colors flex items-center gap-1"
                          >
                            <Check size={14}/> Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
