const fs = require('fs');
const path = require('path');

const pages = [
  'ScenarioPlanner',
  'CompetitorDeepDive',
  'ExecutiveScorecard',
  'RiskHeatmap',
  'ROIDashboard',
  'TransactionMonitor',
  'RiskMatrix',
  'StressTesting',
  'ComplianceChecker',
  'AuditTrail'
];

const dir = path.join(__dirname, 'frontend/src/pages');

pages.forEach(page => {
  const content = `export default function ${page}() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">${page.replace(/([A-Z])/g, ' $1').trim()}</h1>
      <div className="glass-card p-6 min-h-[400px] flex items-center justify-center text-gray-400">
        <p>This module is currently under construction. Check back soon for updates.</p>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, `${page}.jsx`), content);
});

console.log('Pages created successfully.');
