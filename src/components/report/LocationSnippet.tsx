import { useState, useEffect } from 'react'
import { MapPin, Navigation, Edit3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function LocationSnippet() {
  const [inputType, setInputType] = useState<'gps' | 'manual'>('gps')
  const [address, setAddress] = useState('')
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [coords, setCoords] = useState<string | null>(null)

  useEffect(() => {
    if (inputType !== 'gps') return;

    if (!navigator.geolocation) {
      setAccuracy(0)
      setCoords('Unavailable')
      return
    }
    const watchId = navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords(
          `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        )
        setAccuracy(
          pos.coords.accuracy ? Math.round(100 - Math.min(100, pos.coords.accuracy / 2)) : 94
        )
      },
      () => {
        setAccuracy(72)
        setCoords('Approximate')
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [inputType])

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-600/50 bg-slate-900/60">
      
      {/* Toggle Header */}
      <div className="flex items-center gap-1 p-2 bg-slate-800/80 border-b border-slate-700/60">
        <button 
          onClick={() => setInputType('gps')}
          className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            inputType === 'gps' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:bg-slate-700/50 hover:text-slate-300'
          }`}
        >
          <Navigation className="w-3 h-3" /> Auto GPS
        </button>
        <button 
          onClick={() => setInputType('manual')}
          className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            inputType === 'manual' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:bg-slate-700/50 hover:text-slate-300'
          }`}
        >
          <Edit3 className="w-3 h-3" /> Manual
        </button>
      </div>

      <AnimatePresence mode="wait">
        {inputType === 'gps' ? (
          <motion.div 
            key="gps"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative h-24 bg-slate-800/80">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.08)_0%,transparent_50%)]" />
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="rounded-full bg-cyan-500/90 p-2 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                >
                  <MapPin className="h-5 w-5 text-slate-900" />
                </motion.div>
                <span className="font-mono text-[10px] text-cyan-400/90">
                  GPS pin active
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-700/60 px-3 py-2">
              <span className="text-xs text-slate-400">Signal Accuracy</span>
              <motion.span
                key={accuracy ?? 0}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-sm font-semibold text-cyan-400"
              >
                {accuracy !== null ? `${accuracy}%` : '…'}
              </motion.span>
            </div>
            {coords && (
              <p className="border-t border-slate-700/40 px-3 py-1.5 font-mono text-[10px] text-slate-500">
                {coords}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="manual"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="p-3 bg-slate-800/40 h-[142px] flex flex-col justify-center"
          >
            <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90 mb-2 block">
              Enter Nearest Address / Landmark
            </label>
            <input 
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 124 Main St. Near Subway Station..."
              className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
