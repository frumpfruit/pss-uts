import React from 'react'
import { cn } from '../../utils/cn'

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-[#133E87] border-blue-200/60 font-semibold',
    gold: 'bg-amber-50 text-amber-800 border-amber-200/80 font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 font-medium',
    // Grade badges
    gradeA: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    gradeAB: 'bg-teal-100 text-teal-800 border-teal-300 font-bold',
    gradeB: 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
    gradeBC: 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold',
    gradeC: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    gradeD: 'bg-orange-100 text-orange-800 border-orange-300 font-bold',
    gradeE: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    lg: 'text-sm px-3 py-1.5 rounded-xl gap-2',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center border transition-colors',
        variants[variant] || variants.default,
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </span>
  )
}
