import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, TrendingUp } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#0a1628]">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-navy to-navy pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gold to-white">
          FinSight
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Financial Risk & Intelligence Dashboard for the Modern Analyst
        </p>
        
        <Link to="/login" className="btn-primary text-lg px-8 py-4 rounded-full shadow-[0_0_20px_rgba(240,180,41,0.4)] hover:shadow-[0_0_30px_rgba(240,180,41,0.6)] transition-all">
          Enter Dashboard
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 z-10 max-w-5xl px-4">
        {[
          { icon: <TrendingUp className="w-8 h-8 text-gold mb-4" />, title: "Predictive Analytics", desc: "Forecast bankruptcy and financial distress with ML." },
          { icon: <ShieldAlert className="w-8 h-8 text-gold mb-4" />, title: "Fraud Detection", desc: "Identify anomalous transactions instantly." },
          { icon: <Activity className="w-8 h-8 text-gold mb-4" />, title: "AI Reports", desc: "Generate actionable narratives using Llama3." },
        ].map((feat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 * idx }}
            className="glass-card p-6 text-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="flex justify-center">{feat.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
            <p className="text-gray-400 text-sm">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
