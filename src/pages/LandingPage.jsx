import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, Eye, Database, Shield, Server } from 'lucide-react';

const CyberCard = ({ title, icon, desc, glowColor }) => {
  // Map our generic color string to tailwind specific classes
  const colorMap = {
    cyan: {
      glow: 'from-transparent via-cyan-500/10 to-transparent',
      ring: 'group-hover:ring-cyan-500/50',
      text: 'text-cyan-400',
      shadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]'
    },
    violet: {
      glow: 'from-transparent via-violet-500/10 to-transparent',
      ring: 'group-hover:ring-violet-500/50',
      text: 'text-violet-400',
      shadow: 'hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]'
    },
    blue: {
      glow: 'from-transparent via-blue-500/10 to-transparent',
      ring: 'group-hover:ring-blue-500/50',
      text: 'text-blue-400',
      shadow: 'hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]'
    }
  };

  const theme = colorMap[glowColor] || colorMap.cyan;

  return (
    <div className={`relative group p-8 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-white/20 ${theme.shadow}`}>
      {/* Hover Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${theme.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className={`p-4 bg-slate-800 rounded-2xl w-fit mb-6 ring-1 ring-white/10 ${theme.ring} transition-all duration-500`}>
          {React.cloneElement(icon, { className: `w-8 h-8 ${theme.text}` })}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/10 pt-20">
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-950/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-slow"></span>
          <span className="text-cyan-300 text-sm font-medium tracking-wide uppercase">System Online</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight">
          CityScope <br /><span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">Neural Nexus</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl font-light leading-relaxed">
          The autonomous cyber-intelligence core. Real-time urban analytics driven by predictive machine learning.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button onClick={() => navigate('/dashboard')} className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            Initialize Dashboard
          </button>
          <button onClick={() => navigate('/map')} className="px-8 py-4 rounded-xl bg-slate-800/50 backdrop-blur-md border border-white/10 hover:border-white/20 text-white font-medium transition-all hover:bg-slate-800/80">
            View Live Intel
          </button>
          <button onClick={() => navigate('/report')} className="px-8 py-4 rounded-xl bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-300 font-medium hover:bg-indigo-500/30 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            Report Civic Issue
          </button>
        </div>
      </div>

      {/* City Wireframe Graphic */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-30 pointer-events-none overflow-hidden flex items-end justify-center">
        <div className="relative w-full max-w-7xl h-full flex items-end gap-1 px-4">
          {/* Scanning line */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] animate-scan z-20"></div>

          {/* Abstract Buildings */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="flex-1 border border-cyan-500/30 bg-slate-900/50"
              style={{
                height: `${Math.random() * 80 + 20}%`,
                boxShadow: 'inset 0 0 10px rgba(34,211,238,0.1)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const CyberPulseTicker = () => {
  const [data, setData] = useState([
    { label: "GRID STATUS", val: "NOMINAL", glow: "text-cyan-400" },
    { label: "ACTIVE NODES", val: "14,204", glow: "text-blue-400" },
    { label: "THREAT LEVEL", val: "ALPHA ZERO", glow: "text-green-400" },
    { label: "DATA STREAM", val: "2.4 PB/S", glow: "text-violet-400" },
  ]);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border-t border-b border-b-white/5 shadow-[0_-2px_15px_rgba(34,211,238,0.15)] relative" style={{ borderTopColor: 'rgba(34, 211, 238, 0.4)' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white font-bold tracking-wider">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse-slow" />
          <span>SYS.TELEMETRY</span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 flex-1 px-8">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center md:items-start">
              <span className="text-xs text-slate-500 font-bold tracking-widest">{item.label}</span>
              <span className={`text-sm font-mono tracking-wider ${item.glow} drop-shadow-[0_0_5px_currentColor]`}>{item.val}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs text-slate-400 font-mono">REC</span>
        </div>
      </div>
    </div>
  );
};

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      {/* Global Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-950/30 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-950/20 blur-[150px]" />
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#020617]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Zap className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">CITY<span className="text-cyan-400">SCOPE</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-cyan-400 transition-colors">Overview</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Intel Map</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Nodes</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Systems</a>
          </div>
          <button className="px-5 py-2.5 rounded-lg border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all text-sm">
            Access Core
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        <HeroSection />
        <CyberPulseTicker />

        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Protocols</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The foundational systems that interpret raw urban data into actionable directives.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <CyberCard
              title="Sensory Grid"
              icon={<Eye />}
              desc="Millions of urban data points collected via decentralized IOT networks to form a complete operational picture."
              glowColor="cyan"
            />
            <CyberCard
              title="Neural Analysis"
              icon={<Database />}
              desc="Deep learning clusters process environmental, transit, and social telemetry to predict urban anomalies in real-time."
              glowColor="violet"
            />
            <CyberCard
              title="Autonomous Action"
              icon={<Shield />}
              desc="Automated infrastructure response protocols deploy countermeasures before critical failures occur."
              glowColor="blue"
            />
          </div>
        </section>

        {/* Intelligence Map Placeholder */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="relative w-full h-[600px] rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl overflow-hidden flex items-center justify-center p-8 group">
            {/* Map Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-transparent pointer-events-none" />

            <div className="text-center relative z-10 transition-transform duration-700 group-hover:scale-105">
              <Server className="w-16 h-16 text-cyan-400/50 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse-slow" />
              <h3 className="text-3xl font-bold mb-4 text-white">Dark Intelligence Map</h3>
              <p className="text-slate-400 max-w-lg mx-auto">Visualizing the heartbeat of the city. A living organism of interconnected data layers pulsating in real-time.</p>
              <div className="mt-8 inline-flex items-center gap-2 text-cyan-400 font-mono text-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                CONNECTING TO GEOSPATIAL CLUSTERS...
              </div>
            </div>

            {/* Abstract map grid styling */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#020617]/80 backdrop-blur-xl py-12 text-center text-slate-500 relative z-10">
        <p className="font-mono text-sm tracking-widest">© 2026 CITYSCOPE NEURAL NETWORK.</p>
        <p className="text-xs mt-2 text-slate-600">UNAUTHORIZED ACCESS WILL BE LOGGED AND TRACED.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
