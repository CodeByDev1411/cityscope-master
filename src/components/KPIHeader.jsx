import React, { useEffect, useMemo, useState } from 'react';
import { AlertOctagon, Activity, Zap, Clock } from 'lucide-react';
import { fetchCrimeSummary } from '../pages/cityscopeApi';

const KPIHeader = () => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        fetchCrimeSummary().then(setSummary);
    }, []);

    const criticalHotspots = summary?.risk_distribution?.CRITICAL ?? 0;
    const activeSignals = summary ? Object.values(summary.risk_distribution || {}).reduce((sum, count) => sum + Number(count), 0) : 0;
    const mostDangerous = summary?.most_dangerous?.[0];
    const dangerIndex = useMemo(() => {
        if (!summary?.most_dangerous?.length) return 0;
        const total = summary.most_dangerous.reduce((sum, item) => sum + Number(item.crime_score_normalized || 0), 0);
        return Math.round(total / summary.most_dangerous.length);
    }, [summary]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Critical Hotspots */}
            <div className="relative group bg-slate-900/60 border border-red-500/20 p-6 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -left-1 top-0 bottom-0 w-2 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Critical Hotspots</p>
                        <h3 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">{criticalHotspots}</h3>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-xl">
                        <AlertOctagon className="w-6 h-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-400 font-medium">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse-slow"></span>
                    {summary ? `${summary.total_areas} station areas scored` : 'Waiting for backend summary'}
                </div>
            </div>

            {/* Top Risk Zone */}
            <div className="relative group bg-slate-900/60 border border-purple-500/20 p-6 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -left-1 top-0 bottom-0 w-2 bg-gradient-to-b from-purple-500 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]" />

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Top Risk Zone</p>
                        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.3)]">
                            {mostDangerous ? Math.round(mostDangerous.crime_score_normalized) : 0}
                        </h3>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                        <Activity className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-400 font-medium">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    {mostDangerous ? `${mostDangerous.nm_pol} // ${mostDangerous.risk_level}` : 'No summary available'}
                </div>
            </div>

            {/* Active Signals */}
            <div className="relative group bg-slate-900/60 border border-blue-500/20 p-6 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -left-1 top-0 bottom-0 w-2 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Active Signals</p>
                        <h3 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{activeSignals}</h3>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Zap className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-400 font-medium">
                    {summary ? `${summary.risk_distribution.HIGH ?? 0} high-risk areas` : 'Crime feed offline'}
                </div>
            </div>

            {/* Danger Index */}
            <div className="relative group bg-slate-900/60 border border-green-500/20 p-6 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -left-1 top-0 bottom-0 w-2 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Danger Index</p>
                        <h3 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{dangerIndex}</h3>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <Clock className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-400 font-medium">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Average of top 5 backend risk scores
                </div>
            </div>
        </div>
    );
};

export default KPIHeader;
