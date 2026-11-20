import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PerformanceDonutChart() {
  const data = [
    { label: 'Sangat Memuaskan (A)', value: 60, color: '#10B981' }, // Emerald
    { label: 'Memuaskan (AB / B)', value: 20, color: '#2563EB' },   // Royal Blue
    { label: 'Cukup (BC / C)', value: 12, color: '#F59E0B' },       // Gold/Amber
    { label: 'Perlu Evaluasi (D / E)', value: 8, color: '#EF4444' } // Rose
  ]

  // Circumference for r=38 is 2 * PI * 38 ≈ 238.76
  const circumference = 238.76

  let accumulatedPercent = 0
  const slices = data.map(item => {
    const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
    accumulatedPercent += item.value
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset
    }
  })

  return (
    <div className="dashboard-card p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Performa Akademik
          </h3>
          <Link
            to="/grades"
            className="text-xs font-semibold text-[#133E87] hover:underline flex items-center gap-0.5"
          >
            Lihat Detail
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-2">
          {/* Circular Donut Graphic */}
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth="11"
              />
              {/* Segments */}
              {slices.map((slice, index) => (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="11"
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              ))}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-slate-900 leading-none">
                84%
              </span>
              <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Indeks Performa
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2 grow w-full">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium truncate max-w-[120px] sm:max-w-[150px]">
                    {item.label}
                  </span>
                </div>
                <span className="font-bold text-slate-800 shrink-0">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 text-center">
        Dihitung berdasarkan 24 SKS mata kuliah selesai dievaluasi.
      </p>
    </div>
  )
}
