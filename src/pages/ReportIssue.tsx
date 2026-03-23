import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignalSheet } from '../components/report/SignalSheet';

export const ReportIssue = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => navigate('/'), 400); // 400ms to allow Framer Motion exit animation
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background with abstract grid and glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6 backdrop-blur-md">
           <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-slow"></span>
           <span className="text-cyan-300 text-sm font-medium tracking-wide uppercase">Signal Hub Ready</span>
         </div>
         <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Civic Issue Reporting</h1>
         <p className="text-slate-400 max-w-lg mx-auto mb-8 font-light leading-relaxed">
           You closed the active reporting sheet.
         </p>
         <button onClick={() => setIsOpen(true)} className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
           Reopen Signal Hub
         </button>
      </div>

      <SignalSheet isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};
