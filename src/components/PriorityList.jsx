import React, { useEffect, useState } from 'react';
import PriorityCard from './PriorityCard';
import { ShieldAlert } from 'lucide-react';
import { fetchCrimeData } from '../pages/cityscopeApi';

const offensePriority = [
    ['robbery', 'Robbery'],
    ['theft', 'Theft'],
    ['murder', 'Murder'],
    ['rape', 'Rape'],
    ['gangrape', 'Gang Rape'],
    ['assault_murders', 'Assault Murders'],
    ['sexual_harassment', 'Sexual Harassment'],
];

const getPrimaryOffense = (area) => {
    return offensePriority.reduce(
        (best, [key, label]) => (area[key] > best.value ? { label, value: area[key] } : best),
        { label: 'Mixed Crime', value: -1 }
    ).label;
};

const PriorityList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchCrimeData({ limit: 5, sort: 'desc' }).then(setItems);
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-6">
                <ShieldAlert className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Top Probability Risk Zones
                </h2>
                <div className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-500 animate-pulse">
                    {items.length || 0} ACTIVE
                </div>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-4">
                {items.length > 0 ? (
                    items.map((item) => (
                        <PriorityCard
                            key={item.area_name}
                            area={item.area_name}
                            riskLevel={item.risk_level}
                            totalCrime={item.totalcrime}
                            intensity={item.intensity}
                            primaryOffense={getPrimaryOffense(item)}
                        />
                    ))
                ) : (
                    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 text-sm text-slate-400">
                        Crime risk feed is waiting for the Flask API at `localhost:5000`.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriorityList;
