import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'

export function VoicePulse() {
  const bars = 12
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-10">
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-500/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
          whileHover={{ scale: 1.02 }}
        >
          <Mic className="h-10 w-10 text-white" />
        </motion.div>
      </div>

      <div className="flex items-end justify-center gap-[3px] h-12">
        {[...Array(bars)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
            animate={{
              height: ['40%', '95%', '45%', '85%', '40%'],
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ minHeight: 8 }}
          />
        ))}
      </div>
      <p className="font-mono text-sm uppercase tracking-widest text-cyan-400">
        Recording Signal...
      </p>
    </div>
  )
}
