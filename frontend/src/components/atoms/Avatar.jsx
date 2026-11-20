import React from 'react'
import { cn } from '../../utils/cn'

export function Avatar({
  src,
  alt = 'User avatar',
  name = 'U',
  size = 'md',
  status,
  className
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn('rounded-full object-cover border-2 border-white shadow-xs', sizes[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-[#133E87] text-white font-semibold flex items-center justify-center border-2 border-white shadow-xs',
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            status === 'online' ? 'bg-emerald-500' : 'bg-slate-400',
            size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
          )}
        />
      )}
    </div>
  )
}
