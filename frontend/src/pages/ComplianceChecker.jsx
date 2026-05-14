import { useState } from 'react';
import { ShieldCheck, XCircle, AlertCircle, CheckCircle, Download } from 'lucide-react';

export default function ComplianceChecker() {
  const regulations = [
    { id: 1, name: 'Basel III Capital Adequacy', threshold: '> 8.0%', actual: '10.5%', status: 'pass', requirement: 'Minimum Tier 1 Capital Ratio' },
    { id: 2, name: 'Liquidity Coverage Ratio (LCR)', threshold: '> 100%', actual: '92%', status: 'fail', requirement: 'High-quality liquid assets vs total net cash outflows' },
    { id: 3, name: 'Net Stable Funding Ratio (NSFR)', threshold: '> 100%', actual: '104%', status: 'pass', requirement: 'Available stable funding vs required stable funding' },
    { id: 4, name: 'Standard Leverage Limit', threshold: '< 15.0x', actual: '14.2x', status: 'warning', requirement: 'Total Debt / EBITDA max threshold' },
    { id: 5, name: 'Dodd-Frank Stress Test', threshold: 'Pass', actual: 'Review', status: 'warning', requirement: 'Annual CCAR quantitative assessment' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Regulatory Compliance Checker</h1>
          <p className="text-gray-400">Automated benchmark testing against standard financial regulations.</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download size={18} /> Export Compliance Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-l-4 border-green-500 flex items-center gap-4">
          <ShieldCheck size={40} className="text-green-500" />
          <div>
            <p className="text-3xl font-bold text-white">2</p>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Passed Checks</p>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-yellow-500 flex items-center gap-4">
          <AlertCircle size={40} className="text-yellow-500" />
          <div>
            <p className="text-3xl font-bold text-white">2</p>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Warnings</p>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-red-500 flex items-center gap-4">
          <XCircle size={40} className="text-red-500" />
          <div>
            <p className="text-3xl font-bold text-red-400">1</p>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Violations</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 bg-navy/50 border-b border-white/10">
          <h3 className="font-bold text-lg text-white">GlobalBank Corp - Q3 Compliance Status</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4">Regulation Standard</th>
              <th className="p-4">Requirement</th>
              <th className="p-4">Required Threshold</th>
              <th className="p-4">Actual Measured</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {regulations.map(reg => (
              <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white">{reg.name}</td>
                <td className="p-4 text-sm text-gray-400">{reg.requirement}</td>
                <td className="p-4 text-sm font-mono text-gray-300">{reg.threshold}</td>
                <td className="p-4 text-sm font-mono font-bold text-white">{reg.actual}</td>
                <td className="p-4 text-center">
                  {reg.status === 'pass' && <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-green-500/50 bg-green-500/10 text-green-400"><CheckCircle size={14}/> Pass</div>}
                  {reg.status === 'warning' && <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-500/50 bg-yellow-500/10 text-yellow-400"><AlertCircle size={14}/> Warning</div>}
                  {reg.status === 'fail' && <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-red-500/50 bg-red-500/10 text-red-400"><XCircle size={14}/> Violation</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="glass-card p-6 bg-red-500/5 border-red-500/20 mt-6">
        <h3 className="font-bold text-red-400 flex items-center gap-2 mb-2"><XCircle size={18}/> Remediation Required</h3>
        <p className="text-sm text-gray-300">The <strong>Liquidity Coverage Ratio (LCR)</strong> has fallen below the 100% regulatory minimum to 92%. A formal remediation plan must be submitted to the Risk Committee within 48 hours detailing steps to acquire high-quality liquid assets to bridge the 8% shortfall.</p>
      </div>
    </div>
  );
}
