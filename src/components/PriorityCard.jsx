import React from 'react';
import { Brain } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

const PriorityCard = ({ area, riskLevel, reason, sentimentTrend, trendData }) => (
    <div className="relative overflow-hidden bg-slate-900/60 border border-white/5 p-5 rounded-2xl hover:bg-slate-800/80 transition-all duration-300 shadow-lg backdrop-blur-md">
        {/* Side Glow indicating Priority Level */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${riskLevel === 'Critical' ? 'bg-red-500 shadow-[2px_0_15px_rgba(239,68,68,0.8)]' : 'bg-amber-500 shadow-[2px_0_15px_rgba(245,158,11,0.6)]'}`} />

        <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
                <h4 className="text-white font-bold text-lg">{area}</h4>
                <div className="flex items-center mt-2 text-xs text-indigo-400 space-x-2 bg-indigo-500/10 px-2 py-1.5 rounded-lg border border-indigo-500/20 w-fit">
                    <Brain size={14} className="flex-shrink-0 animate-pulse" />
                    <span className="italic uppercase tracking-wider font-semibold">{reason}</span>
                </div>
            </div>
            <div className="text-right flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">Sentiment</span>
                <p className={`text-xl font-black ${sentimentTrend < 0 ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]'}`}>
                    {sentimentTrend > 0 ? '+' : ''}{sentimentTrend}%
                </p>
                <span className="text-xs text-slate-400 uppercase">this hour</span>
            </div>
        </div>

        {/* Mini Sparkline */}
        {trendData && (
            <div className="h-10 mt-3 w-full opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={sentimentTrend < 0 ? '#f87171' : '#34d399'}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )}

        <button className="mt-4 w-full py-2.5 bg-indigo-600 border border-indigo-500/50 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.7)] flex items-center justify-center space-x-2">
            <span>VIEW EVIDENCE & DISPATCH</span>
        </button>
    </div>
);

export default PriorityCard;
