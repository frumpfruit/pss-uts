import React from 'react'
import { Megaphone, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CAMPUS_ANNOUNCEMENTS } from '../../constants/mockData'

export function NoticeBoard() {
  return (
    <div className="dashboard-card p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Papan Pengumuman
          </h3>
          <Link
            to="/notices"
            className="text-xs font-semibold text-[#133E87] hover:underline flex items-center gap-0.5"
          >
            Lihat Semua
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3.5">
          {CAMPUS_ANNOUNCEMENTS.map((ann) => (
            <div key={ann.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#133E87] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#133E87] group-hover:text-white transition-colors">
                <Megaphone className="w-4 h-4" />
              </div>
              <div className="grow min-w-0">
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#133E87] transition-colors">
                  {ann.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                  {ann.content}
                </p>
                <span className="text-[10px] font-semibold text-blue-600 mt-1 block">
                  {ann.date} • {ann.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
