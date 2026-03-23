import React from 'react';
import { Map, Zap, Target } from 'lucide-react';

const HeatmapWidget = () => {
    return (
        <div className="flex flex-col h-full bg-slate-900/40 border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden group">
            {/* Background Grid Pattern (Wireframe effect) */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #4f46e5 1px, transparent 1px),
            linear-gradient(to bottom, #4f46e5 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
                    transformOrigin: 'top center'
                }}
            />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500/50 rounded-br-2xl" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center space-x-2">
                    <Map className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-slate-200">Emerging Risk Heatmap</h3>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                    <span className="flex items-center text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1 animate-ping"></span>Predictive</span>
                    <span className="flex items-center text-red-500 ml-3"><span className="w-2 h-2 rounded-full bg-red-500 mr-1 shadow-[0_0_5px_rgba(239,68,68,1)]"></span>Critical</span>
                </div>
            </div>

            <div className="flex-1 relative z-10 w-full h-full min-h-[300px] flex items-center justify-center">
                {/* Abstract Map Nodes */}

                {/* Center Node (Safe) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20" />

                {/* Risk Node 1 (Pulsing Aura - Predictive Intelligence) */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.9)] z-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="absolute inset-0 rounded-full border border-amber-400 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <div className="absolute inset-[-10px] rounded-full border border-amber-500/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]" />
                    <Target size={10} className="text-amber-100" />
                    <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-amber-200 whitespace-nowrap bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/30">Transit Hub</span>
                </div>

                {/* Risk Node 2 (Critical - Red) */}
                <div className="absolute bottom-1/3 right-1/4 w-5 h-5 rounded-full bg-red-600 shadow-[0_0_30px_rgba(220,38,38,1)] z-20 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                    <div className="absolute inset-[-5px] rounded-full border border-red-500/50 animate-pulse" />
                    <Zap size={12} className="text-white fill-white" />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-300 whitespace-nowrap bg-slate-900/90 px-2 py-1 rounded shadow-lg border border-red-500/50">Sector 15</span>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-red-500/50 p-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                        <span className="font-bold text-red-400">Sector 15 Insights:</span> Sentiment -30%
                    </div>
                </div>

                {/* Connecting Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-40">
                    <path d="M 50% 50% L 33% 25%" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                    <path d="M 50% 50% L 75% 66%" stroke="#ef4444" strokeWidth="2" />
                </svg>

            </div>

            <div className="mt-4 relative z-10">
                <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-xl p-3 flex items-start space-x-3">
                    <div className="bg-indigo-500/20 p-1.5 rounded-lg flex-shrink-0 animate-pulse">
                        <Target size={16} className="text-indigo-300" />
                    </div>
                    <p className="text-sm text-indigo-100 leading-tight">
                        <span className="text-indigo-300 font-bold block mb-0.5">AI Insights Engine</span>
                        3 predictive zones identified based on dropping safety score metrics running counter to zero formal complaints.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeatmapWidget;
