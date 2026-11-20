import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Select = forwardRef(function Select(
  {
    children,
    className,
    error,
    disabled = false,
    ...props
  },
  ref
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full bg-white text-slate-800 text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]',
          'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer',
          error && 'border-rose-400 focus:ring-rose-200 focus:border-rose-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  )
})
