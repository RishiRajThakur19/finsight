import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, PieChart, ShieldAlert, TrendingDown, FileText, LogOut, 
  Target, Crosshair, LayoutDashboard, Map, BarChart, 
  Activity, AlertTriangle, Zap, CheckSquare, List 
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navSections = [
    {
      title: "General",
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
        { name: 'Financial Ratios', path: '/dashboard/ratios', icon: <PieChart size={18} /> },
        { name: 'Fraud Detection', path: '/dashboard/fraud', icon: <ShieldAlert size={18} /> },
        { name: 'Bankruptcy Risk', path: '/dashboard/bankruptcy', icon: <TrendingDown size={18} /> },
        { name: 'AI Reports', path: '/dashboard/reports', icon: <FileText size={18} /> },
      ]
    },
    {
      title: "Analyst",
      items: [
        { name: 'Scenario Planner', path: '/dashboard/scenario-planner', icon: <Target size={18} /> },
        { name: 'Competitor Deep Dive', path: '/dashboard/competitor-deep-dive', icon: <Crosshair size={18} /> },
      ]
    },
    {
      title: "Senior Manager",
      items: [
        { name: 'Executive Scorecard', path: '/dashboard/executive-scorecard', icon: <LayoutDashboard size={18} /> },
        { name: 'Portfolio Heatmap', path: '/dashboard/risk-heatmap', icon: <Map size={18} /> },
        { name: 'ROI Dashboard', path: '/dashboard/roi-dashboard', icon: <BarChart size={18} /> },
      ]
    },
    {
      title: "Risk Officer",
      items: [
        { name: 'Transaction Monitor', path: '/dashboard/transaction-monitor', icon: <Activity size={18} /> },
        { name: 'Risk Matrix', path: '/dashboard/risk-matrix', icon: <AlertTriangle size={18} /> },
        { name: 'Stress Testing', path: '/dashboard/stress-testing', icon: <Zap size={18} /> },
        { name: 'Compliance Checker', path: '/dashboard/compliance-checker', icon: <CheckSquare size={18} /> },
        { name: 'Audit Trail', path: '/dashboard/audit-trail', icon: <List size={18} /> },
      ]
    }
  ];

  return (
    <div className="w-64 h-screen bg-navy border-r border-white/10 flex flex-col fixed overflow-y-auto custom-scrollbar">
      <div className="px-6 py-6 sticky top-0 bg-navy z-10 border-b border-white/5">
        <h2 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gold to-white">
          FinSight
        </h2>
      </div>
      
      <div className="flex-1 py-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-6 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <nav className="space-y-1 px-3">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${isActive ? 'bg-gold/10 text-gold border border-gold/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 sticky bottom-0 bg-navy">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-colors">
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
