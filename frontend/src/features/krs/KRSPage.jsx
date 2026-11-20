import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FileSpreadsheet,
  BookOpen,
  CalendarDays,
  Sparkles,
  ClipboardList
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { enrollmentApi, academicApi, attendanceApi, DEFAULT_STUDENT_ID } from '../../services/apiService'
import { toast } from '../../utils/toast'
import { KRSOrdinaryView } from './KRSOrdinaryView'
import { KRSInputView } from './KRSInputView'

export function KRSPage({ defaultTab }) {
  const { user, isStudent, isAdmin, isLecturer } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const studentId = (user?.id && user.id !== 'usr-student-01') ? user.id : DEFAULT_STUDENT_ID

  // Determine initial active tab from prop, pathname, or searchParam
  const getInitialTab = () => {
    if (defaultTab) return defaultTab
    if (location.pathname === '/krs/input') return 'INPUT'
    if (searchParams.get('tab') === 'input') return 'INPUT'
    return 'ORDINARY'
  }

  const [activeTab, setActiveTab] = useState(getInitialTab())
  const [krs, setKrs] = useState(null)
  const [availableClasses, setAvailableClasses] = useState([])
  const [allEnrollments, setAllEnrollments] = useState([])
  const [coursesAttendance, setCoursesAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  // Sync tab if URL changes
  useEffect(() => {
    if (location.pathname === '/krs/input' || searchParams.get('tab') === 'input') {
      setActiveTab('INPUT')
    } else {
      setActiveTab('ORDINARY')
    }
  }, [location.pathname, searchParams])

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    if (tab === 'INPUT') {
      navigate('/krs/input')
    } else {
      navigate('/krs')
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // 1. Load Student KRS (Current Semester)
      const studentKrs = await enrollmentApi.getStudentKRS(studentId)
      setKrs(studentKrs)

      // 2. Load Available Classes for Input KRS
      const classes = await academicApi.getClasses()
      setAvailableClasses(Array.isArray(classes) ? classes : [])

      // 3. Load Student Attendance Summary per Course
      const attCourses = await attendanceApi.getCoursesAttendance(studentId)
      setCoursesAttendance(Array.isArray(attCourses) ? attCourses : [])

      // 4. Load All Enrollments for Admin / Lecturer
      if (isAdmin || isLecturer) {
        const allEnr = await enrollmentApi.getAllEnrollments()
        setAllEnrollments(Array.isArray(allEnr) ? allEnr : [])
      }
    } catch (err) {
      toast.error('Gagal Memuat Data KRS', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [isAdmin, isLecturer, studentId])

  const handleAddClass = async (classItem) => {
    try {
      const updated = await enrollmentApi.addCourse(studentId, classItem)
      setKrs({ ...updated })
      toast.success(
        'Mata Kuliah Ditambahkan',
        `${classItem.course_name} (${classItem.sks} SKS) berhasil masuk ke rencana studi.`
      )
    } catch (err) {
      toast.error('Tidak Dapat Menambahkan', err.message)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      const updated = await enrollmentApi.removeCourse(studentId, itemId)
      setKrs({ ...updated })
      toast.info('Mata Kuliah Dihapus', 'Mata kuliah telah dikeluarkan dari rencana studi Anda.')
    } catch (err) {
      toast.error('Gagal Menghapus', err.message)
    }
  }

  const handleSubmitKRS = async () => {
    try {
      const updated = await enrollmentApi.submitKRS(studentId)
      setKrs({ ...updated })
      toast.success(
        'KRS Berhasil Diajukan!',
        'Rencana studi telah dikirim ke Dosen Wali & Admin BAAK untuk verifikasi.'
      )
    } catch (err) {
      toast.error('Pengajuan KRS Gagal', err.message)
    }
  }

  const handleApproveKRS = async (enrollmentId) => {
    try {
      await enrollmentApi.approveKRS(enrollmentId, user?.full_name || 'Admin BAAK', 'KRS disetujui sesuai kurikulum.')
      toast.success('KRS Disetujui!', 'Rencana studi mahasiswa telah berhasil disetujui.')
      loadData()
    } catch (err) {
      toast.error('Gagal Menyetujui KRS', err.message)
    }
  }

  const handleRejectKRS = async (enrollmentId) => {
    const reason = prompt('Masukkan alasan evaluasi/penolakan KRS:', 'Terdapat jadwal yang bentrok atau syarat prasyarat belum terpenuhi.')
    if (reason) {
      try {
        await enrollmentApi.rejectKRS(enrollmentId, user?.full_name || 'Admin BAAK', reason)
        toast.warning('KRS Memerlukan Perbaikan', `Pengajuan dikembalikan dengan catatan: ${reason}`)
        loadData()
      } catch (err) {
        toast.error('Gagal Menolak KRS', err.message)
      }
    }
  }

  const handleRequestRevision = async (reason) => {
    const enrId = krs?.id
    if (!enrId) return
    try {
      const updated = await enrollmentApi.requestRevision(enrId, reason)
      setKrs({ ...updated })
      toast.success(
        'Permohonan Terkirim!',
        'Permohonan izin ubah/tambah KRS berhasil dikirim ke Dosen Wali & BAAK.'
      )
      loadData()
    } catch (err) {
      toast.error('Gagal Mengajukan Izin', err.message)
    }
  }

  const handleUnlockKRS = async (enrollmentId) => {
    try {
      const approverName = user?.full_name || 'Dr. Ir. Budi Santoso, M.Kom. (Dosen Wali)'
      const note = `Izin perubahan KRS diberikan oleh ${approverName}. Silakan sesuaikan pilihan mata kuliah lalu ajukan kembali.`
      await enrollmentApi.unlockKRS(enrollmentId, approverName, note)
      toast.success(
        'Kunci KRS Berhasil Dibuka!',
        'Mahasiswa kini diberikan izin untuk mengubah atau menambah mata kuliah.'
      )
      loadData()
    } catch (err) {
      toast.error('Gagal Membuka Kunci KRS', err.message)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#133E87] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Memuat data Kartu Rencana Studi...</p>
        <p className="text-xs text-slate-400">Sinkronisasi data langsung dengan PostgreSQL...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#133E87]" />
            Kartu Rencana Studi (KRS) & Mata Kuliah
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Universitas Dian Nuswantoro • Sistem Informasi Akademik
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs self-start md:self-auto">
          <button
            type="button"
            onClick={() => handleTabSwitch('ORDINARY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ORDINARY'
                ? 'bg-[#133E87] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>KRS (Mata Kuliah)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('INPUT')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'INPUT'
                ? 'bg-[#133E87] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Input KRS Online</span>
          </button>
        </div>
      </div>

      {/* View Switching */}
      {activeTab === 'ORDINARY' ? (
        <KRSOrdinaryView
          krs={krs}
          coursesAttendance={coursesAttendance}
          onSwitchToInput={() => handleTabSwitch('INPUT')}
        />
      ) : (
        <KRSInputView
          krs={krs}
          availableClasses={availableClasses}
          allEnrollments={allEnrollments}
          isAdmin={isAdmin}
          isLecturer={isLecturer}
          isStudent={isStudent}
          onAddClass={handleAddClass}
          onRemoveItem={handleRemoveItem}
          onSubmitKRS={handleSubmitKRS}
          onApproveKRS={handleApproveKRS}
          onRejectKRS={handleRejectKRS}
          onRequestRevision={handleRequestRevision}
          onUnlockKRS={handleUnlockKRS}
          onSwitchToOrdinary={() => handleTabSwitch('ORDINARY')}
        />
      )}
    </div>
  )
}
