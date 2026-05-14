import { useState } from 'react';
import { Search, Filter, Download, Lock, Clock, User, ShieldAlert, FileText, CheckCircle } from 'lucide-react';

export default function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const auditLogs = [
    { id: 'LOG-9921', timestamp: '2026-05-14 14:32:01', user: 'jane.smith@finsight.com', role: 'Risk Officer', action: 'System Login', category: 'Auth', details: 'Successful login from IP 192.168.1.105', status: 'Success' },
    { id: 'LOG-9922', timestamp: '2026-05-14 14:45:12', user: 'jane.smith@finsight.com', role: 'Risk Officer', action: 'Rejected Transaction', category: 'Transaction', details: 'Rejected TRX-8921 (GlobalCorp) - High Risk Anomaly', status: 'Success' },
    { id: 'LOG-9923', timestamp: '2026-05-14 15:10:44', user: 'mark.roberts@finsight.com', role: 'Analyst', action: 'Generated Data Story', category: 'AI Tools', details: 'Ran Groq AI Narrative for HealthInc', status: 'Success' },
    { id: 'LOG-9924', timestamp: '2026-05-14 15:22:10', user: 'mark.roberts@finsight.com', role: 'Analyst', action: 'Scenario Simulation', category: 'Stress Testing', details: 'Ran Recession Scenario on Retail Risk Portfolio', status: 'Success' },
    { id: 'LOG-9925', timestamp: '2026-05-14 16:05:33', user: 'sarah.j@finsight.com', role: 'Senior Manager', action: 'Approved Report', category: 'Workflow', details: 'Approved Q3 Risk Assessment for Alpha Services', status: 'Success' },
    { id: 'LOG-9926', timestamp: '2026-05-14 16:18:02', user: 'system_daemon', role: 'System', action: 'Compliance Check Failed', category: 'System', details: 'LCR dropped below threshold for GlobalBank', status: 'Warning' },
  ];

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Auth': return <Lock size={16} className="text-gray-400" />;
      case 'Transaction': return <ShieldAlert size={16} className="text-red-400" />;
      case 'AI Tools': return <FileText size={16} className="text-gold" />;
      case 'Workflow': return <CheckCircle size={16} className="text-green-400" />;
      case 'System': return <AlertCircle size={16} className="text-yellow-400" />;
      default: return <Clock size={16} className="text-blue-400" />;
    }
  };

  const filteredLogs = auditLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Lock className="text-gold" /> Immutable Audit Trail
          </h1>
          <p className="text-gray-400">Cryptographically verifiable log of all system actions.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search user, action, details..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold outline-none w-64"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} /> Filters
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-navy/50 border-b border-white/10">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Timestamp (UTC)</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User / Role</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action Category</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Detailed Activity</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                <td className="p-4 font-mono text-gray-400">{log.timestamp}</td>
                <td className="p-4">
                  <div className="font-bold text-white flex items-center gap-2"><User size={14} className="text-gray-400"/> {log.user}</div>
                  <div className="text-xs text-gray-500 mt-1">{log.role}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(log.category)}
                    <span className="font-medium text-gray-300">{log.action}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-400 max-w-md truncate" title={log.details}>
                  {log.details}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'Success' ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-navy/80 border-t border-white/10 text-xs text-gray-500 flex justify-between items-center">
          <p>Showing {filteredLogs.length} of 1,482 logs</p>
          <p className="flex items-center gap-1"><Lock size={12}/> Logs are cryptographically hashed and cannot be modified or deleted.</p>
        </div>
      </div>
    </div>
  );
}

// Helper icon
function AlertCircle({size, className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  );
}
