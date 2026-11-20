import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Users,
  CalendarDays,
  AlertCircle,
  CalendarCheck2,
  ChevronRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import { academicApi, gradeApi } from '../../services/apiService'
import { DashboardTemplate } from '../../components/templates/DashboardTemplate'
import { StatCard } from '../../components/molecules/StatCard'
import { Button } from '../../components/atoms/Button'
import { Badge } from '../../components/atoms/Badge'
import { NoticeBoard } from '../../components/organisms/NoticeBoard'

export function LecturerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])

  useEffect(() => {
    async function load() {
      const cls = await academicApi.getClasses()
      setClasses(Array.isArray(cls) ? cls.slice(0, 3) : [])
    }
    load()
  }, [])

  const lecturerName = user?.full_name || 'Dr. Ir. Budi Santoso, M.Kom.'

  const banner = (
    <div className="overflow-hidden rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-blue-900 to-[#133E87] text-white shadow-md shadow-blue-950/10 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-amber-300">
            <span className="text-xs font-bold uppercase tracking-wider">
              Portal Akademik Dosen
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Selamat Datang, {lecturerName}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 max-w-xl leading-relaxed">
            NIDN: 0612087501 • Fakultas Ilmu Komputer, Teknik Informatika. Kelola jadwal perkuliahan, presensi mahasiswa, dan input nilai akhir semester.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="gold"
              size="sm"
              icon={CalendarCheck2}
              onClick={() => navigate('/attendance')}
            >
              Buka Sesi Presensi
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={GraduationCap}
              onClick={() => navigate('/grades')}
            >
              Input Nilai Mahasiswa
            </Button>
          </div>
        </div>

        <div className="hidden md:block shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
          <p className="text-xs text-blue-200">Status Mengajar Hari Ini</p>
          <p className="text-2xl font-black text-amber-300 mt-1">2 Sesi</p>
          <span className="text-[11px] text-white/80 block mt-0.5">Lab D.2.A & H.4.1</span>
        </div>
      </div>
    </div>
  )

  const stats = (
    <>
      <StatCard
        title="Kelas Diampu"
        value="4 Kelas"
        subtitle="Semester Genap 2025/2026"
        icon={BookOpen}
        iconBgColor="bg-blue-50 text-[#133E87]"
        onClick={() => navigate('/courses')}
      />

      <StatCard
        title="Mahasiswa Bimbingan"
        value="158 Orang"
        subtitle="Mahasiswa Aktif Terdaftar"
        icon={Users}
        iconBgColor="bg-emerald-50 text-emerald-600"
      />

      <StatCard
        title="Input Nilai Akhir"
        value="1 Kelas"
        subtitle="Pemrograman Web Lanjut"
        icon={AlertCircle}
        iconBgColor="bg-amber-50 text-amber-600"
        trend="Perlu Input"
        trendType="warning"
        onClick={() => navigate('/grades')}
      />

      <StatCard
        title="Rata-rata Presensi"
        value="91.8%"
        subtitle="Kehadiran Kelas Prima"
        icon={CalendarCheck2}
        iconBgColor="bg-rose-50 text-rose-600"
        onClick={() => navigate('/attendance')}
      />
    </>
  )

  const mainGrid = (
    <>
      {/* Left Column: Kelas Mengajar & Sesi Presensi Aktif */}
      <div className="lg:col-span-7 space-y-6">
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Kelas Perkuliahan Anda
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/courses')}
            >
              Lihat Semua Kelas
            </Button>
          </div>

          <div className="space-y-3">
            {(Array.isArray(classes) ? classes : []).map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#133E87] bg-blue-50 px-2 py-0.5 rounded-md">
                      {c.course_code}
                    </span>
                    <Badge variant="primary" size="sm">
                      Kelompok {c.class_code}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{c.course_name}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {c.schedule_day}, {c.time_slot} WIB • Ruang {c.room_code}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/attendance')}
                  >
                    Presensi
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/grades')}
                  >
                    Input Nilai
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action alerts like requirement section 9 */}
        <div className="dashboard-card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
            Agenda & Notifikasi Penting Dosen
          </h3>
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Batas Akhir Input Nilai Mid-Semester (UTS)
                </p>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  1 kelas (Pemrograman Web Lanjut A11.4402) belum mempublikasikan rekap nilai ke portal mahasiswa.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Nilai Rekayasa Perangkat Lunak Selesai Dipublikasi
                </p>
                <p className="text-xs text-emerald-800/80 mt-0.5">
                  Nilai akhir untuk 42 mahasiswa kelas A11.4401 telah berhasil terkirim ke sistem transkrip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Notice Board */}
      <div className="lg:col-span-5 space-y-6">
        <NoticeBoard />
      </div>
    </>
  )

  return (
    <DashboardTemplate
      banner={banner}
      stats={stats}
      mainGrid={mainGrid}
    />
  )
}
