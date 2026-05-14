import { useState } from 'react';
import { Activity, Check, X, Search, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function TransactionMonitor() {
  const [transactions, setTransactions] = useState([
    { id: 'TRX-8921', company: 'GlobalCorp', amount: 450000, risk: 'High', type: 'Wire Transfer', time: '2 mins ago', status: 'pending' },
    { id: 'TRX-8922', company: 'TechFin LLC', amount: 12500, risk: 'Medium', type: 'Vendor Payment', time: '15 mins ago', status: 'pending' },
    { id: 'TRX-8923', company: 'Alpha Services', amount: 890000, risk: 'Critical', type: 'Offshore Transfer', time: '1 hr ago', status: 'pending' },
    { id: 'TRX-8924', company: 'HealthInc', amount: 3400, risk: 'Low', type: 'Payroll', time: '2 hrs ago', status: 'pending' },
    { id: 'TRX-8925', company: 'EnergyLtd', amount: 150000, risk: 'High', type: 'Consulting Fee', time: '3 hrs ago', status: 'pending' },
  ]);

  const handleAction = (id, action) => {
    setTransactions(transactions.filter(t => t.id !== id));
    // In a real app, send API request to approve/reject
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Real-Time Transaction Monitor</h1>
          <p className="text-gray-400">Live feed of flagged transactions requiring Risk Officer review.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search ID or Company..." 
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold outline-none w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <Activity size={32} className="text-blue-400 mb-2" />
          <p className="text-3xl font-bold text-white">{transactions.length}</p>
          <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">In Queue</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <ShieldAlert size={32} className="text-red-400 mb-2" />
          <p className="text-3xl font-bold text-red-400">{transactions.filter(t => t.risk === 'Critical' || t.risk === 'High').length}</p>
          <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">High/Critical Risk</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <AlertTriangle size={32} className="text-gold mb-2" />
          <p className="text-3xl font-bold text-gold">$1.4M</p>
          <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Value at Risk</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-navy/50 border-b border-white/10">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Company</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Risk Level</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">No pending transactions in queue.</td>
              </tr>
            ) : transactions.map((t) => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white">{t.id}</div>
                  <div className="text-xs text-gray-500">{t.type}</div>
                </td>
                <td className="p-4 text-gray-300">{t.company}</td>
                <td className="p-4 font-bold text-white">${t.amount.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskColor(t.risk)}`}>
                    {t.risk}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-sm">{t.time}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleAction(t.id, 'investigate')}
                      className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded text-sm font-bold transition-colors"
                    >
                      Investigate
                    </button>
                    <button 
                      onClick={() => handleAction(t.id, 'reject')}
                      className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded transition-colors"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(t.id, 'accept')}
                      className="p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded transition-colors"
                      title="Accept"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
