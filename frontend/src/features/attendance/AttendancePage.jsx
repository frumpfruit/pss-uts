import React, { useState, useEffect } from 'react'
import {
  CalendarCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  Check,
  X,
  FileCheck,
  BookOpen,
  MapPin,
  Sparkles,
  UserCheck,
  Calendar,
  Lock,
  Unlock,
  Send,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { attendanceApi, academicApi, DEFAULT_STUDENT_ID } from '../../services/apiService'
import { isSessionExpired } from '../../utils/attendance'
import { Button } from '../../components/atoms/Button'
import { Badge } from '../../components/atoms/Badge'
import { toast } from '../../utils/toast'

export function AttendancePage() {
  const { user, isStudent, isLecturer, isAdmin } = useAuth()
  const studentId = (user?.id && user.id !== 'usr-student-01') ? user.id : DEFAULT_STUDENT_ID

  // Summary and general states
  const [summary, setSummary] = useState({ percentage: 92.5, total_sessions: 24, present: 22, sick: 1, excused: 1, absent: 0 })
  const [coursesAttendance, setCoursesAttendance] = useState([])
  const [classes, setClasses] = useState([])

  // Sessions state (for both Student and Lecturer)
  const [sessions, setSessions] = useState([])
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Lecturer: Modal state to create new attendance session
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newSessionForm, setNewSessionForm] = useState({
    class_id: '',
    session_number: 9,
    topic: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '10:20',
    end_time: '12:50',
    status: 'OPEN'
  })

  // Load all initial data
  const loadData = async () => {
    setLoading(true)
    try {
      // 1. Load Sessions
      const allSessions = await attendanceApi.getSessions()
      const sessionList = Array.isArray(allSessions) ? allSessions : []
      setSessions(sessionList)
      if (sessionList.length > 0 && !selectedSessionId) {
        setSelectedSessionId(sessionList[0].id)
      }

      // 2. Load Classes
      const cls = await academicApi.getClasses()
      const classList = Array.isArray(cls) ? cls : []
      setClasses(classList)
      if (classList.length > 0 && !newSessionForm.class_id) {
        setNewSessionForm(prev => ({ ...prev, class_id: classList[0].id }))
      }

      // 3. Load Student summary if student
      if (isStudent) {
        const sum = await attendanceApi.getSummary(studentId)
        if (sum && sum.percentage !== undefined) setSummary(sum)
        const list = await attendanceApi.getCoursesAttendance(studentId)
        setCoursesAttendance(Array.isArray(list) ? list : [])

        if (sum && sum.percentage < 75.0) {
          toast.warning(
            'Peringatan Kehadiran Rendah (<75%)',
            'Persentase kehadiran Anda berada di bawah batas kelayakan ujian!'
          )
        }
      }
    } catch (err) {
      console.error('Error loading attendance data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId, isStudent, isLecturer, isAdmin])

  // Active session for lecturer / inspector
  const activeSession = sessions.find(s => s.id === selectedSessionId) || sessions[0]

  // Filter open sessions for student view
  const studentActiveSessions = sessions.filter(s => s.status === 'OPEN')

  // --- STUDENT ACTION: 1-Click Presence ---
  const handleStudentPresence = async (sessionId) => {
    const targetSes = sessions.find(s => s.id === sessionId)
    if (targetSes && isSessionExpired(targetSes)) {
      toast.error('Batas Waktu Presensi Berakhir', 'Sesi perkuliahan ini telah ditutup karena melewati batas waktu kehadiran.')
      return
    }

    setSubmitting(true)
    try {
      const res = await attendanceApi.submitAttendance(sessionId, studentId)
      toast.success(
        'Presensi Berhasil Dicatat!',
        `Kehadiran Anda berhasil diverifikasi pada pukul ${res?.record?.timestamp || 'sekarang'}.`
      )

      // Update state locally
      setSessions(prev =>
        prev.map(s => {
          if (s.id !== sessionId) return s
          const updatedRecords = s.records ? [...s.records] : []
          const existingIdx = updatedRecords.findIndex(r => r.student_id === studentId)
          const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          if (existingIdx >= 0) {
            updatedRecords[existingIdx] = {
              ...updatedRecords[existingIdx],
              status: 'PRESENT',
              timestamp: timeStr
            }
          } else {
            updatedRecords.push({
              id: `rec-${Date.now()}`,
              student_id: studentId,
              nim: user?.student_profile?.nim || 'A11.2023.14920',
              name: user?.full_name || 'Arya Pratama',
              status: 'PRESENT',
              timestamp: timeStr,
              notes: ''
            })
          }
          return { ...s, records: updatedRecords }
        })
      )

      // Increment student summary counts
      setSummary(prev => {
        const newPresent = (prev.present || 0) + 1
        const total = (prev.total_sessions || 24)
        const pct = Math.min(100, Number(((newPresent / total) * 100).toFixed(1)))
        return {
          ...prev,
          present: newPresent,
          percentage: pct
        }
      })
    } catch (err) {
      toast.error('Gagal Presensi', err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // --- LECTURER ACTION: Create New Attendance Session ---
  const handleCreateSessionSubmit = async (e) => {
    e.preventDefault()
    if (!newSessionForm.topic) {
      toast.warning('Topik Kosong', 'Harap isi topik atau materi pokok perkuliahan.')
      return
    }

    const selectedCls = classes.find(c => c.id === newSessionForm.class_id) || classes[0]

    try {
      const payload = {
        class_id: selectedCls?.id || 'cls-01',
        class_code: selectedCls?.class_code || 'A11.4401',
        course_code: selectedCls?.course_code || 'A11.54301',
        course_name: selectedCls?.course_name || 'Rekayasa Perangkat Lunak',
        lecturer_id: user?.id || 'usr-lecturer-01',
        lecturer_name: user?.full_name || 'Dr. Ir. Budi Santoso, M.Kom.',
        room_code: selectedCls?.room_code || 'D.2.A',
        session_number: Number(newSessionForm.session_number) || 1,
        topic: newSessionForm.topic,
        date: newSessionForm.date,
        start_time: newSessionForm.start_time,
        end_time: newSessionForm.end_time,
        status: newSessionForm.status
      }

      const created = await attendanceApi.createSession(payload)
      toast.success(
        'Sesi Presensi Berhasil Dibuat!',
        `Presensi pertemuan #${created.session_number} (${created.course_name}) telah dibuka untuk mahasiswa.`
      )

      setSessions(prev => [created, ...prev])
      setSelectedSessionId(created.id)
      setIsCreateModalOpen(false)
      setNewSessionForm({
        class_id: classes[0]?.id || '',
        session_number: (Number(newSessionForm.session_number) || 8) + 1,
        topic: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '10:20',
        end_time: '12:50',
        status: 'OPEN'
      })
    } catch (err) {
      toast.error('Gagal Membuat Sesi', err.message)
    }
  }

  // --- LECTURER ACTION: Toggle Session Close/Open ---
  const handleToggleCloseSession = async (sessionId) => {
    const s = sessions.find(item => item.id === sessionId)
    if (!s) return

    if (s.status === 'OPEN') {
      try {
        await attendanceApi.closeSession(sessionId)
        setSessions(prev =>
          prev.map(item => item.id === sessionId ? { ...item, status: 'CLOSED' } : item)
        )
        toast.info(
          'Sesi Presensi Ditutup',
          `Sesi pertemuan #${s.session_number} resmi ditutup. Mahasiswa tidak dapat lagi mencatat kehadiran.`
        )
      } catch (err) {
        toast.error('Gagal Menutup Sesi', err.message)
      }
    } else {
      // Reopen session
      setSessions(prev =>
        prev.map(item => item.id === sessionId ? { ...item, status: 'OPEN' } : item)
      )
      toast.success(
        'Sesi Presensi Dibuka Kembali',
        `Presensi pertemuan #${s.session_number} kini dibuka kembali untuk mahasiswa.`
      )
    }
  }

  // --- LECTURER ACTION: Change Individual Student Status ---
  const handleStudentStatusChange = async (studentToUpdateId, newStatus) => {
    if (!activeSession) return

    try {
      await attendanceApi.updateStudentRecord(activeSession.id, studentToUpdateId, newStatus)
      setSessions(prev =>
        prev.map(s => {
          if (s.id !== activeSession.id) return s
          const updatedRecords = (s.records || []).map(r => {
            if (r.student_id === studentToUpdateId) {
              const timeStr = newStatus === 'PRESENT' && !r.timestamp
                ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                : r.timestamp
              return { ...r, status: newStatus, timestamp: timeStr }
            }
            return r
          })
          return { ...s, records: updatedRecords }
        })
      )
    } catch (err) {
      toast.error('Gagal Mengubah Status', err.message)
    }
  }

  const handleSaveAttendance = () => {
    toast.success(
      'Data Presensi Tersimpan!',
      'Seluruh status kehadiran mahasiswa untuk sesi ini berhasil diperbarui di sistem.'
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-[#133E87]" />
            Presensi Perkuliahan Mahasiswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Batas minimum kelayakan mengikuti ujian akhir semester adalah 75.0%
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          {(isLecturer || isAdmin) && (
            <Button
              variant="gold"
              size="md"
              icon={Plus}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Buat Sesi Presensi Baru
            </Button>
          )}

          {isStudent && summary.percentage < 75.0 && (
            <Badge variant="danger" size="lg" dot>
              Peringatan: Presensi Di Bawah Batas Minimum
            </Badge>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: STUDENT VIEW - AUTOMATIC ACTIVE PRESENSI POPUP / HERO BANNER
          ========================================================================= */}
      {isStudent && (
        <div className="space-y-6">
          {/* Active Sessions Prompt */}
          {studentActiveSessions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Sesi Presensi Perkuliahan Berlangsung (Buka Sekarang)</span>
              </div>

              {studentActiveSessions.map((ses) => {
                const myRecord = ses.records?.find(r => r.student_id === studentId)
                const hasRecorded = myRecord && myRecord.status === 'PRESENT'
                const expired = isSessionExpired(ses)

                return (
                  <div
                    key={ses.id}
                    className="p-6 rounded-3xl bg-gradient-to-br from-blue-900 via-[#0B2545] to-[#133E87] text-white shadow-xl shadow-blue-950/15 border border-blue-800/60 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2.5">
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
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 shadow-xs">
                            Pertemuan #{ses.session_number}
                          </span>
                          <span className="text-xs text-blue-200 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {ses.room_code || 'Ruang Kuliah'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            {ses.course_name}
                          </h3>
                          <p className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">
                            Kode: <span className="font-mono text-amber-300 font-bold">{ses.class_code}</span> • Dosen: {ses.lecturer_name}
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-blue-100 flex items-start gap-2.5 max-w-2xl">
                          <BookOpen className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-white block">Materi Perkuliahan:</span>
                            <span className="text-blue-100">{ses.topic}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-blue-200 pt-1">
                          <Clock className="w-4 h-4 text-amber-300" />
                          <span>
                            Batas Waktu Absensi: <span className="font-bold text-white">{ses.start_time} - {ses.end_time} WIB</span> ({ses.date || 'Hari Ini'})
                          </span>
                        </div>
                      </div>

                      {/* Presence Action Button */}
                      <div className="shrink-0 flex flex-col items-start lg:items-end justify-center gap-2 bg-white/5 lg:bg-transparent p-4 lg:p-0 rounded-2xl border border-white/10 lg:border-none">
                        {hasRecorded ? (
                          <div className="flex flex-col items-start lg:items-end gap-1.5">
                            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 font-bold text-sm">
                              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                              <span>Presensi Anda Telah Tercatat: Hadir</span>
                            </div>
                            <span className="text-xs text-blue-200">
                              Waktu Masuk: <span className="font-bold text-white">{myRecord.timestamp || 'Tercatat'}</span>
                            </span>
                          </div>
                        ) : expired ? (
                          <div className="space-y-2 w-full sm:w-auto">
                            <button
                              type="button"
                              disabled={true}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold text-sm cursor-not-allowed"
                            >
                              <Clock className="w-5 h-5 text-rose-400" />
                              <span>Batas Waktu Presensi Telah Berakhir</span>
                            </button>
                            <p className="text-[11px] text-rose-200 text-center lg:text-right">
                              *Batas jam perkuliahan telah lewat. Hubungi dosen jika ada kendala.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 w-full sm:w-auto">
                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => handleStudentPresence(ses.id)}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                              <span>{submitting ? 'Mencatat Kehadiran...' : 'Klik Presensi Hadir Sekarang'}</span>
                            </button>
                            <p className="text-[11px] text-blue-200 text-center lg:text-right">
                              *Cukup sekali klik untuk konfirmasi kehadiran Anda
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#133E87] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Tidak Ada Sesi Presensi Aktif Saat Ini
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Sesi presensi akan otomatis muncul saat dosen pengampu membuka presensi pada jam mata kuliah Anda.
                  </p>
                </div>
              </div>
              <Badge variant="default" size="sm">
                Status Standby
              </Badge>
            </div>
          )}

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Persentase</span>
              <span className="text-2xl font-black text-[#133E87]">{summary.percentage}%</span>
            </div>
            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Total Sesi</span>
              <span className="text-2xl font-bold text-slate-800">{summary.total_sessions}</span>
            </div>
            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Hadir</span>
              <span className="text-2xl font-bold text-emerald-600">{summary.present}</span>
            </div>
            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Sakit</span>
              <span className="text-2xl font-bold text-amber-600">{summary.sick}</span>
            </div>
            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Izin</span>
              <span className="text-2xl font-bold text-blue-600">{summary.excused}</span>
            </div>
            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Alpa</span>
              <span className="text-2xl font-bold text-rose-600">{summary.absent}</span>
            </div>
          </div>

          {/* Courses Attendance Table */}
          <div className="dashboard-card p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Rekapitulasi Kehadiran per Mata Kuliah
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Rekap pertemuan 1 sampai dengan pertemuan berjalan semester genap
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Mata Kuliah & Kode</th>
                    <th className="py-3 px-3 text-center">Total Pertemuan</th>
                    <th className="py-3 px-3 text-center">Hadir</th>
                    <th className="py-3 px-3 text-center">Sakit</th>
                    <th className="py-3 px-3 text-center">Izin</th>
                    <th className="py-3 px-3 text-center">Alpa</th>
                    <th className="py-3 px-3 text-center">Persentase</th>
                    <th className="py-3 px-3 text-center">Status Kelayakan Ujian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {(Array.isArray(coursesAttendance) ? coursesAttendance : []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800 block">{item.course_name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{item.course_code} • Kelompok {item.class_code}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">{item.total_sessions}</td>
                      <td className="py-3 px-3 text-center text-emerald-600 font-semibold">{item.present}</td>
                      <td className="py-3 px-3 text-center text-amber-600 font-semibold">{item.sick}</td>
                      <td className="py-3 px-3 text-center text-blue-600 font-semibold">{item.excused}</td>
                      <td className="py-3 px-3 text-center text-rose-600 font-semibold">{item.absent}</td>
                      <td className="py-3 px-3 text-center font-black text-[#133E87]">{item.percentage}%</td>
                      <td className="py-3 px-3 text-center">
                        {item.percentage >= 75 ? (
                          <Badge variant="success" size="sm">Memenuhi Syarat (Layak Ujian)</Badge>
                        ) : (
                          <Badge variant="danger" size="sm">Di Bawah Batas Minimum</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: LECTURER & ADMIN VIEW - SESSION MANAGER & REALTIME MONITORING
          ========================================================================= */}
      {(isLecturer || isAdmin) && (
        <div className="space-y-6">
          {/* Active Sessions Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 shrink-0">
              Pilih Sesi:
            </span>
            {sessions.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSessionId(s.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  s.id === selectedSessionId
                    ? 'bg-[#133E87] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${s.status === 'OPEN' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
                <span>Pertemuan #{s.session_number}: {s.course_name} ({s.class_code})</span>
              </button>
            ))}
          </div>

          {activeSession ? (
            <div className="dashboard-card p-6">
              {/* Session Control Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge variant={activeSession.status === 'OPEN' ? 'success' : 'default'} size="sm" dot>
                      {activeSession.status === 'OPEN' ? 'Presensi Sedang Dibuka' : 'Presensi Telah Ditutup'}
                    </Badge>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Pertemuan #{activeSession.session_number}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {activeSession.date}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono font-bold text-[#133E87]">
                      <Clock className="w-3.5 h-3.5" />
                      {activeSession.start_time} - {activeSession.end_time} WIB
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {activeSession.course_name} ({activeSession.class_code})
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pokok Bahasan: <span className="font-semibold text-slate-800">{activeSession.topic}</span> • Ruang: {activeSession.room_code || 'D.2.A'}
                  </p>
                </div>

                {/* Session Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeSession.status === 'OPEN' ? 'danger' : 'outline'}
                    size="sm"
                    icon={activeSession.status === 'OPEN' ? Lock : Unlock}
                    onClick={() => handleToggleCloseSession(activeSession.id)}
                  >
                    {activeSession.status === 'OPEN' ? 'Tutup Sesi Presensi' : 'Buka Kembali Sesi'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Check}
                    onClick={handleSaveAttendance}
                  >
                    Simpan Presensi
                  </Button>
                </div>
              </div>

              {/* Attendance Statistics for this Session */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 block">Total Mahasiswa</span>
                  <span className="text-xl font-bold text-slate-800">{activeSession.records?.length || 0}</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <span className="text-[11px] font-semibold text-emerald-700 block">Sudah Hadir</span>
                  <span className="text-xl font-bold text-emerald-700">
                    {(activeSession.records || []).filter(r => r.status === 'PRESENT').length}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                  <span className="text-[11px] font-semibold text-amber-700 block">Sakit / Izin</span>
                  <span className="text-xl font-bold text-amber-700">
                    {(activeSession.records || []).filter(r => r.status === 'SICK' || r.status === 'EXCUSED').length}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                  <span className="text-[11px] font-semibold text-rose-700 block">Belum Presensi / Alpa</span>
                  <span className="text-xl font-bold text-rose-700">
                    {(activeSession.records || []).filter(r => r.status === 'NOT_RECORDED' || r.status === 'ABSENT').length}
                  </span>
                </div>
              </div>

              {/* Checklist Table of Students */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Mahasiswa</th>
                      <th className="py-3 px-3 text-center">Status Kehadiran</th>
                      <th className="py-3 px-3 text-center">Waktu Presensi</th>
                      <th className="py-3 px-3">Keterangan / Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs">
                    {(activeSession.records || []).map(std => (
                      <tr key={std.student_id || std.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800 block">{std.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{std.nim}</span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1">
                            {[
                              { code: 'PRESENT', label: 'Hadir', activeCls: 'bg-emerald-600 text-white' },
                              { code: 'SICK', label: 'Sakit', activeCls: 'bg-amber-500 text-white' },
                              { code: 'EXCUSED', label: 'Izin', activeCls: 'bg-blue-600 text-white' },
                              { code: 'ABSENT', label: 'Alpa', activeCls: 'bg-rose-600 text-white' },
                            ].map(st => {
                              const isSelected = std.status === st.code
                              return (
                                <button
                                  key={st.code}
                                  type="button"
                                  onClick={() => handleStudentStatusChange(std.student_id, st.code)}
                                  className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                    isSelected
                                      ? `${st.activeCls} shadow-xs`
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {st.label}
                                </button>
                              )
                            })}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center font-mono text-[11px]">
                          {std.timestamp ? (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              {std.timestamp}
                            </span>
                          ) : (
                            <span className="text-slate-400">Belum Mengisi</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-slate-500">
                          <input
                            type="text"
                            defaultValue={std.notes}
                            placeholder="Catatan..."
                            className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#133E87]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="dashboard-card p-12 text-center text-slate-400">
              <CalendarCheck2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Belum ada sesi presensi yang dibuat</p>
              <p className="text-xs text-slate-400 mt-1">
                Klik tombol "Buat Sesi Presensi Baru" untuk membuka sesi absensi bagi mahasiswa Anda.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL: DOSEN MEMBUAT SESI PRESENSI BARU DENGAN TANGGAL & JAM TUTUP
          ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#133E87] flex items-center justify-center">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Buka Sesi Presensi Baru</h3>
                  <p className="text-xs text-slate-400">Atur jadwal mulai dan batas akhir absensi mahasiswa</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSessionSubmit} className="space-y-4 text-xs">
              {/* Kelas Mata Kuliah */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Kelas Perkuliahan
                </label>
                <select
                  value={newSessionForm.class_id}
                  onChange={(e) => setNewSessionForm(prev => ({ ...prev, class_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#133E87]/20"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.course_name} ({c.class_code}) - {c.schedule_day}, {c.time_slot} WIB
                    </option>
                  ))}
                </select>
              </div>

              {/* Pertemuan ke- */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Pertemuan Ke-
                  </label>
                  <select
                    value={newSessionForm.session_number}
                    onChange={(e) => setNewSessionForm(prev => ({ ...prev, session_number: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#133E87]/20"
                  >
                    {[...Array(14)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Pertemuan #{i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tanggal Perkuliahan
                  </label>
                  <input
                    type="date"
                    required
                    value={newSessionForm.date}
                    onChange={(e) => setNewSessionForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#133E87]/20"
                  />
                </div>
              </div>

              {/* Jam Buka dan Jam Tutup Presensi */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div>
                  <label className="font-bold text-[#133E87] block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Waktu Mulai Presensi
                  </label>
                  <input
                    type="time"
                    required
                    value={newSessionForm.start_time}
                    onChange={(e) => setNewSessionForm(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#133E87]/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-rose-700 block mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Waktu Tutup Presensi (Batas)
                  </label>
                  <input
                    type="time"
                    required
                    value={newSessionForm.end_time}
                    onChange={(e) => setNewSessionForm(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              {/* Pokok Bahasan */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pokok Bahasan / Topik Perkuliahan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Pembahasan Arsitektur Microservices..."
                  value={newSessionForm.topic}
                  onChange={(e) => setNewSessionForm(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#133E87]/20"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  icon={Send}
                >
                  Buka Sesi Presensi Sekarang
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
