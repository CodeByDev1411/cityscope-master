import React from 'react';
import { RadioTower, Activity, AlertTriangle, Lightbulb } from 'lucide-react';

const IntelligenceFeed = () => {
    const insights = [
        {
            id: 1,
            type: 'anomaly',
            icon: <Activity size={16} className="text-purple-400" />,
            title: 'Structural Anomaly',
            content: 'Streetlight failure pattern in North Delhi suggests a wider power grid anomaly.',
            time: 'Just now',
            color: 'border-purple-500/30 bg-purple-500/5'
        },
        {
            id: 2,
            type: 'prediction',
            icon: <Lightbulb size={16} className="text-amber-400" />,
            title: 'Predictive Alert',
            content: 'Expected 40% surge in transit hub traffic based on upcoming major event concluding.',
            time: '12m ago',
            color: 'border-amber-500/30 bg-amber-500/5'
        },
        {
            id: 3,
            type: 'critical',
            icon: <AlertTriangle size={16} className="text-red-400" />,
            title: 'Correlated Incidents',
            content: '3 distinct noise complaints in Sector 15 correlate strongly with unauthorized gathering reports.',
            time: '45m ago',
            color: 'border-red-500/30 bg-red-500/5'
        },
        {
            id: 4,
            type: 'system',
            icon: <RadioTower size={16} className="text-emerald-400" />,
            title: 'System Optimization',
            content: 'AI automatically re-routed 2 patrol units near Central Mall due to high predictive risk score.',
            time: '1h ago',
            color: 'border-emerald-500/30 bg-emerald-500/5'
        }
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-6">
                <RadioTower className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-200">Automated Insights</h3>
                <span className="relative flex h-3 w-3 ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
            </div>

            <div className="space-y-4 pr-1">
                {insights.map((insight) => (
                    <div
                        key={insight.id}
                        className={`p-4 rounded-xl border ${insight.color} hover:bg-slate-800/50 transition-colors backdrop-blur-sm relative overflow-hidden group`}
                    >
                        {/* Hover subtle glow */}
                        <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity ${insight.type === 'critical' ? 'bg-red-500' :
                                insight.type === 'prediction' ? 'bg-amber-500' :
                                    insight.type === 'anomaly' ? 'bg-purple-500' : 'bg-emerald-500'
                            }`} />

                        <div className="flex items-start justify-between mb-1 relative z-10">
                            <div className="flex items-center space-x-2">
                                <div className="p-1.5 rounded-lg bg-slate-900/80 shadow-inner">
                                    {insight.icon}
                                </div>
                                <h4 className="font-semibold text-slate-200 text-sm tracking-wide">{insight.title}</h4>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">{insight.time}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2 leading-relaxed relative z-10">
                            {insight.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IntelligenceFeed;
