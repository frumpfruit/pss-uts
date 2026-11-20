import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../atoms/Badge'
import { cn } from '../../utils/cn'

export function RecentResultsTable({ grades = [] }) {
  const getGradeVariant = (letter) => {
    switch (letter) {
      case 'A': return 'gradeA'
      case 'AB': return 'gradeAB'
      case 'B': return 'gradeB'
      case 'BC': return 'gradeBC'
      case 'C': return 'gradeC'
      case 'D': return 'gradeD'
      case 'E': return 'gradeE'
      default: return 'default'
    }
  }

  return (
    <div className="dashboard-card p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Nilai Semester Berjalan</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Aktif
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Semester Genap 2025/2026 • Periode: 16 Feb – 10 Jul 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/grades?tab=history"
              className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-0.5"
            >
              Riwayat Transkrip
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/grades"
              className="text-xs font-semibold text-[#133E87] hover:underline flex items-center gap-0.5"
            >
              KHS Lengkap
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Mata Kuliah</th>
                <th className="py-2.5 px-3">Tipe Evaluasi</th>
                <th className="py-2.5 px-3 text-center">Nilai</th>
                <th className="py-2.5 px-3 text-center">Skor Angka</th>
                <th className="py-2.5 px-3 text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {(Array.isArray(grades) ? grades : []).slice(0, 5).map((grade) => (
                <tr key={grade.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block truncate max-w-[200px]">
                      {grade.course_name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {grade.course_code} ({grade.sks} SKS)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">
                    {grade.evaluation_type || 'Evaluasi Semester'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant={getGradeVariant(grade.letter_grade)} size="sm">
                      {grade.letter_grade}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    {grade.final_numeric_score ? `${grade.final_numeric_score}/100` : '-'}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 text-[11px] whitespace-nowrap">
                    {grade.published_at || '12 Mei 2026'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
