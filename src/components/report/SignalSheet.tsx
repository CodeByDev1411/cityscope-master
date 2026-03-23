import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Brain, CheckCircle } from 'lucide-react'
import { VoicePulse } from './VoicePulse'
import { PhotoUploadWithScan } from './PhotoUploadWithScan'
import { SeveritySlider } from './SeveritySlider'
import { LocationSnippet } from './LocationSnippet'

interface SignalSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function SignalSheet({ isOpen, onClose }: SignalSheetProps) {
  const [submitState, setSubmitState] = useState<'idle' | 'analyzing' | 'success'>('idle')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleSubmit = () => {
    setSubmitState('analyzing')
    setTimeout(() => {
      setSubmitState('success')
      setTimeout(() => {
        onClose()
        setTimeout(() => setSubmitState('idle'), 500) // Reset after close animation
      }, 2000)
    }, 2500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="glass-sheet fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl"
          >
            <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
              <h2 className="text-lg font-semibold text-slate-100">
                New Signal
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="space-y-6">
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
                    Issue Details
                  </h3>
                  <div className="space-y-4 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
                    <div className="flex flex-wrap gap-2">
                       {['Pothole', 'Sewage Leak', 'Broken Light', 'Fallen Tree', 'Disruption'].map(type => (
                         <button 
                           key={type} 
                           type="button" 
                           onClick={() => setSelectedCategory(selectedCategory === type ? null : type)}
                           className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider rounded-lg transition-all focus:outline-none ${
                             selectedCategory === type
                               ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                               : 'text-slate-400 border border-slate-600/50 bg-slate-800/50 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30'
                           }`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                    <textarea 
                      placeholder="Briefly describe the urban anomaly..." 
                      className="w-full h-20 bg-slate-950/50 border border-slate-700/50 rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 resize-none transition-all"
                    ></textarea>
                  </div>
                </section>
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
                    Voice Note
                  </h3>
                  <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/50 py-2">
                    <VoicePulse />
                  </div>
                </section>
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
                    Visual Capture
                  </h3>
                  <PhotoUploadWithScan />
                </section>
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
                    Severity
                  </h3>
                  <div className="rounded-2xl border border-slate-600/50 bg-slate-900/60 p-4">
                    <SeveritySlider />
                  </div>
                </section>
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
                    Location
                  </h3>
                  <LocationSnippet />
                </section>

                {/* Submit Action Area */}
                <div className="pt-4 border-t border-slate-700/50">
                  <AnimatePresence mode="wait">
                    {submitState === 'idle' && (
                      <motion.button
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={handleSubmit}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold tracking-wide uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                      >
                        <Send className="w-5 h-5" />
                        Transmit Urban Signal
                      </motion.button>
                    )}
                    {submitState === 'analyzing' && (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full flex flex-col items-center justify-center gap-3 py-4 rounded-xl border border-cyan-500/30 bg-cyan-950/40"
                      >
                        <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
                        <p className="text-sm font-medium text-cyan-300 animate-pulse">CityScope AI analyzing pixels...</p>
                      </motion.div>
                    )}
                    {submitState === 'success' && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-emerald-500/50 bg-emerald-950/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
                      >
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <p className="text-sm font-bold text-emerald-300">AI Detection Confirmed</p>
                        <p className="text-xs text-emerald-400/80">+50 Impact Points Awarded!</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
