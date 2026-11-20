import React, { useEffect, useState } from 'react'
import {
  FileText,
  GraduationCap,
  ClipboardList,
  Trophy,
  CalendarCheck2,
  FileSpreadsheet,
  BookOpen,
  CalendarDays,
  Download,
  MessageSquare,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import { gradeApi, attendanceApi, enrollmentApi, DEFAULT_STUDENT_ID } from '../../services/apiService'
import { isSessionExpired } from '../../utils/attendance'
import { toast } from '../../utils/toast'
import { DashboardTemplate } from '../../components/templates/DashboardTemplate'
import { StudentHeroBanner } from '../../components/organisms/StudentHeroBanner'
import { StatCard } from '../../components/molecules/StatCard'
import { RecentResultsTable } from '../../components/organisms/RecentResultsTable'
import { NoticeBoard } from '../../components/organisms/NoticeBoard'
import { MiniCalendar } from '../../components/organisms/MiniCalendar'
import { QuickAccessCard } from '../../components/molecules/QuickAccessCard'
import { PerformanceDonutChart } from '../../components/organisms/PerformanceDonutChart'

export function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [grades, setGrades] = useState([])
  const [enrollment, setEnrollment] = useState(null)
  const [attendance, setAttendance] = useState({ percentage: 92.5 })
  const [activeSessions, setActiveSessions] = useState([])
  const [submittingSessionId, setSubmittingSessionId] = useState(null)

  const studentId = (user?.id && user.id !== 'usr-student-01') ? user.id : DEFAULT_STUDENT_ID

  useEffect(() => {
    async function loadData() {
      try {
        const studentGrades = await gradeApi.getStudentGrades(studentId)
        setGrades(Array.isArray(studentGrades) ? studentGrades : [])
        const enr = await enrollmentApi.getStudentEnrollment(studentId)
        if (enr) setEnrollment(enr)
        const attSummary = await attendanceApi.getSummary(studentId)
        if (attSummary && attSummary.percentage !== undefined) {
          setAttendance(attSummary)
        }
        const sessions = await attendanceApi.getActiveSessions(studentId)
        setActiveSessions(Array.isArray(sessions) ? sessions : [])
      } catch (err) {
        console.error('Error loading student dashboard data', err)
      }
    }
    loadData()
  }, [studentId])

  const handleQuickPresence = async (sessionId) => {
    const targetSession = activeSessions.find(s => s.id === sessionId)
    if (targetSession && isSessionExpired(targetSession)) {
      toast.error('Batas Waktu Berakhir', 'Sesi presensi ini telah resmi ditutup karena melewati batas jam perkuliahan.')
      return
    }

    setSubmittingSessionId(sessionId)
    try {
      const res = await attendanceApi.submitAttendance(sessionId, studentId)
      toast.success(
        'Presensi Berhasil Dicatat!',
        `Kehadiran Anda berhasil diverifikasi pada pukul ${res?.record?.timestamp || 'sekarang'}.`
      )
      setActiveSessions(prev =>
        prev.map(s => {
          if (s.id !== sessionId) return s
          const updatedRecords = s.records ? [...s.records] : []
          const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          const existingIdx = updatedRecords.findIndex(r => r.student_id === studentId)
          if (existingIdx >= 0) {
            updatedRecords[existingIdx] = { ...updatedRecords[existingIdx], status: 'PRESENT', timestamp: timeStr }
          } else {
            updatedRecords.push({
              student_id: studentId,
              nim: user?.student_profile?.nim || 'A11.2023.14920',
              name: user?.full_name || 'Arya Pratama',
              status: 'PRESENT',
              timestamp: timeStr
            })
          }
          return { ...s, records: updatedRecords }
        })
      )
      const attSummary = await attendanceApi.getSummary(studentId)
      if (attSummary && attSummary.percentage !== undefined) {
        setAttendance(attSummary)
      }
    } catch (err) {
      toast.error('Gagal Presensi', err.message)
    } finally {
      setSubmittingSessionId(null)
    }
  }

  const profile = user?.student_profile || {}

  // 5 Stat Cards row faithfully mirroring the reference screenshot:
  // 4 Core Stat Cards:
  // 1. CGPA (IPK Kumulatif)
  // 2. Courses Enrolled (Mata Kuliah & SKS)
  // 3. Academic Rank (Peringkat Akademik)
  // 4. Attendance Rate (Tingkat Presensi)
  const statsRow = (
    <>
      <StatCard
        title="IPK Kumulatif (CGPA)"
        value={profile.gpa ? Number(profile.gpa).toFixed(2) : '3.82'}
        subtitle="Kumulatif Sem 1–3 • Predikat Pujian"
        icon={FileText}
        iconBgColor="bg-blue-50 text-[#133E87]"
        trend="+0.08"
        trendType="positive"
        onClick={() => navigate('/grades')}
      />

      <StatCard
        title="Mata Kuliah Diambil"
        value={`${enrollment?.items ? enrollment.items.length : 0} Matkul`}
        subtitle={`${enrollment?.total_sks !== undefined ? enrollment.total_sks : 0} SKS • Semester Genap`}
        icon={GraduationCap}
        iconBgColor="bg-emerald-50 text-emerald-600"
        trend="Aktif"
        trendType="positive"
        onClick={() => navigate('/krs')}
      />

      <StatCard
        title="Peringkat Akademik"
        value={`#${profile.rank || 3}`}
        subtitle={`dari ${profile.total_cohort || 120} Mahasiswa Angkatan`}
        icon={Trophy}
        iconBgColor="bg-amber-50 text-amber-600"
        trend="Top 5%"
        trendType="positive"
        onClick={() => navigate('/profile')}
      />

      <StatCard
        title="Tingkat Presensi"
        value={`${attendance.percentage}%`}
        subtitle="Kehadiran Prima (Min 75%)"
        icon={CalendarCheck2}
        iconBgColor="bg-rose-50 text-rose-600"
        trend={attendance.percentage >= 75 ? 'Aman' : 'Peringatan'}
        trendType={attendance.percentage >= 75 ? 'positive' : 'warning'}
        onClick={() => navigate('/attendance')}
      />
    </>
  )

  const activeSemesterGrades = React.useMemo(() => {
    if (!enrollment?.items || enrollment.items.length === 0) return grades
    return grades.filter(g =>
      enrollment.items.some(it =>
        (it.course_id && g.course_id && it.course_id === g.course_id) ||
        (it.course_code && g.course_code && it.course_code === g.course_code) ||
        (it.class_id && g.class_id && it.class_id === g.class_id)
      )
    )
  }, [enrollment, grades])

  // Main 2-column Grid:
  // Left Column (7 cols): Recent Results & Mini Calendar
  // Right Column (5 cols): Notice Board & Quick Access & Performance Donut
  const mainGrid = (
    <>
      {/* Left Column */}
      <div className="lg:col-span-7 space-y-6">
        <RecentResultsTable grades={activeSemesterGrades} />
        <MiniCalendar />
      </div>

      {/* Right Column */}
      <div className="lg:col-span-5 space-y-6">
        <NoticeBoard />

        {/* Quick Access Card Grid matching screenshot */}
        <div className="dashboard-card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
            Akses Cepat (Quick Access)
          </h3>
          <div className="grid grid-cols-3 gap-2.5">
            <QuickAccessCard
              icon={BookOpen}
              label="KRS (Mata Kuliah)"
              colorClass="bg-blue-50 text-[#133E87]"
              onClick={() => navigate('/krs')}
            />
            <QuickAccessCard
              icon={FileSpreadsheet}
              label="Input KRS"
              colorClass="bg-emerald-50 text-emerald-700"
              onClick={() => navigate('/krs/input')}
            />
            <QuickAccessCard
              icon={CalendarDays}
              label="Jadwal Kuliah"
              colorClass="bg-purple-50 text-purple-700"
              onClick={() => navigate('/schedule')}
            />
            <QuickAccessCard
              icon={CalendarCheck2}
              label="Presensi"
              colorClass="bg-amber-50 text-amber-700"
              onClick={() => navigate('/attendance')}
            />
            <QuickAccessCard
              icon={Download}
              label="Unduh KHS"
              colorClass="bg-sky-50 text-sky-700"
              onClick={() => navigate('/grades')}
            />
            <QuickAccessCard
              icon={MessageSquare}
              label="Bantuan BAAK"
              colorClass="bg-rose-50 text-rose-700"
              onClick={() => navigate('/notices')}
            />
          </div>
        </div>

        <PerformanceDonutChart />
      </div>
    </>
  )

  const bannerContent = (
    <div className="space-y-4">
      <StudentHeroBanner />

      {/* Active Attendance Session Alert Banner */}
      {activeSessions.length > 0 && (
        <div className="space-y-3">
          {activeSessions.map((ses) => {
            const myRecord = ses.records?.find(r => r.student_id === studentId)
            const hasRecorded = myRecord && myRecord.status === 'PRESENT'
            const isSubmitting = submittingSessionId === ses.id
            const expired = isSessionExpired(ses)

            return (
              <div
                key={ses.id}
                className="p-5 rounded-3xl bg-gradient-to-r from-[#133E87] via-[#0B2545] to-blue-900 text-white shadow-xl shadow-blue-950/15 border border-blue-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {expired ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/90 text-white shadow-xs">
                        <Clock className="w-3.5 h-3.5" />
                        Sesi Presensi Berakhir
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Presensi Dibuka Sekarang
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-400 text-slate-950">
                      Pertemuan #{ses.session_number}
                    </span>
                    <span className="text-xs text-blue-200">
                      Ruang {ses.room_code || 'D.2.A'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {ses.course_name} ({ses.class_code})
                  </h3>

                  <p className="text-xs text-blue-200 line-clamp-1">
                    Materi: <span className="text-white font-medium">{ses.topic}</span>
                  </p>

                  <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold pt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Batas Waktu Absensi: {ses.start_time} - {ses.end_time} WIB ({ses.date || 'Hari Ini'})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {hasRecorded ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sudah Hadir ({myRecord.timestamp || 'Tercatat'})</span>
                    </div>
                  ) : expired ? (
                    <button
                      type="button"
                      disabled={true}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold cursor-not-allowed"
                    >
                      <Clock className="w-4 h-4 text-rose-400" />
                      <span>Batas Absen Lewat</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleQuickPresence(ses.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSubmitting ? 'Mencatat...' : 'Klik Presensi Hadir Sekarang'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate('/attendance')}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                  >
                    <span>Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <DashboardTemplate
      banner={bannerContent}
      stats={statsRow}
      mainGrid={mainGrid}
    />
  )
}
