import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, ShieldCheck, Activity, Brain, AlertTriangle, Zap, Wifi,
  BarChart3, Target, ShieldAlert, Navigation, Search, X
} from 'lucide-react';
import { HeatmapLayer } from '../components/HeatmapLayer';
import {
  fetchInfrastructureDelhi,
  fetchCrimeData,
  fetchSentimentDelhi,
  CrimeArea,
  InfrastructureSignal,
  SentimentZone,
} from './cityscopeApi';

// --- Constants & Types ---
const DELHI_CENTER: [number, number] = [28.6139, 77.209];
const CONNAUGHT_PLACE: [number, number] = [28.6315, 77.2167];
const DELHI_BOUNDS: [[number, number], [number, number]] = [
  [28.4, 76.84],
  [28.89, 77.55],
];

type SearchResult = {
  label: string;
  lat: number;
  lng: number;
};

type DelhiBoundaryFeature = {
  type: 'Feature';
  properties: Record<string, never>;
  geometry: {
    type: 'MultiPolygon';
    coordinates: [number, number][][][];
  };
};

const DELHI_BOUNDARY_FALLBACK: DelhiBoundaryFeature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'MultiPolygon',
    coordinates: [[[
      [77.34, 28.88],
      [77.49, 28.81],
      [77.50, 28.68],
      [77.44, 28.52],
      [77.29, 28.42],
      [77.11, 28.41],
      [76.95, 28.49],
      [76.87, 28.61],
      [76.89, 28.75],
      [77.01, 28.85],
      [77.18, 28.89],
      [77.34, 28.88],
    ]]],
  },
};

const FALLBACK_INFRA_POINTS: InfrastructureSignal[] = [
  { id: 'infra_fallback_1', type: 'pothole', label: 'Traffic Signal Anomaly', ward: 'Connaught Place', lat: 28.6315, lng: 77.2167, imageUrl: 'https://picsum.photos/seed/fallback1/280/180', timestamp: 'Live fallback' },
  { id: 'infra_fallback_2', type: 'electrical', label: 'Electrical Outage / Issue', ward: 'Karol Bagh', lat: 28.6519, lng: 77.1909, imageUrl: 'https://picsum.photos/seed/fallback2/280/180', timestamp: 'Live fallback' },
  { id: 'infra_fallback_3', type: 'waste', label: 'Reported Waste Accumulation', ward: 'Lajpat Nagar', lat: 28.5677, lng: 77.2431, imageUrl: 'https://picsum.photos/seed/fallback3/280/180', timestamp: 'Live fallback' },
  { id: 'infra_fallback_4', type: 'pothole', label: 'Traffic Signal Anomaly', ward: 'Rohini Sector', lat: 28.7383, lng: 77.0826, imageUrl: 'https://picsum.photos/seed/fallback4/280/180', timestamp: 'Live fallback' },
  { id: 'infra_fallback_5', type: 'electrical', label: 'Electrical Outage / Issue', ward: 'Mayur Vihar', lat: 28.6046, lng: 77.2964, imageUrl: 'https://picsum.photos/seed/fallback5/280/180', timestamp: 'Live fallback' },
  { id: 'infra_fallback_6', type: 'waste', label: 'Reported Waste Accumulation', ward: 'Dwarka Sector', lat: 28.5921, lng: 77.0460, imageUrl: 'https://picsum.photos/seed/fallback6/280/180', timestamp: 'Live fallback' },
];

// --- Utility Functions ---
const getRiskLevelBadge = (risk: CrimeArea['risk_level']) => {
  if (risk === 'CRITICAL') return 'Lvl 4';
  if (risk === 'HIGH') return 'Lvl 3';
  if (risk === 'MEDIUM') return 'Lvl 2';
  return 'Lvl 1';
};

const getHeatWeight = (area: CrimeArea) => {
  if (area.risk_level === 'CRITICAL') return 1;
  if (area.risk_level === 'HIGH') return 0.82;
  if (area.risk_level === 'MEDIUM') return 0.56;
  return 0.26;
};

const getNearestCrimeArea = (
  coords: [number, number],
  areas: CrimeArea[]
): CrimeArea | null => {
  if (!areas.length) return null;
  const [lat, lng] = coords;
  return areas.reduce((closest, area) => {
    const currentDistance = Math.hypot(area.lat - lat, area.lng - lng);
    if (!closest) return area;
    const closestDistance = Math.hypot(closest.lat - lat, closest.lng - lng);
    return currentDistance < closestDistance ? area : closest;
  }, null as CrimeArea | null);
};

