import React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../utils/cn'

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search anything...',
  className,
  size = 'md'
}) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-slate-50/80 hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm rounded-full pl-10 pr-9 border border-slate-200/80',
          'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 focus:border-[#133E87]',
          size === 'sm' ? 'py-1.5 text-xs' : 'py-2'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
