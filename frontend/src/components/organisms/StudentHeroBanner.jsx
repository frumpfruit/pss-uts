import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, BookOpen, GraduationCap } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'

export function StudentHeroBanner() {
  const { user } = useAuth()
  const name = user?.first_name || 'Arya Pratama'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-blue-50 via-sky-50 to-amber-50/50 border border-blue-100/80 shadow-xs select-none"
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-slate-500">
              Selamat Pagi,
            </span>
            <span className="text-base animate-bounce">👋</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {name}!
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
            Pantau rencana studi, presensi kuliah, dan perkembangan indeks prestasi akademik Anda di Universitas Dian Nuswantoro.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-white/80 border border-blue-200/60 text-[#133E87] shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
              Semester Genap 2025/2026
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-xl bg-white/80 border border-slate-200/60 text-slate-600 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Status: Mahasiswa Aktif
            </span>
          </div>
        </div>

        {/* Decorative 3D Book Graphic inspired by reference screenshot */}
        <div className="hidden sm:flex items-center justify-center shrink-0 pr-4">
          <div className="relative">
            {/* Potted plant / decorative element */}
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-3xl bg-gradient-to-tr from-[#133E87] to-blue-500 flex items-center justify-center shadow-lg shadow-blue-900/15 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-center text-white">
                <BookOpen className="w-10 h-10 mx-auto text-amber-300 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">
                  UDINUS
                </span>
              </div>
            </div>
            {/* Secondary stacked book element */}
            <div className="absolute -bottom-2 -right-3 w-16 h-8 rounded-xl bg-amber-400 border-2 border-white shadow-md transform rotate-6 flex items-center justify-center">
              <span className="text-[9px] font-black text-slate-900">SIAKAD</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
