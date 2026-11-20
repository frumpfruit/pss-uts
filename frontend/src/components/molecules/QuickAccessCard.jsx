import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function QuickAccessCard({
  icon: Icon,
  label,
  colorClass = 'text-[#133E87] bg-blue-50',
  onClick
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
    >
      <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-105', colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-semibold text-slate-700 text-center leading-tight group-hover:text-[#133E87] transition-colors">
        {label}
      </span>
    </motion.button>
  )
}
