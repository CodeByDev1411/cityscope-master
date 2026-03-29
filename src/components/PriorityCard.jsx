import React from 'react';
import { Brain } from 'lucide-react';

const riskStyles = {
    CRITICAL: {
        rail: 'bg-red-500 shadow-[2px_0_15px_rgba(239,68,68,0.8)]',
        badge: 'bg-red-500/10 text-red-300 border-red-500/30',
        value: 'text-red-400',
    },
    HIGH: {
        rail: 'bg-orange-500 shadow-[2px_0_15px_rgba(249,115,22,0.8)]',
        badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
        value: 'text-orange-300',
    },
    MEDIUM: {
        rail: 'bg-amber-500 shadow-[2px_0_15px_rgba(245,158,11,0.6)]',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        value: 'text-amber-300',
    },
    LOW: {
        rail: 'bg-emerald-500 shadow-[2px_0_15px_rgba(16,185,129,0.6)]',
        badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        value: 'text-emerald-300',
    },
};

const PriorityCard = ({ area, riskLevel, totalCrime, intensity, primaryOffense }) => {
    const tone = riskStyles[riskLevel] || riskStyles.MEDIUM;

    return (
        <div className="relative overflow-hidden bg-slate-900/60 border border-white/5 p-5 rounded-2xl hover:bg-slate-800/80 transition-all duration-300 shadow-lg backdrop-blur-md">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${tone.rail}`} />

            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h4 className="text-white font-bold text-lg">{area}</h4>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300 bg-indigo-500/10 border-indigo-500/20">
                        <Brain size={14} className="flex-shrink-0" />
                        Crime Intelligence Feed
                    </div>
                </div>
                <div className={`rounded-full border px-3 py-1 text-xs font-bold tracking-[0.2em] ${tone.badge}`}>
                    {riskLevel}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Total Crime</div>
                    <div className={`mt-1 text-xl font-black ${tone.value}`}>{totalCrime}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Intensity</div>
                    <div className="mt-1 text-xl font-black text-slate-100">{Math.round(intensity)}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Lead Signal</div>
                    <div className="mt-1 text-sm font-bold text-slate-100">{primaryOffense}</div>
                </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Backend crime scoring flags this station area as a {riskLevel.toLowerCase()} risk zone with {totalCrime} reported incidents in the current dataset.
            </p>

            <button className="mt-4 w-full py-2.5 bg-indigo-600 border border-indigo-500/50 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.7)] flex items-center justify-center space-x-2">
                <span>VIEW RISK PROFILE</span>
            </button>
        </div>
    );
};

export default PriorityCard;