// --- Map Sub-Components ---
const FlyToLocation: React.FC<{ coords: [number, number] | null }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 15, { duration: 1.4 });
  }, [coords, map]);
  return null;
};

const AutoFitDelhi: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(DELHI_BOUNDS, { padding: [24, 24], animate: false });
    map.setView(CONNAUGHT_PLACE, 13.4, { animate: false });
  }, [map]);
  return null;
};

const EnsurePriorityPanes: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const borderPane = map.getPane('delhiBorderPane') ?? map.createPane('delhiBorderPane');
    borderPane.style.zIndex = '660';
    borderPane.style.pointerEvents = 'none';

    const infraPane = map.getPane('infraPane') ?? map.createPane('infraPane');
    infraPane.style.zIndex = '670';
    infraPane.style.pointerEvents = 'auto';
  }, [map]);
  return null;
};

const DelhiBorderLayer: React.FC<{ boundary: DelhiBoundaryFeature | null }> = ({ boundary }) => {
  const map = useMap();
  useEffect(() => {
    if (!boundary) return;
    const layer = L.geoJSON(boundary, {
      pane: 'delhiBorderPane',
      style: {
        color: '#fbbf24',
        weight: 3.5,
        opacity: 0.98,
        fillColor: 'transparent',
        fillOpacity: 0,
        lineCap: 'round',
        lineJoin: 'round',
      },
    }).addTo(map);
    const glowLayer = L.geoJSON(boundary, {
      pane: 'delhiBorderPane',
      style: { color: '#f59e0b', weight: 12, opacity: 0.3, fill: false },
    }).addTo(map);

    const enforceFront = () => {
      glowLayer.bringToFront();
      layer.bringToFront();
    };
    enforceFront();
    map.on('moveend zoomend', enforceFront);

    return () => {
      map.off('moveend zoomend', enforceFront);
      map.removeLayer(glowLayer);
      map.removeLayer(layer);
    };
  }, [map, boundary]);
  return null;
};

const RISK_STYLE:
  Record<CrimeArea['risk_level'],
  { fill: string; stroke: string; strokeOpacity: number; fillOpacity: number; radius: number }
> = {
  CRITICAL: { fill: '#ef4444', stroke: '#fca5a5', strokeOpacity: 0.7, fillOpacity: 0.52, radius: 42 },
  HIGH:     { fill: '#f97316', stroke: '#fdba74', strokeOpacity: 0.6, fillOpacity: 0.44, radius: 34 },
  MEDIUM:   { fill: '#eab308', stroke: '#fde047', strokeOpacity: 0.5, fillOpacity: 0.36, radius: 26 },
  LOW:      { fill: '#22c55e', stroke: '#86efac', strokeOpacity: 0.5, fillOpacity: 0.3,  radius: 20 },
};

type SafetyLensLayerProps = {
  crimeAreas: CrimeArea[];
  crimeHeatmap: { lat: number; lng: number; weight: number }[];
  setSelectedCrimeArea: (area: CrimeArea) => void;
  setSelectedLocationLabel: (label: string) => void;
};

const SafetyLensLayer: React.FC<SafetyLensLayerProps> = ({
  crimeAreas,
  crimeHeatmap,
  setSelectedCrimeArea,
  setSelectedLocationLabel,
}) => (
  <>
    <HeatmapLayer points={crimeHeatmap} />
    {crimeAreas.map((area) => {
      const style = RISK_STYLE[area.risk_level];
      return (
        <CircleMarker
          key={area.area_name}
          center={[area.lat, area.lng]}
          radius={style.radius}
          pathOptions={{
            color: style.stroke, weight: 1.8, opacity: style.strokeOpacity,
            fillColor: style.fill, fillOpacity: style.fillOpacity,
          }}
          eventHandlers={{
            click: () => {
              setSelectedCrimeArea(area);
              setSelectedLocationLabel(area.area_name);
            },
          }}
        >
          <Popup>
            <div className="min-w-[180px] text-slate-900">
              <div className="text-sm font-semibold">{area.area_name}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{area.risk_level} risk</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div><div className="text-slate-500">Total Crime</div><div className="font-semibold">{area.totalcrime}</div></div>
                <div><div className="text-slate-500">Intensity</div><div className="font-semibold">{Math.round(area.intensity)}</div></div>
                <div><div className="text-slate-500">Robbery</div><div className="font-semibold">{area.robbery}</div></div>
                <div><div className="text-slate-500">Theft</div><div className="font-semibold">{area.theft}</div></div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      );
    })}
  </>
);

