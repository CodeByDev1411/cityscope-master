import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShieldCheck, Activity, Brain, AlertTriangle, Zap, Wifi, BarChart3, Target, ShieldAlert, Navigation } from 'lucide-react';
import {
  fetchInfrastructureDelhi,
  fetchSafetyDelhi,
  fetchSentimentDelhi,
  InfrastructureSignal,
  SafetySegment,
  SentimentZone,
} from './cityscopeApi';

const DELHI_CENTER: [number, number] = [28.6139, 77.209];

const getSafetyStroke = (score: number) => {
  if (score > 0.8) return '#06b6d4';
  if (score < 0.4) return '#8b5cf6';
  return '#64748b';
};

type Lens = 'infrastructure' | 'safety' | 'pulse';

export const CityIntelligenceMap: React.FC = () => {
  const [activeLens, setActiveLens] = useState<Lens>('infrastructure');
  const [hoveredInfra, setHoveredInfra] = useState<InfrastructureSignal | null>(null);

  const [infra, setInfra] = useState<InfrastructureSignal[]>([]);
  const [safety, setSafety] = useState<SafetySegment[]>([]);
  const [sentiment, setSentiment] = useState<SentimentZone[]>([]);

  useEffect(() => {
    fetchInfrastructureDelhi().then(setInfra);
    fetchSafetyDelhi().then(setSafety);
    fetchSentimentDelhi().then(setSentiment);
  }, []);

  const activeLensLabel = useMemo(() => {
    if (activeLens === 'infrastructure') return 'Infrastructure Signals – Delhi';
    if (activeLens === 'safety') return 'SafeRoute Safety Layer – Delhi';
    return 'Sentiment Pulse Layer – Delhi';
  }, [activeLens]);

  return (
    <div className="relative h-screen w-full bg-slate-950 text-slate-100 overflow-hidden">
      <div className="absolute inset-0">
        <MapContainer
          center={DELHI_CENTER}
          zoom={12}
          zoomControl={false}
          className="h-full w-full absolute inset-0 z-0"
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CartoDB"
          />

          {activeLens === 'infrastructure' &&
            infra.map((report) => (
              <CircleMarker
                key={report.id}
                center={[report.lat, report.lng]}
                radius={0}
                pathOptions={{ color: 'transparent', fillColor: 'transparent', fillOpacity: 0 }}
                eventHandlers={{
                  mouseover: () => setHoveredInfra(report),
                  mouseout: () => setHoveredInfra((prev) => (prev?.id === report.id ? null : prev)),
                }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <span className="relative z-10 block h-3 w-3 rounded-full bg-slate-50 shadow-[0_0_25px_rgba(248,250,252,0.9)]" />
                  <span className="absolute inset-0 -z-10 rounded-full opacity-70 animate-ping bg-sky-400/80 shadow-[0_0_25px_#38bdf8]" />
                </div>
              </CircleMarker>
            ))}

          {activeLens === 'safety' &&
            safety.map((seg) => (
              <Polyline
                key={seg.id}
                positions={seg.path}
                pathOptions={{
                  color: getSafetyStroke(seg.score),
                  opacity: 0.85,
                  weight: 6,
                }}
              />
            ))}
        </MapContainer>
      </div>

      {activeLens === 'pulse' && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {sentiment.map((aura) => {
            const isPositive = aura.sentiment === 'positive';
            const baseColor = isPositive
              ? 'from-emerald-400 via-emerald-500 to-transparent'
              : 'from-orange-500 via-red-500 to-transparent';

            return (
              <motion.div
                key={aura.id}
                className={`absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-to-br ${baseColor} mix-blend-screen blur-3xl`}
                style={{ top: aura.top, left: aura.left }}
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: [0.25, 0.6, 0.35],
                  scale: [0.9, 1.15, 0.95],
                }}
                transition={{
                  duration: 4 + 2 * aura.intensity,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-4 z-30 flex items-center justify-between px-6">
        <div className="pointer-events-auto rounded-2xl bg-slate-900/60 px-4 py-2 backdrop-blur-2xl border border-white/10 flex items-center gap-2">
          <Brain className="h-5 w-5 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              CityScope // The Brain
            </span>
            <span className="text-sm font-semibold text-slate-50">
              Delhi City Intelligence Map
            </span>
          </div>
        </div>

        <div className="pointer-events-auto hidden md:flex items-center gap-3 rounded-2xl bg-slate-900/60 px-4 py-2 backdrop-blur-2xl border border-white/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_#22c55e] animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.2em] text-emerald-300">
            LIVE SIGNAL FEED (FAKE DATA)
          </span>
          <span className="text-xs text-slate-400 border-l border-slate-700/80 pl-3">
            Lens: {activeLensLabel}
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute left-4 top-1/2 z-30 -translate-y-1/2">
        <div className="pointer-events-auto flex flex-col gap-3 rounded-3xl bg-slate-950/70 p-3 backdrop-blur-2xl border border-white/10">
          <LensButton
            icon={MapPin}
            label="Infrastructure"
            active={activeLens === 'infrastructure'}
            onClick={() => setActiveLens('infrastructure')}
          />
          <LensButton
            icon={ShieldCheck}
            label="Safety"
            active={activeLens === 'safety'}
            onClick={() => setActiveLens('safety')}
          />
          <LensButton
            icon={Activity}
            label="Pulse"
            active={activeLens === 'pulse'}
            onClick={() => setActiveLens('pulse')}
          />
        </div>
      </div>

      <AnimatePresence>
        {hoveredInfra && activeLens === 'infrastructure' && (
          <motion.div
            className="pointer-events-none absolute left-24 top-1/2 z-30 -translate-y-1/2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
          >
            <div className="pointer-events-auto w-64 rounded-2xl bg-slate-900/70 p-3 border border-white/10 backdrop-blur-2xl shadow-[0_0_30px_rgba(15,23,42,0.9)]">
              <div className="overflow-hidden rounded-xl mb-2">
                <motion.img
                  src={hoveredInfra.imageUrl}
                  alt={hoveredInfra.label}
                  className="h-28 w-full object-cover"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {hoveredInfra.ward}
                </span>
                <span className="text-sm font-semibold text-slate-50">
                  {hoveredInfra.label}
                </span>
                <span className="text-[11px] text-slate-400">{hoveredInfra.timestamp}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <IntelligenceSidePanel activeLens={activeLens} />
    </div>
  );
};

type LensButtonProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
};

const LensButton: React.FC<LensButtonProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={[
      'relative flex items-center justify-center rounded-2xl p-[1px] transition-all duration-300',
      active
        ? 'shadow-[0_0_30px_rgba(94,234,212,0.45)]'
        : 'shadow-[0_0_20px_rgba(15,23,42,0.9)]',
    ].join(' ')}
  >
    <div
      className={[
        'absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/70 via-slate-900/0 to-transparent',
        active ? 'opacity-90 scale-100' : 'opacity-40 scale-75',
      ].join(' ')}
    />
    <div className="relative flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-2xl bg-slate-950/80 px-2 py-2 backdrop-blur-2xl border border-white/10">
      <Icon
        className={[
          'h-5 w-5 drop-shadow-[0_0_10px_rgba(148,163,184,0.5)]',
          active ? 'text-cyan-300' : 'text-slate-400',
        ].join(' ')}
      />
      <span
        className={[
          'text-[10px] font-semibold uppercase tracking-[0.16em]',
          active ? 'text-slate-50' : 'text-slate-400/70',
        ].join(' ')}
      >
        {label}
      </span>
    </div>
  </button>
);

const IntelligenceSidePanel: React.FC<{ activeLens: Lens }> = ({ activeLens }) => {
  return (
    <div className="pointer-events-none absolute right-6 top-24 bottom-6 z-30 hidden lg:flex flex-col w-[340px]">
      <div className="pointer-events-auto flex h-full flex-col rounded-3xl bg-slate-950/80 p-5 backdrop-blur-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <Brain className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/80">
              Cyber-Intelligence
            </span>
            <span className="text-sm font-semibold text-slate-50">
              {activeLens === 'infrastructure' && 'Anomaly Detection'}
              {activeLens === 'safety' && 'Threat Assessment'}
              {activeLens === 'pulse' && 'Sentiment Analysis'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {activeLens === 'infrastructure' && (
              <motion.div
                key="infra"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                className="flex flex-col gap-4"
              >
                <SideCard
                  icon={AlertTriangle}
                  color="text-amber-400"
                  bg="bg-amber-400/10"
                  glow="shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                  title="Pothole Cluster"
                  subtitle="ITO Flyover - High priority"
                  metric="98%"
                  metricLabel="CONFIDENCE"
                />
                <SideCard
                  icon={Zap}
                  color="text-rose-400"
                  bg="bg-rose-400/10"
                  glow="shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                  title="Electrical Outage"
                  subtitle="Rajouri Garden"
                  metric="2.4h"
                  metricLabel="EST. DOWNTIME"
                />
                <SideCard
                  icon={Wifi}
                  color="text-cyan-400"
                  bg="bg-cyan-400/10"
                  glow="shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  title="Network Congestion"
                  subtitle="Connaught Place"
                  metric="140ms"
                  metricLabel="LATENCY"
                />
              </motion.div>
            )}

            {activeLens === 'safety' && (
              <motion.div
                key="safety"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                className="flex flex-col gap-4"
              >
                <SideCard
                  icon={ShieldAlert}
                  color="text-rose-500"
                  bg="bg-rose-500/10"
                  glow="shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                  title="High Risk Zone"
                  subtitle="Seelampur Corridor"
                  metric="Lvl 4"
                  metricLabel="THREAT"
                />
                <SideCard
                  icon={Navigation}
                  color="text-emerald-400"
                  bg="bg-emerald-400/10"
                  glow="shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                  title="SafeRoute Suggested"
                  subtitle="Lajpat Nagar to AIIMS"
                  metric="+82%"
                  metricLabel="SAFETY SCORE"
                />
              </motion.div>
            )}

            {activeLens === 'pulse' && (
              <motion.div
                key="pulse"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                className="flex flex-col gap-4"
              >
                <SideCard
                  icon={BarChart3}
                  color="text-emerald-400"
                  bg="bg-emerald-400/10"
                  glow="shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                  title="Positive Surge"
                  subtitle="Lajpat Nagar Market"
                  metric="+45%"
                  metricLabel="MOMENTUM"
                />
                <SideCard
                  icon={Target}
                  color="text-rose-400"
                  bg="bg-rose-400/10"
                  glow="shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                  title="Friction Point"
                  subtitle="ITO Intersection"
                  metric="-12"
                  metricLabel="SENTIMENT"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

type SideCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  glow: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
};

const SideCard: React.FC<SideCardProps> = ({ icon: Icon, color, bg, glow, title, subtitle, metric, metricLabel }) => (
  <div className={['flex items-center justify-between rounded-2xl bg-slate-900/40 p-4 border border-white/5 transition-all hover:bg-slate-800/60', glow].join(' ')}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-100">{title}</span>
        <span className="text-[11px] text-slate-400">{subtitle}</span>
      </div>
    </div>
    <div className="flex flex-col items-end gap-0.5">
      <span className={`text-sm font-bold ${color}`}>{metric}</span>
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{metricLabel}</span>
    </div>
  </div>
);

