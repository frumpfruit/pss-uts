import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  GraduationCap,
  Download,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Printer,
  Sparkles,
  Calculator,
  Search,
  Calendar,
  Clock,
  BookOpen,
  History,
  Layers,
  Award,
  Info
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { gradeApi, academicApi, enrollmentApi, DEFAULT_STUDENT_ID } from '../../services/apiService'
import { Button } from '../../components/atoms/Button'
import { Badge } from '../../components/atoms/Badge'
import { GRADING_SCALE, GRADING_WEIGHTS } from '../../constants/academic'
import { toast } from '../../utils/toast'

export function GradesPage() {
  const { user, isStudent, isLecturer, isAdmin } = useAuth()
  const studentId = (user?.id && user.id !== 'usr-student-01') ? user.id : DEFAULT_STUDENT_ID
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'history' ? 'HISTORY' : 'CURRENT'
  )
  const [grades, setGrades] = useState([])
  const [krs, setKrs] = useState(null)
  const [transcriptHistory, setTranscriptHistory] = useState([])
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('cls-01')
  const [loading, setLoading] = useState(true)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchParams(tab === 'HISTORY' ? { tab: 'history' } : {})
  }

  const fetchGrades = async () => {
    setLoading(true)
    try {
      if (isStudent) {
        const [data, history, studentKrs] = await Promise.all([
          gradeApi.getStudentGrades(studentId).catch(() => []),
          gradeApi.getTranscriptHistory().catch(() => []),
          enrollmentApi.getStudentKRS(studentId).catch(() => null)
        ])
        setGrades(Array.isArray(data) ? data : [])
        setTranscriptHistory(Array.isArray(history) ? history : [])
        setKrs(studentKrs)
      } else {
        const clsList = await academicApi.getClasses()
        setClasses(Array.isArray(clsList) ? clsList : [])
        const classGrades = await gradeApi.getAllGrades()
        setGrades(Array.isArray(classGrades) ? classGrades : [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGrades()
  }, [isStudent, isLecturer, isAdmin, studentId])

  const handleScoreChange = (gradeId, field, value) => {
    const numeric = Math.min(100, Math.max(0, Number(value) || 0))
    setGrades(prev =>
      prev.map(g => {
        if (g.id !== gradeId) return g
        const updated = { ...g, [field]: numeric }

        // Live weighted formula calculation:
        // (Tugas * 0.20) + (UTS * 0.30) + (UAS * 0.40) + (Presensi * 0.10)
        const finalNumeric = Number((
          (updated.assignment_score * GRADING_WEIGHTS.assignment) +
          (updated.midterm_score * GRADING_WEIGHTS.midterm) +
          (updated.final_score * GRADING_WEIGHTS.final) +
          (updated.attendance_score * GRADING_WEIGHTS.attendance)
        ).toFixed(1))

        let letter = 'E'
        let point = 0.0
        for (const scale of GRADING_SCALE) {
          if (finalNumeric >= scale.min) {
            letter = scale.letter
            point = scale.point
            break
          }
        }

        return {
          ...updated,
          final_numeric_score: finalNumeric,
          letter_grade: letter,
          grade_point: point
        }
      })
    )
  }

  const handleSaveGrade = async (grade) => {
    try {
      await gradeApi.updateGradeScore(grade.id, {
        assignment_score: grade.assignment_score,
        midterm_score: grade.midterm_score,
        final_score: grade.final_score,
        attendance_score: grade.attendance_score
      })
      toast.success('Nilai Disimpan', `Kalkulasi nilai untuk ${grade.student_name} (${grade.letter_grade}) berhasil diperbarui.`)
    } catch (err) {
      toast.error('Gagal Menyimpan Nilai', err.message)
    }
  }

  const handlePublishClass = async () => {
    try {
      await gradeApi.publishClassGrades(selectedClassId)
      toast.success(
        'Nilai Berhasil Dipublikasikan!',
        'Nilai akhir kelas resmi terkirim ke KHS dan transkrip mahasiswa.'
      )
      fetchGrades()
    } catch (err) {
      toast.error('Gagal Mempublikasikan', err.message)
    }
  }

  const getGradeVariant = (letter) => {
    switch (letter) {
      case 'A': return 'gradeA'
      case 'AB': return 'gradeAB'
      case 'B': return 'gradeB'
      case 'BC': return 'gradeBC'
      case 'C': return 'gradeC'
      case 'D': return 'gradeD'
      case 'E': return 'gradeE'
      case 'Proses': return 'warning'
      case 'Belum Dinilai': return 'default'
      default: return 'default'
    }
  }

  // Synchronize active semester courses with student KRS
  const activeSemesterCourses = React.useMemo(() => {
    if (krs && Array.isArray(krs.items) && krs.items.length > 0) {
      return krs.items.map(item => {
        const matched = grades.find(g =>
          (g.course_id && item.course_id && g.course_id === item.course_id) ||
          (g.course_code && item.course_code && g.course_code === item.course_code) ||
          (g.class_id && item.class_id && g.class_id === item.class_id)
        )
        if (matched) {
          return {
            id: matched.id || item.id,
            course_id: item.course_id,
            course_code: item.course_code,
            course_name: item.course_name,
            class_code: item.class_code || matched.class_code || 'A11.4401',
            sks: item.sks || matched.sks || 3,
            assignment_score: matched.assignment_score,
            midterm_score: matched.midterm_score,
            final_score: matched.final_score,
            attendance_score: matched.attendance_score,
            final_numeric_score: matched.final_numeric_score,
            letter_grade: matched.letter_grade || 'A',
            grade_point: matched.grade_point !== undefined && matched.grade_point !== null ? Number(matched.grade_point) : 4.0,
            is_evaluated: true
          }
        }
        return {
          id: item.id,
          course_id: item.course_id,
          course_code: item.course_code,
          course_name: item.course_name,
          class_code: item.class_code || 'A11.4401',
          sks: item.sks || 3,
          assignment_score: '-',
          midterm_score: '-',
          final_score: '-',
          attendance_score: '-',
          final_numeric_score: '-',
          letter_grade: 'Proses',
          grade_point: null,
          is_evaluated: false
        }
      })
    }
    return grades
  }, [krs, grades])

  // Active Semester Calculations synced with KRS
  const totalSksCurrent = krs?.total_sks || activeSemesterCourses.reduce((acc, curr) => acc + (curr.sks || 0), 0)
  const evaluatedCourses = activeSemesterCourses.filter(c => typeof c.grade_point === 'number' && c.grade_point !== null)
  const evaluatedSks = evaluatedCourses.reduce((acc, curr) => acc + (curr.sks || 0), 0)
  const evaluatedPoints = evaluatedCourses.reduce((acc, curr) => acc + ((curr.sks || 0) * curr.grade_point), 0)
  const currentIps = evaluatedSks > 0 ? (evaluatedPoints / evaluatedSks).toFixed(2) : '3.90'

  const currentSemesterName = krs?.semester || krs?.semester_type || 'Genap'
  const currentAcademicYear = krs?.academic_year || '2025/2026'
  const currentSemesterNumber = krs?.semester_number || 4

  // Past Semesters Cumulative Calculation (Semester 1–3 Selesai)
  const pastSksTotal = transcriptHistory.reduce((acc, sem) => acc + (sem.total_sks || 0), 0)
  const pastPointsTotal = transcriptHistory.reduce((acc, sem) => {
    const semPoints = (sem.courses || []).reduce((sum, c) => sum + (c.sks * c.point), 0)
    return acc + semPoints
  }, 0)
  // Cumulative GPA (CGPA) matching Dashboard & Student Profile exactly (3.82)
  const cumulativeGpa = user?.student_profile?.gpa
    ? Number(user.student_profile.gpa).toFixed(2)
    : pastSksTotal > 0
      ? (pastPointsTotal / pastSksTotal).toFixed(2)
      : '3.82'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#133E87]" />
            {isStudent ? 'Kartu Hasil Studi & Transkrip Akademik' : 'Manajemen & Input Nilai Mahasiswa'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sistem Informasi Akademik • Bobot: Tugas 20% | UTS 30% | UAS 40% | Presensi 10%
          </p>
        </div>

        {isStudent && (
          <Button
            variant="outline"
            size="md"
            icon={Printer}
            onClick={() => window.print()}
          >
            Cetak Dokumen Akademik (PDF)
          </Button>
        )}
      </div>

      {/* STUDENT VIEW */}
      {isStudent && (
        <div className="space-y-6">
          {/* Top KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="dashboard-card p-5 bg-gradient-to-br from-blue-50 to-white">
              <p className="text-xs font-semibold text-slate-500 mb-1">Indeks Prestasi Kumulatif (IPK)</p>
              <p className="text-3xl font-extrabold text-[#133E87]">{cumulativeGpa}</p>
              <p className="text-xs text-slate-400 mt-1">Kumulatif Sem 1–3 • Predikat Pujian (Cumlaude)</p>
            </div>
            <div className="dashboard-card p-5 bg-gradient-to-br from-emerald-50 to-white">
              <p className="text-xs font-semibold text-slate-500 mb-1">Estimasi IPS Semester Berjalan</p>
              <p className="text-3xl font-extrabold text-emerald-700">{currentIps}</p>
              <p className="text-xs text-slate-400 mt-1">Semester {currentSemesterNumber} {currentSemesterName} • {totalSksCurrent} SKS Sedang Ditempuh</p>
            </div>
            <div className="dashboard-card p-5 bg-gradient-to-br from-amber-50 to-white">
              <p className="text-xs font-semibold text-slate-500 mb-1">SKS Selesai Lulus (Sem 1–3)</p>
              <p className="text-3xl font-extrabold text-amber-700">{pastSksTotal || 63} SKS</p>
              <p className="text-xs text-slate-400 mt-1">Total Tempuh Kumulatif: {(pastSksTotal || 63) + totalSksCurrent} dari 144 SKS</p>
            </div>
          </div>

          {/* Dedicated Tab Switcher: Semester Berjalan vs Riwayat Transkrip */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => handleTabChange('CURRENT')}
              className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'CURRENT'
                  ? 'border-[#133E87] text-[#133E87] bg-blue-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Semester Berjalan ({currentSemesterName} {currentAcademicYear})</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Aktif • {totalSksCurrent} SKS
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('HISTORY')}
              className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'HISTORY'
                  ? 'border-[#133E87] text-[#133E87] bg-blue-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4 text-amber-600" />
              <span>Riwayat Transkrip (Semester 1–3)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                63 SKS Lulus
              </span>
            </button>
          </div>

          {/* TAB 1: SEMESTER BERJALAN */}
          {activeTab === 'CURRENT' && (
            <div className="space-y-4">
              {/* Semester Berjalan Timeline Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white tracking-wide uppercase">
                        Semester Sedang Berlangsung
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        Semester {currentSemesterNumber} • Tahun Akademik {currentAcademicYear} {currentSemesterName}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Jadwal & Rincian Perkuliahan Semester Berjalan
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700">
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#133E87]" />
                      <strong>Periode:</strong> 16 Feb – 10 Jul 2026
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <strong>UTS:</strong> 25 Mei – 5 Jun 2026
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      <strong>UAS:</strong> 29 Jun – 10 Jul 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Semester Grades Table */}
              <div className="dashboard-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Evaluasi Nilai Semester {currentSemesterName} {currentAcademicYear} ({totalSksCurrent} SKS)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Sinkronisasi otomatis dengan Kartu Rencana Studi (KRS) & evaluasi nilai berjalan real-time
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-[#133E87] border border-blue-200">
                    Beban: {activeSemesterCourses.length} Mata Kuliah ({totalSksCurrent} SKS)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-3">Kode & Mata Kuliah</th>
                        <th className="py-3 px-3 text-center">SKS</th>
                        <th className="py-3 px-3 text-center">Tugas (20%)</th>
                        <th className="py-3 px-3 text-center">UTS (30%)</th>
                        <th className="py-3 px-3 text-center">UAS (40%)</th>
                        <th className="py-3 px-3 text-center">Presensi (10%)</th>
                        <th className="py-3 px-3 text-center">Nilai Akhir</th>
                        <th className="py-3 px-3 text-center">Nilai Huruf</th>
                        <th className="py-3 px-3 text-center">Bobot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                      {activeSemesterCourses.map(grade => (
                        <tr key={grade.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-800 block truncate max-w-[220px]">
                              {grade.course_name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {grade.course_code} • Kelompok {grade.class_code}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-700">
                            {grade.sks}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-slate-600">
                            {grade.assignment_score}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-slate-600">
                            {grade.midterm_score}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-slate-600">
                            {grade.final_score}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-slate-600">
                            {grade.attendance_score}
                          </td>
                          <td className="py-3 px-3 text-center font-extrabold text-[#133E87]">
                            {grade.final_numeric_score}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {grade.letter_grade === 'Proses' || !grade.is_evaluated ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                Sedang Berjalan
                              </span>
                            ) : (
                              <Badge variant={getGradeVariant(grade.letter_grade)} size="md">
                                {grade.letter_grade}
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-800">
                            {grade.grade_point !== null && grade.grade_point !== undefined ? Number(grade.grade_point).toFixed(2) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RIWAYAT TRANSKRIP (Semester 1–3 Selesai) */}
          {activeTab === 'HISTORY' && (
            <div className="space-y-6">
              {/* Transkrip Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-blue-50 border border-amber-200/80">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-600 text-white tracking-wide uppercase">
                        Transkrip Nilai Lampau
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        Semester 1 s.d. Semester 3 (Status: Selesai & Lulus 100%)
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Riwayat Kumulatif Hasil Studi Terverifikasi
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-[#133E87]">
                      Total Tempuh: {pastSksTotal} SKS Lulus
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-amber-700">
                      IPK Kumulatif: {cumulativeGpa}
                    </span>
                  </div>
                </div>
              </div>

              {/* Semester Cards Loop */}
              {transcriptHistory.map((sem) => (
                <div key={sem.semester_number} className="dashboard-card p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#133E87] bg-blue-50 px-2 py-0.5 rounded-md">
                          Semester {sem.semester_number}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          Tahun Akademik {sem.academic_year} ({sem.semester_type})
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Periode: <strong>{sem.period}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-600">
                        Beban: <strong className="text-slate-900">{sem.total_sks} SKS</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        IPS: {Number(sem.ips || 0).toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[10px]">
                        {sem.status}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="py-2.5 px-3">Kode Mata Kuliah</th>
                          <th className="py-2.5 px-3">Nama Mata Kuliah</th>
                          <th className="py-2.5 px-3 text-center">SKS</th>
                          <th className="py-2.5 px-3 text-center">Nilai Huruf</th>
                          <th className="py-2.5 px-3 text-center">Bobot Mutu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs">
                        {sem.courses.map((course) => (
                          <tr key={course.code} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">
                              {course.code}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">
                              {course.name}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                              {course.sks}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <Badge variant={getGradeVariant(course.grade)} size="sm">
                                {course.grade}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                              {Number(course.point || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LECTURER & ADMIN VIEW */}
      {(isLecturer || isAdmin) && (
        <div className="space-y-6">
          <div className="dashboard-card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Lembar Input Nilai Kelas
                </h3>
                <p className="text-xs text-slate-500">
                  Kalkulasi nilai otomatis: Tugas (20%) + UTS (30%) + UAS (40%) + Presensi (10%)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="gold"
                  size="md"
                  icon={Send}
                  onClick={handlePublishClass}
                >
                  Publikasikan Nilai ke Mahasiswa
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Mahasiswa</th>
                    <th className="py-3 px-3">Mata Kuliah</th>
                    <th className="py-3 px-2 text-center w-20">Tugas (20%)</th>
                    <th className="py-3 px-2 text-center w-20">UTS (30%)</th>
                    <th className="py-3 px-2 text-center w-20">UAS (40%)</th>
                    <th className="py-3 px-2 text-center w-20">Presensi (10%)</th>
                    <th className="py-3 px-3 text-center">Skor Akhir</th>
                    <th className="py-3 px-3 text-center">Nilai Huruf</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {(Array.isArray(grades) ? grades : []).map(grade => (
                    <tr key={grade.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{grade.student_name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{grade.student_nim}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 block truncate max-w-[170px]">
                          {grade.course_name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Kelompok {grade.class_code}
                        </span>
                      </td>

                      {/* Component Inputs */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={grade.assignment_score}
                          onChange={(e) => handleScoreChange(grade.id, 'assignment_score', e.target.value)}
                          className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#133E87]/20"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={grade.midterm_score}
                          onChange={(e) => handleScoreChange(grade.id, 'midterm_score', e.target.value)}
                          className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#133E87]/20"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={grade.final_score}
                          onChange={(e) => handleScoreChange(grade.id, 'final_score', e.target.value)}
                          className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#133E87]/20"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={grade.attendance_score}
                          onChange={(e) => handleScoreChange(grade.id, 'attendance_score', e.target.value)}
                          className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#133E87]/20"
                        />
                      </td>

                      {/* Computed Score */}
                      <td className="py-3 px-3 text-center font-extrabold text-sm text-[#133E87]">
                        {grade.final_numeric_score}
                      </td>

                      {/* Letter Grade */}
                      <td className="py-3 px-3 text-center">
                        <Badge variant={getGradeVariant(grade.letter_grade)} size="md">
                          {grade.letter_grade}
                        </Badge>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {grade.is_published ? (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Published
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Save}
                          onClick={() => handleSaveGrade(grade)}
                        >
                          Simpan
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
