import { useState } from 'react'
import { motion } from 'framer-motion'

const labels = ['Low', 'Medium', 'High', 'Critical'] as const
type Severity = (typeof labels)[number]

export function SeveritySlider() {
  const [value, setValue] = useState(0)
  const severity: Severity = labels[Math.min(value, 3)]
  const isCritical = severity === 'Critical'

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs">
        <span className="text-cyan-400">Low</span>
        <span
          className={
            isCritical
              ? 'font-semibold text-violet-400'
              : 'font-medium text-slate-400'
          }
        >
          {severity}
        </span>
        <span className="text-violet-400">Critical</span>
      </div>
      <motion.div
        className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800"
        animate={isCritical ? { x: [0, -2, 2, -2, 0] } : {}}
        transition={{
          x: { duration: 0.15, repeat: 3 },
        }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-violet-500 transition-all duration-200"
          style={{ width: `${25 + (value / 100) * 75}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-20 hover:opacity-10 transition-opacity"
        />
        <motion.div
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-800 shadow-lg z-10"
          style={{ left: `${value}%` }}
          animate={
            isCritical
              ? {
                boxShadow: [
                  '0 0 12px rgba(167, 139, 250, 0.4)',
                  '0 0 24px rgba(167, 139, 250, 0.8)',
                  '0 0 12px rgba(167, 139, 250, 0.4)',
                ],
              }
              : {
                boxShadow: '0 0 12px rgba(34, 211, 238, 0.3)',
              }
          }
          transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
        />
      </motion.div>
    </div>
  )
}
