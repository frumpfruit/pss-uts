import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  CalendarDays,
  CalendarCheck2,
  Clock,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronDown,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { Badge } from '../../components/atoms/Badge'
import { Button } from '../../components/atoms/Button'
import { toast } from '../../utils/toast'
import { INITIAL_TRANSCRIPT_HISTORY } from '../../constants/mockData'

// Schedule and lecturer mappings for past semester courses to guarantee
// complete "kd mk, klpk mk, hari, dan bar progress presensi" on all semesters
const PAST_COURSES_EXTRA = {
  // Semester 3
  'A11.54301': { class_code: 'A11.4301', schedule_day: 'Senin', schedule_time: '07:00 - 10:20', room_code: 'H.4.1', lecturer: 'Dr. Ir. Budi Santoso, M.Kom.', present: 14, total: 14, pct: 100 },
  'A11.54302': { class_code: 'A11.4302', schedule_day: 'Selasa', schedule_time: '08:40 - 11:10', room_code: 'D.2.A', lecturer: 'Prof. Dr. Supriyono, M.Cs.', present: 13, total: 14, pct: 92.8 },
  'A11.54303': { class_code: 'A11.4301', schedule_day: 'Rabu', schedule_time: '10:20 - 12:50', room_code: 'H.4.2', lecturer: 'Dr. Retno Kusumaningrum, M.Kom.', present: 14, total: 14, pct: 100 },
  'A11.54304': { class_code: 'A11.4303', schedule_day: 'Kamis', schedule_time: '07:00 - 09:30', room_code: 'D.3.B', lecturer: 'Ahmad Fauzi, M.T.', present: 14, total: 14, pct: 100 },
  'A11.54305': { class_code: 'A11.4301', schedule_day: 'Jumat', schedule_time: '08:00 - 10:30', room_code: 'H.5.1', lecturer: 'Dr. Aris Sugiharto, M.Kom.', present: 13, total: 14, pct: 92.8 },
  'A11.54306': { class_code: 'A11.4302', schedule_day: 'Jumat', schedule_time: '13:30 - 16:00', room_code: 'H.3.2', lecturer: 'Sri Mulyani, M.Kom.', present: 14, total: 14, pct: 100 },
  'UDS.105': { class_code: 'UDS.4301', schedule_day: 'Sabtu', schedule_time: '09:00 - 10:40', room_code: 'Online', lecturer: 'Dra. Endang Widayati, M.Hum.', present: 14, total: 14, pct: 100 },

  // Semester 2
  'A11.54201': { class_code: 'A11.4201', schedule_day: 'Senin', schedule_time: '08:40 - 12:00', room_code: 'H.4.1', lecturer: 'Dr. Ir. Budi Santoso, M.Kom.', present: 14, total: 14, pct: 100 },
  'A11.54202': { class_code: 'A11.4202', schedule_day: 'Selasa', schedule_time: '07:00 - 09:30', room_code: 'D.2.A', lecturer: 'Ahmad Fauzi, M.T.', present: 14, total: 14, pct: 100 },
  'A11.54203': { class_code: 'A11.4201', schedule_day: 'Rabu', schedule_time: '10:20 - 12:50', room_code: 'H.4.2', lecturer: 'Prof. Dr. Supriyono, M.Cs.', present: 13, total: 14, pct: 92.8 },
  'A11.54204': { class_code: 'A11.4203', schedule_day: 'Kamis', schedule_time: '08:00 - 10:30', room_code: 'D.3.B', lecturer: 'Dr. Aris Sugiharto, M.Kom.', present: 12, total: 14, pct: 85.7 },
  'A11.54205': { class_code: 'A11.4201', schedule_day: 'Kamis', schedule_time: '13:00 - 15:30', room_code: 'H.5.1', lecturer: 'Sri Mulyani, M.Kom.', present: 14, total: 14, pct: 100 },
  'A11.54206': { class_code: 'A11.4202', schedule_day: 'Jumat', schedule_time: '08:00 - 10:30', room_code: 'H.3.2', lecturer: 'Dr. Retno Kusumaningrum, M.Kom.', present: 13, total: 14, pct: 92.8 },
  'UDS.103': { class_code: 'UDS.4201', schedule_day: 'Jumat', schedule_time: '13:30 - 15:10', room_code: 'Online', lecturer: 'Drs. H. Syamsudin, M.Si.', present: 14, total: 14, pct: 100 },
  'UDS.104': { class_code: 'UDS.4202', schedule_day: 'Sabtu', schedule_time: '10:00 - 10:50', room_code: 'Online', lecturer: 'Drs. KH. Ahmad Dimyati, M.Ag.', present: 14, total: 14, pct: 100 },

  // Semester 1
  'A11.54101': { class_code: 'A11.4101', schedule_day: 'Senin', schedule_time: '08:40 - 11:10', room_code: 'H.4.1', lecturer: 'Dr. Aris Sugiharto, M.Kom.', present: 14, total: 14, pct: 100 },
  'A11.54102': { class_code: 'A11.4102', schedule_day: 'Selasa', schedule_time: '07:00 - 10:20', room_code: 'D.2.A', lecturer: 'Dr. Ir. Budi Santoso, M.Kom.', present: 14, total: 14, pct: 100 },
  'A11.54103': { class_code: 'A11.4101', schedule_day: 'Rabu', schedule_time: '08:40 - 11:10', room_code: 'H.4.2', lecturer: 'Ahmad Fauzi, M.T.', present: 14, total: 14, pct: 100 },
  'A11.54104': { class_code: 'A11.4103', schedule_day: 'Kamis', schedule_time: '10:20 - 12:50', room_code: 'D.3.B', lecturer: 'Prof. Dr. Supriyono, M.Cs.', present: 14, total: 14, pct: 100 },
  'UDS.101': { class_code: 'UDS.4101', schedule_day: 'Jumat', schedule_time: '08:00 - 09:40', room_code: 'H.5.1', lecturer: 'Siti Rahayu, M.Pd.', present: 13, total: 14, pct: 92.8 },
  'UDS.102': { class_code: 'UDS.4102', schedule_day: 'Jumat', schedule_time: '13:30 - 15:10', room_code: 'H.3.2', lecturer: 'Drs. Bambang Sudarsono, M.Si.', present: 14, total: 14, pct: 100 },
  'A11.54105': { class_code: 'A11.4101', schedule_day: 'Sabtu', schedule_time: '08:00 - 10:30', room_code: 'Lab Fisika', lecturer: 'Dr. Mulyadi, M.Si.', present: 12, total: 14, pct: 85.7 }
}

