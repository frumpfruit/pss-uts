import React from 'react'
import { cn } from '../../utils/cn'

export function Typography({
  as: Component = 'p',
  variant = 'body',
  children,
  className,
  ...props
}) {
  const variants = {
    h1: 'text-2xl lg:text-3xl font-bold tracking-tight text-slate-900',
    h2: 'text-xl lg:text-2xl font-bold tracking-tight text-slate-900',
    h3: 'text-lg font-semibold text-slate-800',
    h4: 'text-base font-semibold text-slate-800',
    body: 'text-sm text-slate-600 leading-relaxed',
    bodyBold: 'text-sm font-semibold text-slate-800',
    caption: 'text-xs text-slate-400',
    captionMedium: 'text-xs font-medium text-slate-500',
    metric: 'text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight',
  }

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  )
}
