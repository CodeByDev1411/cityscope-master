import React, { useState } from 'react';
import KPIHeader from '../components/KPIHeader';
import PriorityList from '../components/PriorityList';
import HeatmapWidget from '../components/HeatmapWidget';
import IntelligenceFeed from '../components/IntelligenceFeed';
import Login from '../components/Login';
import { Command, LayoutDashboard, LogOut } from 'lucide-react';

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-900/50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* Main Dashboard Navbar */}
        <header className="flex items-center justify-between mb-8 border-b border-slate-800/60 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Command className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center">
                CityScope <span className="ml-2 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">COMMAND CENTER</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium tracking-wide">Authority Decision Dashboard</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </div>
            {/* System Status Indicator */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Online</span>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors"
              title="Secure Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Global KPI Stats */}
        <KPIHeader />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-280px)] min-h-[600px]">

          {/* Priority Zones (Left Column - 7 col) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full bg-slate-900/20 rounded-3xl p-6 border border-slate-800/50 backdrop-blur-xl relative overflow-hidden">
            {/* Subtle glow behind priority list */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]" />
            <PriorityList />
          </div>

          {/* Widgets Sidebar (Right Column - 5 col) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-8 h-full">
            {/* Heatmap Widget (Top Half) */}
            <div className="flex-1 min-h-[300px]">
              <HeatmapWidget />
            </div>

            {/* Intelligence Feed (Bottom Half) */}
            <div className="flex-1 bg-slate-900/20 rounded-3xl p-6 border border-slate-800/50 backdrop-blur-xl shadow-2xl overflow-y-auto custom-scrollbar">
              <IntelligenceFeed />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