export function KRSOrdinaryView({ krs, coursesAttendance = [], onSwitchToInput }) {
  // Semester options: Semester Berjalan (Current) & Past Semesters
  const semesterOptions = [
    { id: 'CURRENT', label: 'Semester 4 • Genap 2025/2026 (Sedang Berjalan)', type: 'ACTIVE' },
    { id: 'SEM-3', label: 'Semester 3 • Ganjil 2025/2026 (Semester Lalu)', type: 'PAST', semNum: 3 },
    { id: 'SEM-2', label: 'Semester 2 • Genap 2024/2025 (Semester Lalu)', type: 'PAST', semNum: 2 },
    { id: 'SEM-1', label: 'Semester 1 • Ganjil 2024/2025 (Semester Lalu)', type: 'PAST', semNum: 1 }
  ]

  const [selectedSemester, setSelectedSemester] = useState('CURRENT')

  // Map attendance by course_code for current semester
  const attendanceMap = {}
  coursesAttendance.forEach(item => {
    if (item.course_code) {
      attendanceMap[item.course_code] = item
    }
  })

  // Determine current display list based on selected semester
  let displayCourses = []
  let semesterMeta = {
    title: 'Semester Genap 2025/2026',
    subtitle: 'Semester Sedang Berjalan (Aktif)',
    status: krs?.status || 'APPROVED',
    total_sks: krs?.total_sks || 17,
    max_sks: krs?.max_sks || 24,
    isCurrent: true
  }

  if (selectedSemester === 'CURRENT') {
    displayCourses = (krs?.items || []).map(item => {
      const att = attendanceMap[item.course_code]
      const hasAtt = !!att && att.total_sessions !== undefined && att.total_sessions > 0

      // Newly added courses in KRS have 0 sessions and 0% attendance
      const totalSessions = hasAtt ? att.total_sessions : 0
      const presentSessions = hasAtt ? (att.present || 0) : 0
      const percentage = hasAtt
        ? (att.percentage !== undefined ? att.percentage : Math.round((presentSessions / totalSessions) * 100))
        : 0

      return {
        id: item.id,
        code: item.course_code,
        name: item.course_name,
        class_code: item.class_code,
        sks: item.sks,
        schedule_day: item.schedule_day || 'Senin',
        schedule_time: item.schedule_time || '08:40 - 11:10',
        room_code: item.room_code || 'D.2.A',
        lecturer: item.lecturer_name || 'Dr. Ir. Budi Santoso, M.Kom.',
        total_sessions: totalSessions,
        present_sessions: presentSessions,
        percentage: percentage,
        status: hasAtt ? 'SEDANG_BERJALAN' : 'BARU_DIAMBIL'
      }
    })
  } else {
    // Past semester from transcript history
    const semOption = semesterOptions.find(o => o.id === selectedSemester)
    const pastSem = INITIAL_TRANSCRIPT_HISTORY.find(s => s.semester_number === semOption?.semNum) || INITIAL_TRANSCRIPT_HISTORY[0]

    semesterMeta = {
      title: `Semester ${pastSem.semester_type === 'GENAP' ? 'Genap' : 'Ganjil'} ${pastSem.academic_year}`,
      subtitle: `Semester ${pastSem.semester_number} (Telah Selesai) • IPS: ${Number(pastSem.ips || 0).toFixed(2)}`,
      status: 'SELESAI',
      total_sks: pastSem.total_sks,
      max_sks: 24,
      isCurrent: false
    }

    displayCourses = (pastSem.courses || []).map((c, idx) => {
      const extra = PAST_COURSES_EXTRA[c.code] || {
        class_code: `A11.4${pastSem.semester_number}01`,
        schedule_day: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][idx % 5],
        schedule_time: '08:40 - 11:10',
        room_code: 'H.4.1',
        lecturer: 'Dosen Pengampu UDINUS',
        present: 14,
        total: 14,
        pct: 100
      }

      return {
        id: `past-${c.code}`,
        code: c.code,
        name: c.name,
        class_code: extra.class_code,
        sks: c.sks,
        schedule_day: extra.schedule_day,
        schedule_time: extra.schedule_time,
        room_code: extra.room_code,
        lecturer: extra.lecturer,
        total_sessions: extra.total,
        present_sessions: extra.present,
        percentage: extra.pct,
        grade: c.grade,
        point: c.point,
        status: 'LULUS'
      }
    })
  }

  // Calculate average attendance for this semester (exclude newly added courses with 0 sessions)
  const coursesWithAttendance = displayCourses.filter(c => c.total_sessions > 0)
  const avgAttendance = coursesWithAttendance.length > 0
    ? Number((coursesWithAttendance.reduce((sum, c) => sum + (c.percentage || 0), 0) / coursesWithAttendance.length).toFixed(1))
    : 100.0

  const handlePrint = () => {
    window.print()
    toast.info('Mencetak KRS', 'Dialog cetak/ekspor PDF Kartu Rencana Studi telah dibuka.')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Semester Selector */}
      <div className="dashboard-card p-6 bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#133E87]/10 text-[#133E87]">
                KRS (Mata Kuliah Mahasiswa)
              </span>
              {semesterMeta.isCurrent ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Semester Berjalan
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  Semester Lampau (Selesai)
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {semesterMeta.title}
            </h3>
            <p className="text-xs text-slate-500">
              {semesterMeta.subtitle} • Program Studi S1 Teknik Informatika
            </p>
          </div>

          {/* Action Buttons & Semester Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Semester Switcher Dropdown */}
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#133E87]/20 shadow-2xs cursor-pointer"
              >
                {semesterOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={Printer}
              onClick={handlePrint}
            >
              Cetak KRS
            </Button>

            {onSwitchToInput && semesterMeta.isCurrent && (
              <Button
                variant="gold"
                size="sm"
                icon={FileSpreadsheet}
                onClick={onSwitchToInput}
              >
                Input / Pilih KRS
              </Button>
            )}
          </div>
        </div>

        {/* 4 Summary Mini Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-5">
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Total Beban</span>
            <span className="text-xl font-black text-[#133E87]">
              {semesterMeta.total_sks} <span className="text-xs font-medium text-slate-500">SKS</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Mata Kuliah</span>
            <span className="text-xl font-black text-slate-800">
              {displayCourses.length} <span className="text-xs font-medium text-slate-500">Matkul</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Rata-rata Presensi</span>
            <span className={`text-xl font-black ${avgAttendance >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {avgAttendance}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Status KRS</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              {semesterMeta.isCurrent ? 'Disetujui (Approved)' : 'Semester Selesai'}
            </span>
          </div>
        </div>
      </div>

      {/* Switcher Tab notice for Input KRS if in current semester */}
      {semesterMeta.isCurrent && onSwitchToInput && (
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#133E87] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Ingin Mengambil atau Mengubah Pilihan Mata Kuliah?
              </h4>
              <p className="text-[11px] text-slate-600">
                Gunakan menu <strong>Input KRS</strong> untuk menambah kelas dari katalog yang ditawarkan atau menghapus rencana studi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSwitchToInput}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#133E87] text-white hover:bg-[#0B2545] text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <span>Buka Input KRS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Detailed Courses Table with Kode MK, Klpk MK, Hari, & Bar Progress Presensi */}
      <div className="dashboard-card p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Mata Kuliah Diambil ({semesterMeta.title})
            </h3>
            <p className="text-xs text-slate-500">
              Rincian kode mk, kelompok, jadwal hari, serta monitoring persentase kehadiran kuliah
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {displayCourses.length} Mata Kuliah
          </span>
        </div>

        {displayCourses.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada mata kuliah pada semester ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3">Kode & Mata Kuliah</th>
                  <th className="py-3 px-3 text-center">SKS</th>
                  <th className="py-3 px-3 text-center">Kelompok (Klpk)</th>
                  <th className="py-3 px-3">Jadwal Kuliah (Hari & Jam)</th>
                  <th className="py-3 px-3 w-64">Bar Progress Presensi</th>
                  <th className="py-3 px-3 text-center">Status Kelayakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {displayCourses.map((c, idx) => {
                  const pct = c.percentage || 100
                  const isSafe = pct >= 75
                  const progressColor = pct >= 85 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-500' : 'bg-rose-500'

                  return (
                    <tr key={c.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      {/* No */}
                      <td className="py-4 px-3 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Kode MK & Nama MK */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono font-bold text-xs text-[#133E87] bg-blue-50 px-2 py-0.5 rounded-md">
                            {c.code}
                          </span>
                          {c.grade && (
                            <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-amber-50 text-amber-800 border border-amber-200">
                              Nilai: {c.grade} ({Number(c.point || 0).toFixed(1)})
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-slate-900 block text-sm">
                          {c.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Dosen: {c.lecturer}
                        </span>
                      </td>

                      {/* SKS */}
                      <td className="py-4 px-3 text-center">
                        <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                          {c.sks} SKS
                        </span>
                      </td>

                      {/* Kelompok MK (Klpk) */}
                      <td className="py-4 px-3 text-center">
                        <span className="font-mono font-bold text-xs text-blue-900 bg-blue-100/70 px-2.5 py-1 rounded-lg">
                          {c.class_code}
                        </span>
                      </td>

                      {/* Jadwal Kuliah (Hari, Jam, Ruang) */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <CalendarDays className="w-3.5 h-3.5 text-[#133E87]" />
                          <span>{c.schedule_day}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.schedule_time} WIB</span>
                          <span className="text-slate-300">•</span>
                          <span>Ruang {c.room_code}</span>
                        </div>
                      </td>

                      {/* Bar Progress Presensi */}
                      <td className="py-4 px-3">
                        {c.total_sessions === 0 ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400 font-medium">0 / 0 Sesi Berjalan</span>
                              <span className="font-semibold text-slate-400">0%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div className="h-2.5 rounded-full bg-slate-200" style={{ width: '0%' }} />
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Mata kuliah baru diambil (belum ada presensi)
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">
                                {c.present_sessions} / {c.total_sessions} Sesi Hadir
                              </span>
                              <span className={`font-black ${isSafe ? 'text-slate-900' : 'text-rose-600'}`}>
                                {pct}%
                              </span>
                            </div>

                            {/* Progress Bar Visual */}
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`}
                                style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Min. Kelayakan 75%</span>
                              <span className={isSafe ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                {isSafe ? 'Aman' : 'Kurang'}
                              </span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status Kelayakan Ujian */}
                      <td className="py-4 px-3 text-center">
                        {c.total_sessions === 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Baru Diambil
                          </span>
                        ) : isSafe ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Layak Ujian
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            Di Bawah 75%
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
