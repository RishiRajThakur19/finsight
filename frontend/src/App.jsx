import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Ratios from './pages/Ratios';
import Fraud from './pages/Fraud';
import Bankruptcy from './pages/Bankruptcy';
import Reports from './pages/Reports';

// Analyst Pages
import ScenarioPlanner from './pages/ScenarioPlanner';
import CompetitorDeepDive from './pages/CompetitorDeepDive';

// Senior Manager Pages
import ExecutiveScorecard from './pages/ExecutiveScorecard';
import RiskHeatmap from './pages/RiskHeatmap';
import ROIDashboard from './pages/ROIDashboard';

// Risk Officer Pages
import TransactionMonitor from './pages/TransactionMonitor';
import RiskMatrix from './pages/RiskMatrix';
import StressTesting from './pages/StressTesting';
import ComplianceChecker from './pages/ComplianceChecker';
import AuditTrail from './pages/AuditTrail';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="ratios" element={<Ratios />} />
          <Route path="fraud" element={<Fraud />} />
          <Route path="bankruptcy" element={<Bankruptcy />} />
          <Route path="reports" element={<Reports />} />

          {/* Analyst */}
          <Route path="scenario-planner" element={<ScenarioPlanner />} />
          <Route path="competitor-deep-dive" element={<CompetitorDeepDive />} />

          {/* Senior Manager */}
          <Route path="executive-scorecard" element={<ExecutiveScorecard />} />
          <Route path="risk-heatmap" element={<RiskHeatmap />} />
          <Route path="roi-dashboard" element={<ROIDashboard />} />

          {/* Risk Officer */}
          <Route path="transaction-monitor" element={<TransactionMonitor />} />
          <Route path="risk-matrix" element={<RiskMatrix />} />
          <Route path="stress-testing" element={<StressTesting />} />
          <Route path="compliance-checker" element={<ComplianceChecker />} />
          <Route path="audit-trail" element={<AuditTrail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
