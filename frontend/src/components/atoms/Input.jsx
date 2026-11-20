import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(function Input(
  {
    type = 'text',
    className,
    error,
    icon: Icon,
    iconPosition = 'left',
    disabled = false,
    ...props
  },
  ref
) {
  return (
    <div className="relative w-full">
      {Icon && iconPosition === 'left' && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'w-full bg-white text-slate-800 text-sm rounded-xl border border-slate-200 transition-all duration-150',
          'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]',
          'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
          Icon && iconPosition === 'left' ? 'pl-10' : 'pl-3.5',
          Icon && iconPosition === 'right' ? 'pr-10' : 'pr-3.5',
          'py-2.5',
          error && 'border-rose-400 focus:ring-rose-200 focus:border-rose-500',
          className
        )}
        {...props}
      />
      {Icon && iconPosition === 'right' && (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  )
})