type Lens = 'infrastructure' | 'safety' | 'pulse';

// --- Main Application Component ---
export const CityIntelligenceMap: React.FC = () => {
  const [activeLens, setActiveLens] = useState<Lens>('infrastructure');
  const [hoveredInfra, setHoveredInfra] = useState<InfrastructureSignal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCrimeArea, setSelectedCrimeArea] = useState<CrimeArea | null>(null);
  const [selectedLocationLabel, setSelectedLocationLabel] = useState<string | null>(null);

  const [infra, setInfra] = useState<InfrastructureSignal[]>([]);
  const [crimeAreas, setCrimeAreas] = useState<CrimeArea[]>([]);
  const [sentiment, setSentiment] = useState<SentimentZone[]>([]);
  const [delhiBoundary, setDelhiBoundary] = useState<DelhiBoundaryFeature | null>(DELHI_BOUNDARY_FALLBACK);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Data
  useEffect(() => {
    const loadInfra = async () => {
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const infraData = await fetchInfrastructureDelhi();
          if (infraData.length > 0) {
            setInfra(infraData);
            return;
          }
        } catch (e) {
          console.error(`Infra Fetch Error (attempt ${attempt}):`, e);
        }
        await new Promise(resolve => setTimeout(resolve, 600 * attempt));
      }

      console.warn('Using fallback infrastructure markers');
      setInfra(FALLBACK_INFRA_POINTS);
    };

    loadInfra();
    fetchCrimeData().then(setCrimeAreas).catch(e => console.error('Crime Data Fetch Error:', e));
    fetchSentimentDelhi().then(setSentiment).catch(e => console.error('Sentiment Fetch Error:', e));

    // Fetch Delhi boundary
    const fetchBoundary = async () => {
      const query = `[out:json][timeout:25]; relation(1942586); out geom;`;
      try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
        });
        const data = await response.json();
        const coords: [number, number][][] = [];
        for (const element of data.elements ?? []) {
          if (element.type === 'relation' && element.members) {
            for (const member of element.members) {
              if (member.role === 'outer' && member.geometry) {
                const ring = member.geometry.map(
                  (point: { lat: number; lon: number }) => [point.lon, point.lat] as [number, number]
                );
                if (ring.length > 2) coords.push(ring);
              }
            }
          }
        }
        if (coords.length > 0) {
          setDelhiBoundary({
            type: 'Feature',
            properties: {},
            geometry: { type: 'MultiPolygon', coordinates: coords.map(ring => [ring]) },
          });
        } else {
          console.warn('Boundary API returned empty geometry, keeping current boundary');
        }
      } catch (err) {
        console.error('Failed to fetch Delhi boundary:', err);
      }
    };
    fetchBoundary();
  }, []);

  useEffect(() => {
    if (!flyTarget || selectedCrimeArea || !selectedLocationLabel) return;
    const matchedArea = getNearestCrimeArea(flyTarget, crimeAreas);
    if (matchedArea) setSelectedCrimeArea(matchedArea);
  }, [crimeAreas, flyTarget, selectedCrimeArea, selectedLocationLabel]);

  const activeLensLabel = useMemo(() => {
    if (activeLens === 'infrastructure') return 'Infrastructure Signals Layer';
    if (activeLens === 'safety')         return 'Delhi Crime Risk Layer';
    return 'Sentiment Pulse Layer – Delhi';
  }, [activeLens]);

  const crimeHeatmap = useMemo(
    () => crimeAreas.map(area => ({ lat: area.lat, lng: area.lng, weight: getHeatWeight(area) })),
    [crimeAreas]
  );

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${q} Delhi`)}&format=json&limit=5`
        );
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setSearchResults(
          data.map((r: any) => ({
            label: r.display_name.split(',').slice(0, 2).join(', '),
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon),
          }))
        );
      } catch (error) {
        console.warn('Nominatim search failed', error);
        setSearchResults([]);
      }
    }, 600);
  };

  const handleSelect = (result: SearchResult) => {
    const coords: [number, number] = [result.lat, result.lng];
    setFlyTarget(coords);
    setSearchQuery(result.label);
    setSearchResults([]);
    setSearchOpen(false);
    setSelectedLocationLabel(result.label);
    setSelectedCrimeArea(getNearestCrimeArea(coords, crimeAreas));
  };

  return (
    <div className="relative h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
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
          <FlyToLocation coords={flyTarget} />
          <AutoFitDelhi />
          <EnsurePriorityPanes />
          <DelhiBorderLayer boundary={delhiBoundary} />

          {activeLens === 'infrastructure' && (
            <>
              {infra.map((report) => (
                <React.Fragment key={report.id}>
                  <CircleMarker
                    center={[report.lat, report.lng]}
                    pane="infraPane"
                    radius={hoveredInfra?.id === report.id ? 16 : 13}
                    pathOptions={{
                      color: '#f59e0b',
                      weight: 0,
                      opacity: 0,
                      fillColor: '#f59e0b',
                      fillOpacity: hoveredInfra?.id === report.id ? 0.34 : 0.22,
                    }}
                  />
                  <CircleMarker
                    center={[report.lat, report.lng]}
                    pane="infraPane"
                    radius={hoveredInfra?.id === report.id ? 11 : 9}
                    pathOptions={{
                      color: hoveredInfra?.id === report.id ? '#fde68a' : '#facc15',
                      weight: hoveredInfra?.id === report.id ? 2.8 : 2.2,
                      opacity: 1,
                      fillColor: hoveredInfra?.id === report.id ? '#f97316' : '#f59e0b',
                      fillOpacity: hoveredInfra?.id === report.id ? 0.95 : 0.8,
                    }}
                    eventHandlers={{
                      mouseover: () => setHoveredInfra(report),
                      mouseout: () => setHoveredInfra(prev => prev?.id === report.id ? null : prev),
                    }}
                  />
                  <CircleMarker
                    center={[report.lat, report.lng]}
                    pane="infraPane"
                    radius={hoveredInfra?.id === report.id ? 3.2 : 2.6}
                    pathOptions={{
                      color: '#ffffff',
                      weight: 1.2,
                      opacity: 1,
                      fillColor: '#fff7ed',
                      fillOpacity: 1,
                    }}
                  />
                </React.Fragment>
              ))}
            </>
          )}

          {activeLens === 'safety' && (
            <SafetyLensLayer
              crimeAreas={crimeAreas}
              crimeHeatmap={crimeHeatmap}
              setSelectedCrimeArea={setSelectedCrimeArea}
              setSelectedLocationLabel={setSelectedLocationLabel}
            />
          )}

        </MapContainer>
      </div>

      {/* Sentiment Pulse Render */}
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
                animate={{ opacity: [0.25, 0.6, 0.35], scale: [0.9, 1.15, 0.95] }}
                transition={{ duration: 4 + 2 * aura.intensity, repeat: Infinity, ease: 'easeInOut' }}
              />
            );
          })}
        </div>
      )}

      {/* Top UI Navigation */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-30 flex items-center justify-between px-6">
        <div className="pointer-events-auto rounded-2xl bg-slate-900/60 px-4 py-2 backdrop-blur-2xl border border-white/10 flex items-center gap-2">
          <Brain className="h-5 w-5 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">CityScope // The Brain</span>
            <span className="text-sm font-semibold text-slate-50">Delhi City Intelligence Map</span>
          </div>
        </div>
        <div className="pointer-events-auto hidden md:flex items-center gap-3 rounded-2xl bg-slate-900/60 px-4 py-2 backdrop-blur-2xl border border-white/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_#22c55e] animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.2em] text-emerald-300">LIVE SIGNAL FEED</span>
          <span className="text-xs text-slate-400 border-l border-slate-700/80 pl-3">Lens: {activeLensLabel}</span>
        </div>
      </div>

      {/* Infrastructure Legend */}
      {activeLens === 'infrastructure' && (
        <div className="pointer-events-none absolute bottom-6 left-6 z-30">
          <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/75 px-5 py-4 backdrop-blur-2xl shadow-[0_0_30px_rgba(2,6,23,0.5)]">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Infrastructure Priority</div>
            <div className="flex flex-col gap-2.5">
              {[
                { bg: '#7f1d1d', label: 'Critical' },
                { bg: '#ef4444', label: 'High' },
                { bg: '#eab308', label: 'Moderate' },
                { bg: '#22c55e', label: 'Low' },
              ].map(({ bg, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: bg, boxShadow: `0 0 8px ${bg}99` }} />
                  <span className="text-[11px] font-medium text-slate-200 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Safety Legend */}
      {activeLens === 'safety' && (
        <div className="pointer-events-none absolute bottom-6 left-6 z-30">
          <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 backdrop-blur-2xl shadow-[0_0_30px_rgba(2,6,23,0.5)]">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Threat Gradient</div>
            <div className="h-2.5 w-44 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 via-orange-500 to-red-500" />
            <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
              <span>Low</span><span>Critical</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="pointer-events-none absolute inset-x-0 top-16 z-30 flex justify-center px-6">
        <div className="pointer-events-auto relative w-full max-w-md">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900/70 px-4 py-2.5 backdrop-blur-2xl border border-white/10">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              value={searchQuery}
              onChange={e => { handleSearch(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search areas, landmarks..."
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-2xl overflow-hidden shadow-lg">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(r)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-800/60 transition-colors border-b border-white/5 last:border-0"
                >
                  <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span className="text-sm text-slate-200 truncate">{r.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Left Lens Controls */}
      <div className="pointer-events-none absolute left-4 top-1/2 z-30 -translate-y-1/2">
        <div className="pointer-events-auto flex flex-col gap-3 rounded-3xl bg-slate-950/70 p-3 backdrop-blur-2xl border border-white/10 shadow-xl">
          <LensButton icon={MapPin}      label="Infra"     active={activeLens === 'infrastructure'} onClick={() => setActiveLens('infrastructure')} />
          <LensButton icon={ShieldCheck} label="Safety"    active={activeLens === 'safety'}         onClick={() => setActiveLens('safety')} />
          <LensButton icon={Activity}    label="Pulse"     active={activeLens === 'pulse'}          onClick={() => setActiveLens('pulse')} />
        </div>
      </div>

      {/* Hover Overlays */}
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
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{hoveredInfra.ward}</span>
                <span className="text-sm font-semibold text-slate-50">{hoveredInfra.label}</span>
                <span className="text-[11px] text-slate-400">{hoveredInfra.timestamp}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <IntelligenceSidePanel
        activeLens={activeLens}
        selectedCrimeArea={selectedCrimeArea}
        selectedLocationLabel={selectedLocationLabel}
      />
    </div>
  );
};

// --- Static UI Components ---
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
      active ? 'shadow-[0_0_30px_rgba(94,234,212,0.45)]' : 'shadow-[0_0_20px_rgba(15,23,42,0.9)]',
    ].join(' ')}
  >
    <div
      className={[
        'absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/70 via-slate-900/0 to-transparent',
        active ? 'opacity-90 scale-100' : 'opacity-40 scale-75',
      ].join(' ')}
    />
    <div className="relative flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-2xl bg-slate-950/80 px-2 py-2 backdrop-blur-2xl border border-white/10">
      <Icon className={['h-5 w-5 drop-shadow-[0_0_10px_rgba(148,163,184,0.5)]', active ? 'text-cyan-300' : 'text-slate-400'].join(' ')} />
      <span className={['text-[10px] font-semibold uppercase tracking-[0.16em]', active ? 'text-slate-50' : 'text-slate-400/70'].join(' ')}>
        {label}
      </span>
    </div>
  </button>
);

const IntelligenceSidePanel: React.FC<{
  activeLens: Lens;
  selectedCrimeArea: CrimeArea | null;
  selectedLocationLabel: string | null;
}> = ({ activeLens, selectedCrimeArea, selectedLocationLabel }) => {
  const safetyScore = selectedCrimeArea
    ? Math.max(0, 100 - Math.round(selectedCrimeArea.intensity))
    : null;

  return (
    <div className="pointer-events-none absolute right-6 top-24 bottom-6 z-30 hidden lg:flex flex-col w-[340px]">
      <div className="pointer-events-auto flex h-full flex-col rounded-3xl bg-slate-950/80 p-5 backdrop-blur-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <Brain className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/80">Cyber-Intelligence</span>
            <span className="text-sm font-semibold text-slate-50">
              {activeLens === 'infrastructure' && 'Infrastructure Signals'}
              {activeLens === 'safety'         && 'Threat Assessment'}
              {activeLens === 'pulse'          && 'Sentiment Analysis'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {activeLens === 'infrastructure' && (
              <motion.div key="infra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }} transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }} className="flex flex-col gap-4">
                <SideCard icon={AlertTriangle} color="text-amber-400" bg="bg-amber-400/10" glow="shadow-[0_0_15px_rgba(251,191,36,0.15)]" title="Pothole Cluster" subtitle="ITO Flyover - High priority" metric="98%" metricLabel="CONFIDENCE" />
                <SideCard icon={Zap}           color="text-rose-400"  bg="bg-rose-400/10"  glow="shadow-[0_0_15px_rgba(244,63,94,0.15)]"  title="Electrical Outage" subtitle="Rajouri Garden" metric="2.4h" metricLabel="EST. DOWNTIME" />
                <SideCard icon={Wifi}          color="text-cyan-400"  bg="bg-cyan-400/10"  glow="shadow-[0_0_15px_rgba(34,211,238,0.15)]" title="Network Congestion" subtitle="Connaught Place" metric="140ms" metricLabel="LATENCY" />
              </motion.div>
            )}

            {activeLens === 'safety' && (
              <motion.div key="safety" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }} transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }} className="flex flex-col gap-4">
                {selectedCrimeArea ? (
                  <>
                    <SideCard icon={ShieldAlert} color="text-rose-500"    bg="bg-rose-500/10"    glow="shadow-[0_0_15px_rgba(244,63,94,0.15)]"   title={selectedLocationLabel || selectedCrimeArea.area_name} subtitle={`Nearest station: ${selectedCrimeArea.area_name}`} metric={getRiskLevelBadge(selectedCrimeArea.risk_level)} metricLabel="THREAT" />
                    <SideCard icon={Navigation}  color="text-emerald-400" bg="bg-emerald-400/10" glow="shadow-[0_0_15px_rgba(52,211,153,0.15)]"  title="Location Safety Index" subtitle={`${selectedCrimeArea.totalcrime} active incidents`} metric={`${safetyScore}%`} metricLabel="SAFETY SCORE" />
                    <SideCard icon={Target}      color="text-cyan-400"    bg="bg-cyan-400/10"    glow="shadow-[0_0_15px_rgba(34,211,238,0.15)]" title="Operational Focus" subtitle={`Robbery ${selectedCrimeArea.robbery} // Theft ${selectedCrimeArea.theft}`} metric={String(Math.round(selectedCrimeArea.intensity))} metricLabel="INTENSITY" />
                  </>
                ) : (
                  <>
                    <SideCard icon={ShieldAlert} color="text-rose-500"    bg="bg-rose-500/10"    glow="shadow-[0_0_15px_rgba(244,63,94,0.15)]"  title="High Risk Zone" subtitle="Seelampur Corridor" metric="Lvl 4" metricLabel="THREAT" />
                    <SideCard icon={Navigation}  color="text-emerald-400" bg="bg-emerald-400/10" glow="shadow-[0_0_15px_rgba(52,211,153,0.15)]" title="SafeRoute Suggested" subtitle="Lajpat Nagar to AIIMS" metric="+82%" metricLabel="SAFETY SCORE" />
                  </>
                )}
              </motion.div>
            )}

            {activeLens === 'pulse' && (
              <motion.div key="pulse" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }} transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }} className="flex flex-col gap-4">
                <SideCard icon={BarChart3} color="text-emerald-400" bg="bg-emerald-400/10" glow="shadow-[0_0_15px_rgba(52,211,153,0.15)]" title="Positive Surge"  subtitle="Lajpat Nagar Market" metric="+45%" metricLabel="MOMENTUM" />
                <SideCard icon={Target}   color="text-rose-400"    bg="bg-rose-400/10"    glow="shadow-[0_0_15px_rgba(244,63,94,0.15)]"  title="Friction Point" subtitle="ITO Intersection"   metric="-12"  metricLabel="SENTIMENT" />
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
  color: string; bg: string; glow: string;
  title: string; subtitle: string;
  metric: string; metricLabel: string;
};

const SideCard: React.FC<SideCardProps> = ({ icon: Icon, color, bg, glow, title, subtitle, metric, metricLabel }) => (
  <div className={['flex items-center justify-between rounded-2xl bg-slate-900/40 p-4 border border-white/5 transition-all hover:bg-slate-800/60', glow].join(' ')}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${bg}`}><Icon className={`h-5 w-5 ${color}`} /></div>
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

export default CityIntelligenceMap;
