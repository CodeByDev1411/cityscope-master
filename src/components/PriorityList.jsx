import React from 'react';
import PriorityCard from './PriorityCard';
import { ShieldAlert } from 'lucide-react';

const mockPriorityData = [
    {
        id: 1,
        area: 'North Delhi - Sector 15',
        riskLevel: 'Critical',
        reason: 'High Priority: 12 reports + 30% sentiment drop in 4 hours.',
        sentimentTrend: -30,
        trendData: [
            { name: '1h', value: 80 }, { name: '2h', value: 75 },
            { name: '3h', value: 65 }, { name: '4h', value: 50 },
        ]
    },
    {
        id: 2,
        area: 'Central Business District',
        riskLevel: 'Critical',
        reason: 'Anomaly: Multiple overlapping noise & safety signals.',
        sentimentTrend: -15,
        trendData: [
            { name: '1h', value: 90 }, { name: '2h', value: 88 },
            { name: '3h', value: 80 }, { name: '4h', value: 75 },
        ]
    },
    {
        id: 3,
        area: 'South Extension Market',
        riskLevel: 'Warning',
        reason: 'Warning: Congestion leading to rising tension.',
        sentimentTrend: -8,
        trendData: [
            { name: '1h', value: 70 }, { name: '2h', value: 68 },
            { name: '3h', value: 65 }, { name: '4h', value: 62 },
        ]
    },
    {
        id: 4,
        area: 'East Delhi - Connaught Place',
        riskLevel: 'Warning',
        reason: 'Pattern: Recurring sanitation issues noted.',
        sentimentTrend: -5,
        trendData: [
            { name: '1h', value: 60 }, { name: '2h', value: 58 },
            { name: '3h', value: 56 }, { name: '4h', value: 55 },
        ]
    },
    {
        id: 5,
        area: 'West Delhi Transit Hub',
        riskLevel: 'Warning',
        reason: 'Alert: Minor dispute signals clustered.',
        sentimentTrend: -2,
        trendData: [
            { name: '1h', value: 50 }, { name: '2h', value: 49 },
            { name: '3h', value: 49 }, { name: '4h', value: 48 },
        ]
    }
];

const PriorityList = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-6">
                <ShieldAlert className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Top Probability Risk Zones
                </h2>
                <div className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-500 animate-pulse">
                    5 ACTIVE
                </div>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-4">
                {mockPriorityData.map((item) => (
                    <PriorityCard key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
};

export default PriorityList;
