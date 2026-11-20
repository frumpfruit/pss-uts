import React from 'react'
import { Megaphone, Calendar, Tag, ArrowRight } from 'lucide-react'
import { CAMPUS_ANNOUNCEMENTS } from '../../constants/mockData'
import { Badge } from '../../components/atoms/Badge'

export function NoticeListPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-[#133E87]" />
          Papan Pengumuman & Berita Kampus
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pengumuman resmi Biro Administrasi Akademik & Kemahasiswaan UDINUS
        </p>
      </div>

      <div className="space-y-4">
        {CAMPUS_ANNOUNCEMENTS.map(ann => (
          <div
            key={ann.id}
            className="dashboard-card p-6 border border-slate-100 hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="primary" size="sm">
                {ann.category}
              </Badge>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {ann.date}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {ann.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {ann.content}
            </p>

            <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-[#133E87] flex items-center gap-1 cursor-pointer hover:underline">
              Baca Dokumen Surat Edaran Lengkap
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
