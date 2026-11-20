import React from 'react'
import { cn } from '../../utils/cn'

export function Spinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-[#133E87] border-slate-200',
        sizes[size],
        className
      )}
    />
  )
}

export function Divider({ children, className }) {
  if (!children) {
    return <hr className={cn('border-t border-slate-100 my-4', className)} />
  }

  return (
    <div className={cn('relative my-4 flex items-center', className)}>
      <div className="grow border-t border-slate-200" />
      <span className="shrink-0 mx-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
        {children}
      </span>
      <div className="grow border-t border-slate-200" />
    </div>
  )
}
