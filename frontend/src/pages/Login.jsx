import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('analyst@finsight.com');
  const [password, setPassword] = useState('analyst123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const res = await api.post('/auth/token', formData);
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-10 w-full max-w-md z-10"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gold">FinSight Login</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-navy/50 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-navy/50 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full btn-primary mt-6">Secure Login</button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-3 text-center">Demo Credentials</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {['analyst', 'manager', 'risk'].map(role => (
              <button 
                key={role}
                onClick={() => { setEmail(`${role}@finsight.com`); setPassword(`${role}123`); }}
                className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded border border-white/10 transition-colors"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
