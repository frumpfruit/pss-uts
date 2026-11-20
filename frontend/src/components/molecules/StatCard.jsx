import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-blue-50 text-[#133E87]',
  trend,
  trendType = 'neutral',
  className,
  onClick
}) {
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={onClick}
      className={cn(
        'dashboard-card p-4 sm:p-5 flex flex-col justify-center cursor-default select-none overflow-hidden relative min-w-0 transition-all',
        onClick && 'cursor-pointer hover:border-slate-300',
        className
      )}
    >
      {/* Top Header: Title & Compact Icon */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <span className="text-xs font-semibold text-slate-500 truncate" title={title}>
          {title}
        </span>
        {Icon && (
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs', iconBgColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Main Metric Value & Trend Badge */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 inline-flex items-center leading-none',
                trendType === 'positive' && 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
                trendType === 'warning' && 'bg-amber-50 text-amber-700 border border-amber-200/60',
                trendType === 'neutral' && 'bg-slate-100 text-slate-600 border border-slate-200/60'
              )}
            >
              {trend}
            </span>
          )}
        </div>

        {/* Subtitle / Context description */}
        {subtitle && (
          <p className="text-[11px] text-slate-400 truncate font-medium pt-0.5" title={subtitle}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  )
}
