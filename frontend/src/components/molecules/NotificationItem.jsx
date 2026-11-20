import React from 'react'
import { CheckCircle2, AlertTriangle, BookOpen, Calendar, Bell, FileText } from 'lucide-react'
import { cn } from '../../utils/cn'

export function NotificationItem({ notification, onMarkRead }) {
  const { id, title, message, type, is_read, created_at } = notification

  const getIcon = () => {
    switch (type) {
      case 'KRS_APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      case 'KRS_REJECTED':
      case 'ATTENDANCE_WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      case 'GRADE_PUBLISHED':
        return <BookOpen className="w-4 h-4 text-[#133E87]" />
      case 'SCHEDULE_CHANGED':
        return <Calendar className="w-4 h-4 text-blue-600" />
      default:
        return <Bell className="w-4 h-4 text-slate-500" />
    }
  }

  const getIconBg = () => {
    switch (type) {
      case 'KRS_APPROVED':
        return 'bg-emerald-50'
      case 'KRS_REJECTED':
      case 'ATTENDANCE_WARNING':
        return 'bg-amber-50'
      case 'GRADE_PUBLISHED':
        return 'bg-blue-50'
      default:
        return 'bg-slate-100'
    }
  }

  return (
    <div
      onClick={() => onMarkRead && onMarkRead(id)}
      className={cn(
        'p-3.5 rounded-2xl flex items-start gap-3 transition-all cursor-pointer border border-transparent',
        is_read ? 'bg-transparent hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70 border-blue-100/60'
      )}
    >
      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', getIconBg())}>
        {getIcon()}
      </div>
      <div className="grow min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className={cn('text-xs truncate', is_read ? 'font-medium text-slate-700' : 'font-bold text-slate-900')}>
            {title}
          </p>
          {!is_read && (
            <span className="w-2 h-2 rounded-full bg-[#133E87] shrink-0" />
          )}
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {message}
        </p>
        <span className="text-[10px] text-slate-400 mt-1 block">
          {created_at}
        </span>
      </div>
    </div>
  )
}
