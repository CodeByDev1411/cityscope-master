import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImagePlus, X } from 'lucide-react'

export function PhotoUploadWithScan() {
  const [file, setFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setScanning(true)
    const t = setTimeout(() => setScanning(false), 2200)
    return () => clearTimeout(t)
  }

  const clear = () => {
    setFile(null)
    setScanning(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-600/50 bg-slate-900/60 p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
        onChange={handleChange}
      />
      {!file ? (
        <label className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-cyan-400 hover:border-cyan-500/50 border border-transparent rounded-xl cursor-pointer">
          <ImagePlus className="h-10 w-10 transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium">Upload Photo</span>
          <span className="text-xs">Tap to capture or choose</span>
        </label>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-800">
          <img
            src={URL.createObjectURL(file)}
            alt="Upload"
            className="h-full w-full object-cover"
          />
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-slate-900/90"
              >
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    className="h-12 w-12 rounded-full border-2 border-cyan-400 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="h-1 w-32 overflow-hidden rounded-full bg-slate-700"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  >
                    <div className="h-full w-full bg-gradient-to-r from-cyan-400 to-violet-400" />
                  </motion.div>
                  <p className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                    Scanning...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              clear()
            }}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
