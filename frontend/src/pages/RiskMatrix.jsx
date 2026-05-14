import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Info } from 'lucide-react';

export default function RiskMatrix() {
  const containerRef = useRef(null);
  const [containerBounds, setContainerBounds] = useState({ width: 0, height: 0 });

  const initialRisks = [
    { id: '1', name: 'TechCorp Liquidity', likelihood: 80, impact: 90, size: 40, category: 'Critical' },
    { id: '2', name: 'HealthInc Leverage', likelihood: 30, impact: 85, size: 25, category: 'Prepare' },
    { id: '3', name: 'RetailCo Growth', likelihood: 70, impact: 40, size: 30, category: 'Monitor' },
    { id: '4', name: 'EnergyLtd Debt', likelihood: 20, impact: 20, size: 35, category: 'Routine' },
    { id: '5', name: 'Finance LLC Fraud', likelihood: 65, impact: 75, size: 50, category: 'Urgent' },
  ];

  const [risks, setRisks] = useState(initialRisks);

  useEffect(() => {
    if (containerRef.current) {
      setContainerBounds({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setContainerBounds({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (event, info, id) => {
    if (!containerBounds.width || !containerBounds.height) return;
    
    // Calculate new percentage position
    // info.point is absolute page coordinates. We need relative to container.
    // However, framer motion handles the drag state internally, so it's easier to just
    // use a basic uncontrolled draggable bubble and save the new positions if needed, 
    // but for UI demo, just having them draggable is great.
  };

  return (
    <div className="space-y-6 animate-slide-up h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Risk Scoring Matrix</h1>
          <p className="text-gray-400">Interactive 2x2 likelihood vs impact assessment. Drag bubbles to reassess.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} /> Export Register
          </button>
        </div>
      </div>

      <div className="glass-card flex-1 relative p-8 flex flex-col mt-4">
        
        {/* Y Axis Label */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 font-bold tracking-widest uppercase text-sm">
          Impact
        </div>
        
        {/* X Axis Label */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-400 font-bold tracking-widest uppercase text-sm">
          Likelihood
        </div>

        {/* Matrix Container */}
        <div 
          ref={containerRef}
          className="flex-1 border-l-2 border-b-2 border-white/20 relative ml-6 mb-6"
        >
          {/* Quadrant Guidelines */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 border-r border-dashed border-white/20"></div>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10 border-b border-dashed border-white/20"></div>

          {/* Quadrant Labels */}
          <div className="absolute top-4 right-4 text-red-500/30 font-black text-2xl select-none">CRITICAL</div>
          <div className="absolute top-4 left-4 text-yellow-500/30 font-black text-2xl select-none">PREPARE</div>
          <div className="absolute bottom-4 right-4 text-orange-500/30 font-black text-2xl select-none">MONITOR</div>
          <div className="absolute bottom-4 left-4 text-green-500/30 font-black text-2xl select-none">ROUTINE</div>

          {/* Draggable Bubbles */}
          {containerBounds.width > 0 && risks.map((risk) => {
            const x = (risk.likelihood / 100) * containerBounds.width;
            const y = ((100 - risk.impact) / 100) * containerBounds.height;
            
            // Color based on initial quadrant
            let color = 'bg-blue-500';
            if (risk.likelihood > 50 && risk.impact > 50) color = 'bg-red-500';
            else if (risk.likelihood <= 50 && risk.impact > 50) color = 'bg-yellow-500';
            else if (risk.likelihood > 50 && risk.impact <= 50) color = 'bg-orange-500';
            else color = 'bg-green-500';

            return (
              <motion.div
                key={risk.id}
                drag
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                onDragEnd={(e, info) => handleDragEnd(e, info, risk.id)}
                initial={{ x, y: y, scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                whileDrag={{ scale: 1.1, zIndex: 20, cursor: 'grabbing' }}
                className={`absolute rounded-full flex items-center justify-center cursor-grab shadow-lg shadow-black/50 border border-white/20 ${color}`}
                style={{
                  width: risk.size * 2,
                  height: risk.size * 2,
                  marginLeft: -risk.size,
                  marginTop: -risk.size,
                }}
              >
                <div className="text-center p-2">
                  <p className="text-[10px] font-bold text-white leading-tight drop-shadow-md">{risk.name}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
