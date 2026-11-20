import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

export function MiniCalendar() {
  const daysHeader = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

  // Calendar dates for active month (e.g. Mei 2026 / current date)
  // Let's create the 5-week grid
  const days = [
    { num: 28, isCurrentMonth: false },
    { num: 29, isCurrentMonth: false },
    { num: 30, isCurrentMonth: false },
    { num: 1, isCurrentMonth: true },
    { num: 2, isCurrentMonth: true },
    { num: 3, isCurrentMonth: true },
    { num: 4, isCurrentMonth: true, isHoliday: true },
    { num: 5, isCurrentMonth: true },
    { num: 6, isCurrentMonth: true },
    { num: 7, isCurrentMonth: true },
    { num: 8, isCurrentMonth: true },
    { num: 9, isCurrentMonth: true },
    { num: 10, isCurrentMonth: true },
    { num: 11, isCurrentMonth: true, isHoliday: true },
    { num: 12, isCurrentMonth: true },
    { num: 13, isCurrentMonth: true },
    { num: 14, isCurrentMonth: true },
    { num: 15, isCurrentMonth: true },
    { num: 16, isCurrentMonth: true },
    { num: 17, isCurrentMonth: true },
    { num: 18, isCurrentMonth: true, isHoliday: true },
    { num: 19, isCurrentMonth: true },
    { num: 20, isCurrentMonth: true, isToday: true }, // Highlighted today badge like screenshot
    { num: 21, isCurrentMonth: true },
    { num: 22, isCurrentMonth: true },
    { num: 23, isCurrentMonth: true },
    { num: 24, isCurrentMonth: true },
    { num: 25, isCurrentMonth: true, isHoliday: true },
    { num: 26, isCurrentMonth: true },
    { num: 27, isCurrentMonth: true },
    { num: 28, isCurrentMonth: true },
    { num: 29, isCurrentMonth: true },
    { num: 30, isCurrentMonth: true },
    { num: 31, isCurrentMonth: true },
    { num: 1, isCurrentMonth: false },
  ]

  return (
    <div className="dashboard-card p-5 h-full flex flex-col justify-between select-none">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Kalender Akademik
          </h3>
          <Link
            to="/calendar"
            className="text-xs font-semibold text-[#133E87] hover:underline flex items-center gap-0.5"
          >
            Lihat Jadwal
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="text-center mb-3">
          <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            Mei 2026
          </span>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysHeader.map((d, idx) => (
            <span
              key={d}
              className={cn(
                'text-[10px] font-semibold',
                idx === 6 ? 'text-rose-500' : 'text-slate-400'
              )}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-7"
            >
              <span
                className={cn(
                  'w-6 h-6 text-xs flex items-center justify-center rounded-full transition-colors',
                  item.isToday && 'bg-[#133E87] text-white font-bold shadow-xs',
                  !item.isToday && item.isCurrentMonth && !item.isHoliday && 'text-slate-700 hover:bg-slate-100 font-medium',
                  !item.isToday && item.isCurrentMonth && item.isHoliday && 'text-rose-500 hover:bg-rose-50 font-medium',
                  !item.isCurrentMonth && 'text-slate-300'
                )}
              >
                {item.num}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#133E87]" />
          Hari Ini
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Minggu / Libur
        </span>
      </div>
    </div>
  )
}
