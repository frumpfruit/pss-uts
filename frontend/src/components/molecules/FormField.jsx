import React from 'react'
import { cn } from '../../utils/cn'

export function FormField({
  label,
  required = false,
  error,
  helpText,
  className,
  children
}) {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && (
        <p className="text-xs text-slate-400">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  )
}
