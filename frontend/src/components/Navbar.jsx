import { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, HelpCircle, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [nlpQuery, setNlpQuery] = useState('');

  // Notifications Mock
  const notifications = [
    { id: 1, type: 'Fraud Alert', msg: 'Suspicious transaction flagged for Corp A', time: '5m ago', unread: true },
    { id: 2, type: 'Ratio Warning', msg: 'TechCorp ROE dropped below 10%', time: '1h ago', unread: true },
  ];

  // Dark Mode Toggle
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?') setShowShortcuts(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="h-16 border-b border-white/10 bg-navy/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
        
        {/* NLP Query Bar / Global Search */}
        <div className="flex-1 max-w-2xl relative flex items-center group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Sparkles size={18} className="text-gold" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm transition-all"
            placeholder="Ask AI in plain English (e.g. 'show companies with ROE > 15%') or Search globally..."
            value={nlpQuery}
            onChange={(e) => setNlpQuery(e.target.value)}
          />
          {nlpQuery && (
            <button className="absolute right-2 px-3 py-1 bg-gold text-navy text-xs font-bold rounded" onClick={() => alert('NLP Query Processing...')}>
              Analyze
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 ml-4">
          <button onClick={toggleTheme} className="text-gray-400 hover:text-white transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-gray-400 hover:text-white transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-[#112240] ring-1 ring-black ring-opacity-5 border border-white/10 z-50">
                <div className="p-3 border-b border-white/10 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  <button className="text-xs text-gold hover:text-white">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer">
                      <p className="text-sm text-white font-medium">{n.type}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.msg}</p>
                      <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setShowShortcuts(true)} className="text-gray-400 hover:text-white transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a1628] border border-white/20 p-6 rounded-xl shadow-2xl max-w-md w-full relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowShortcuts(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">Keyboard Shortcuts</h2>
            <div className="space-y-3">
              {[
                { key: '?', desc: 'Show shortcuts modal' },
                { key: 'Ctrl + D', desc: 'Go to Dashboard' },
                { key: 'Ctrl + F', desc: 'Go to Fraud Detection' },
                { key: 'Ctrl + R', desc: 'Go to Reports' },
                { key: 'Ctrl + K', desc: 'Focus Global Search' },
              ].map(s => (
                <div key={s.key} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-300">{s.desc}</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-gold text-sm font-mono">{s.key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
