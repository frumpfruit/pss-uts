import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_CLASSES,
  INITIAL_ENROLLMENTS,
  INITIAL_GRADES,
  INITIAL_ATTENDANCE_SUMMARY,
  INITIAL_ATTENDANCE_COURSES,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FACULTIES,
  INITIAL_STUDY_PROGRAMS,
  INITIAL_TRANSCRIPT_HISTORY
} from '../constants/mockData'

const STORAGE_KEYS = {
  USERS: 'siakad_users',
  ENROLLMENTS: 'siakad_enrollments',
  GRADES: 'siakad_grades',
  NOTIFICATIONS: 'siakad_notifications',
  SESSIONS: 'siakad_attendance_sessions',
  CURRENT_USER: 'siakad_current_user',
  TOKEN: 'siakad_token',
}

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage write error', e)
  }
}

class MockCampusServer {
  constructor() {
    this.users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS)
    this.enrollments = getStored(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS)
    this.grades = getStored(STORAGE_KEYS.GRADES, INITIAL_GRADES)
    this.notifications = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
    this.sessions = getStored(STORAGE_KEYS.SESSIONS, INITIAL_ATTENDANCE_SESSIONS)
    this.courses = INITIAL_COURSES
    this.classes = INITIAL_CLASSES
    this.faculties = INITIAL_FACULTIES
    this.studyPrograms = INITIAL_STUDY_PROGRAMS
  }

  saveState() {
    setStored(STORAGE_KEYS.USERS, this.users)
    setStored(STORAGE_KEYS.ENROLLMENTS, this.enrollments)
    setStored(STORAGE_KEYS.GRADES, this.grades)
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications)
    setStored(STORAGE_KEYS.SESSIONS, this.sessions)
  }

  // --- AUTH ---
  login(usernameOrEmail, password) {
    const user = this.users.find(
      u => (u.email === usernameOrEmail || u.username === usernameOrEmail)
    )
    if (!user) {
      throw new Error('Akun tidak ditemukan. Periksa email/NIM dan kata sandi Anda.')
    }
    // Simple password check for demo purposes
    if (password !== 'password123' && password !== 'admin123') {
      throw new Error('Kata sandi yang Anda masukkan salah (coba: password123).')
    }

    const token = `fake-jwt-token-${user.role}-${Date.now()}`
    setStored(STORAGE_KEYS.CURRENT_USER, user)
    setStored(STORAGE_KEYS.TOKEN, token)

    return {
      success: true,
      data: {
        token,
        user,
      },
      message: 'Login berhasil. Selamat datang di SIAKAD UDINUS.'
    }
  }

  getCurrentUser() {
    return getStored(STORAGE_KEYS.CURRENT_USER, this.users[0])
  }

  switchRole(role) {
    const targetUser = this.users.find(u => u.role === role) || this.users[0]
    setStored(STORAGE_KEYS.CURRENT_USER, targetUser)
    return targetUser
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    return { success: true }
  }

  // --- ACADEMIC & COURSES ---
  getCourses() {
    return this.courses
  }

  getClasses() {
    return this.classes
  }

  getSchedules() {
    return this.classes.map(c => ({
      id: `sch-${c.id}`,
      class_id: c.id,
      course_code: c.course_code,
      course_name: c.course_name,
      class_code: c.class_code,
      lecturer_name: c.lecturer_name,
      day: c.schedule_day,
      start_time: c.start_time,
      end_time: c.end_time,
      time_slot: c.time_slot,
      room_code: c.room_code,
      building: c.building,
      sks: c.sks
    }))
  }

  // --- KRS / ENROLLMENT WORKFLOW ---
  getStudentKRS(studentId = 'usr-student-01') {
    let krs = this.enrollments.find(e => e.student_id === studentId)
    if (!krs) {
      krs = {
        id: `enr-${Date.now()}`,
        student_id: studentId,
        student_nim: 'A11.2023.14920',
        student_name: 'Arya Pratama',
        academic_year: '2025/2026',
        semester: 'GENAP',
        status: 'DRAFT',
        total_sks: 0,
        max_sks: 24,
        approved_by: null,
        approval_note: null,
        items: []
      }
      this.enrollments.unshift(krs)
      this.saveState()
    }
    return krs
  }

  getAllEnrollments() {
    return this.enrollments
  }

  addCourseToKRS(studentId, classItem) {
    const krs = this.getStudentKRS(studentId)
    if (krs.status !== 'DRAFT' && krs.status !== 'REJECTED') {
      throw new Error('KRS sedang diverifikasi atau sudah disetujui, tidak dapat diubah.')
    }

    // Check duplicate course
    const exists = krs.items.some(i => i.course_id === classItem.course_id)
    if (exists) {
      throw new Error(`Mata kuliah ${classItem.course_name} sudah diambil di KRS.`)
    }

    // Check max SKS
    if (krs.total_sks + classItem.sks > krs.max_sks) {
      throw new Error(`Total SKS akan melebihi batas maksimum (${krs.max_sks} SKS).`)
    }

    // Check schedule conflict
    const conflict = krs.items.find(i => {
      return i.schedule_day === classItem.schedule_day && i.schedule_time === classItem.time_slot
    })
    if (conflict) {
      throw new Error(`Bentrok Jadwal pada hari ${classItem.schedule_day} (${classItem.time_slot}) dengan mata kuliah ${conflict.course_name}.`)
    }

    krs.items.push({
      id: `item-${Date.now()}`,
      course_id: classItem.course_id,
      course_code: classItem.course_code,
      course_name: classItem.course_name,
      class_id: classItem.id,
      class_code: classItem.class_code,
      sks: classItem.sks,
      lecturer_name: classItem.lecturer_name,
      schedule_day: classItem.schedule_day,
      schedule_time: classItem.time_slot,
      room_code: classItem.room_code
    })

    krs.total_sks = krs.items.reduce((acc, curr) => acc + curr.sks, 0)
    this.saveState()
    return krs
  }

  removeCourseFromKRS(studentId, itemId) {
    const krs = this.getStudentKRS(studentId)
    if (krs.status !== 'DRAFT' && krs.status !== 'REJECTED') {
      throw new Error('KRS yang sudah diajukan atau disetujui tidak dapat diubah.')
    }
    krs.items = krs.items.filter(i => i.id !== itemId)
    krs.total_sks = krs.items.reduce((acc, curr) => acc + curr.sks, 0)
    this.saveState()
    return krs
  }

  submitKRS(studentId) {
    const krs = this.getStudentKRS(studentId)
    if (krs.items.length === 0) {
      throw new Error('KRS masih kosong. Silakan pilih minimal 1 mata kuliah.')
    }
    krs.status = 'SUBMITTED'
    krs.submitted_at = new Date().toISOString()
    krs.approval_note = null

    // Notify Admin
    this.addNotification({
      title: `Pengajuan KRS Baru: ${krs.student_name}`,
      message: `Mahasiswa ${krs.student_name} (${krs.student_nim}) telah mengajukan rencana studi ${krs.total_sks} SKS untuk semester Genap.`,
      type: 'KRS_SUBMITTED',
      recipient_role: 'ADMIN'
    })

    this.saveState()
    return krs
  }

  approveKRS(enrollmentId, approverName = 'BAAK UDINUS', note = 'KRS disetujui sesuai kurikulum.') {
    const krs = this.enrollments.find(e => e.id === enrollmentId)
    if (!krs) throw new Error('KRS tidak ditemukan.')

    krs.status = 'APPROVED'
    krs.approved_by = approverName
    krs.approval_note = note
    krs.approved_at = new Date().toISOString()

    // Notify Student
    this.addNotification({
      title: 'KRS Anda Telah Disetujui!',
      message: `Rencana Studi Semester Genap 2025/2026 telah diverifikasi dan disetujui oleh ${approverName}.`,
      type: 'KRS_APPROVED',
      recipient_role: 'MAHASISWA'
    })

    this.saveState()
    return krs
  }

  rejectKRS(enrollmentId, rejectorName = 'BAAK UDINUS', reason = 'Perlu perbaikan pilihan mata kuliah.') {
    const krs = this.enrollments.find(e => e.id === enrollmentId)
    if (!krs) throw new Error('KRS tidak ditemukan.')

    krs.status = 'REJECTED'
    krs.approved_by = rejectorName
    krs.approval_note = reason

    // Notify Student
    this.addNotification({
      title: 'KRS Memerlukan Perbaikan',
      message: `Pengajuan KRS ditolak dengan alasan: "${reason}". Silakan lakukan penyesuaian mata kuliah.`,
      type: 'KRS_REJECTED',
      recipient_role: 'MAHASISWA'
    })

    this.saveState()
    return krs
  }

  requestKRSRevision(enrollmentId, reason = 'Mahasiswa mengajukan izin ubah/tambah mata kuliah.') {
    const krs = this.enrollments.find(e => e.id === enrollmentId)
    if (!krs) throw new Error('KRS tidak ditemukan.')

    krs.status = 'REVISION_REQUESTED'
    krs.approval_note = `Permohonan Izin Ubah KRS: ${reason}`

    this.addNotification({
      title: 'Permohonan Izin Ubah KRS Terkirim',
      message: `Permohonan izin ubah/tambah KRS Anda sedang menunggu persetujuan Dosen Wali.`,
      type: 'KRS_REVISION_REQUESTED',
      recipient_role: 'MAHASISWA'
    })

    this.saveState()
    return krs
  }

  unlockKRS(enrollmentId, approverName = 'Dr. Ir. Budi Santoso, M.Kom. (Dosen Wali)', note = 'Izin perubahan KRS diberikan oleh Dosen Wali.') {
    const krs = this.enrollments.find(e => e.id === enrollmentId)
    if (!krs) throw new Error('KRS tidak ditemukan.')

    krs.status = 'DRAFT'
    krs.approved_by = approverName
    krs.approval_note = note

    this.addNotification({
      title: 'Izin Perubahan KRS Disetujui!',
      message: `Dosen Wali telah membuka kunci KRS Anda. Silakan menambah atau menyesuaikan mata kuliah.`,
      type: 'KRS_UNLOCKED',
      recipient_role: 'MAHASISWA'
    })

    this.saveState()
    return krs
  }

  // --- GRADES ---
  getStudentGrades(studentId = 'usr-student-01') {
    return this.grades.filter(g => g.student_id === studentId && g.is_published)
  }

  getAllGradesForClass(classId) {
    return this.grades.filter(g => g.class_id === classId)
  }

  getAllGrades() {
    return this.grades
  }

  updateGradeScore(gradeId, { assignment_score, midterm_score, final_score, attendance_score }) {
    const grade = this.grades.find(g => g.id === gradeId)
    if (!grade) throw new Error('Data nilai tidak ditemukan.')

    grade.assignment_score = Number(assignment_score)
    grade.midterm_score = Number(midterm_score)
    grade.final_score = Number(final_score)
    grade.attendance_score = Number(attendance_score)

    // Formula calculation: Tugas (20%) + UTS (30%) + UAS (40%) + Presensi (10%)
    const finalNumeric = (
      (grade.assignment_score * 0.2) +
      (grade.midterm_score * 0.3) +
      (grade.final_score * 0.4) +
      (grade.attendance_score * 0.1)
    )
    grade.final_numeric_score = Number(finalNumeric.toFixed(1))

    // Convert to letter grade
    if (grade.final_numeric_score >= 85) {
      grade.letter_grade = 'A'
      grade.grade_point = 4.0
    } else if (grade.final_numeric_score >= 80) {
      grade.letter_grade = 'AB'
      grade.grade_point = 3.5
    } else if (grade.final_numeric_score >= 70) {
      grade.letter_grade = 'B'
      grade.grade_point = 3.0
    } else if (grade.final_numeric_score >= 65) {
      grade.letter_grade = 'BC'
      grade.grade_point = 2.5
    } else if (grade.final_numeric_score >= 55) {
      grade.letter_grade = 'C'
      grade.grade_point = 2.0
    } else if (grade.final_numeric_score >= 40) {
      grade.letter_grade = 'D'
      grade.grade_point = 1.0
    } else {
      grade.letter_grade = 'E'
      grade.grade_point = 0.0
    }

    this.saveState()
    return grade
  }

  publishClassGrades(classId) {
    const list = this.grades.filter(g => g.class_id === classId)
    list.forEach(g => {
      g.is_published = true
      g.published_at = new Date().toISOString()
    })

    if (list.length > 0) {
      this.addNotification({
        title: `Nilai Dipublikasikan: ${list[0].course_name}`,
        message: `Dosen pengampu telah mempublikasikan nilai akhir untuk mata kuliah ${list[0].course_name} (${list[0].class_code}).`,
        type: 'GRADE_PUBLISHED',
        recipient_role: 'MAHASISWA'
      })
    }

    this.saveState()
    return list
  }

  getTranscriptHistory() {
    return INITIAL_TRANSCRIPT_HISTORY
  }

  // --- ATTENDANCE ---
  getAttendanceSessions(classId = null) {
    if (classId) {
      return this.sessions.filter(s => s.class_id === classId)
    }
    return this.sessions
  }

  getActiveSessionsForStudent(studentId = 'usr-student-01') {
    // Return all sessions that are currently open
    return this.sessions.filter(s => s.status === 'OPEN')
  }

  createAttendanceSession(data) {
    const newSession = {
      id: `ses-${Date.now()}`,
      class_id: data.class_id || 'cls-01',
      class_code: data.class_code || 'A11.4401',
      course_code: data.course_code || 'A11.54301',
      course_name: data.course_name || 'Rekayasa Perangkat Lunak',
      lecturer_id: data.lecturer_id || 'usr-lecturer-01',
      lecturer_name: data.lecturer_name || 'Dr. Ir. Budi Santoso, M.Kom.',
      room_code: data.room_code || 'D.2.A',
      session_number: Number(data.session_number) || 1,
      topic: data.topic || 'Materi Perkuliahan Baru',
      date: data.date || new Date().toISOString().split('T')[0],
      start_time: data.start_time || '10:20',
      end_time: data.end_time || '12:50',
      status: data.status || 'OPEN',
      created_at: new Date().toISOString(),
      records: [
        { id: `rec-${Date.now()}-1`, student_id: 'usr-student-01', nim: 'A11.2023.14920', name: 'Arya Pratama', status: 'NOT_RECORDED', timestamp: null, notes: '' },
        { id: `rec-${Date.now()}-2`, student_id: 'usr-student-02', nim: 'A11.2023.14925', name: 'Rian Syahputra', status: 'NOT_RECORDED', timestamp: null, notes: '' },
        { id: `rec-${Date.now()}-3`, student_id: 'usr-student-03', nim: 'A11.2023.14930', name: 'Siti Nurhaliza', status: 'NOT_RECORDED', timestamp: null, notes: '' },
        { id: `rec-${Date.now()}-4`, student_id: 'usr-student-04', nim: 'A11.2023.14935', name: 'Dimas Setiawan', status: 'NOT_RECORDED', timestamp: null, notes: '' },
        { id: `rec-${Date.now()}-5`, student_id: 'usr-student-05', nim: 'A11.2023.14940', name: 'Anisa Rahmawati', status: 'NOT_RECORDED', timestamp: null, notes: '' }
      ]
    }

    this.sessions.unshift(newSession)
    this.addNotification({
      title: `Sesi Presensi Dibuka: ${newSession.course_name}`,
      message: `Dosen pengampu telah membuka presensi pertemuan #${newSession.session_number} (${newSession.topic}). Batas presensi: ${newSession.start_time} - ${newSession.end_time} WIB.`,
      type: 'ATTENDANCE_OPENED',
      recipient_role: 'MAHASISWA'
    })
    this.saveState()
    return newSession
  }

  closeAttendanceSession(sessionId) {
    const s = this.sessions.find(item => item.id === sessionId)
    if (s) {
      s.status = 'CLOSED'
      s.closed_at = new Date().toISOString()
      this.saveState()
    }
    return s
  }

  submitStudentAttendance(sessionId, studentId = '9bd53a4e-97ed-4bb7-a62d-9307381de64b') {
    const s = this.sessions.find(item => item.id === sessionId)
    if (!s) throw new Error('Sesi presensi tidak ditemukan.')
    if (s.status === 'CLOSED') throw new Error('Sesi presensi telah ditutup oleh dosen pengampu.')

    // Check date & time expiration
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    if (s.date && s.date < todayStr) {
      s.status = 'CLOSED'
      this.saveState()
      throw new Error(`Batas tanggal presensi (${s.date}) telah berakhir.`)
    }
    if (s.date === todayStr && s.end_time) {
      try {
        const [endHour, endMin] = s.end_time.split(':').map(Number)
        if (now.getHours() > endHour || (now.getHours() === endHour && now.getMinutes() >= endMin)) {
          s.status = 'CLOSED'
          this.saveState()
          throw new Error(`Batas jam presensi (${s.end_time} WIB) telah berakhir.`)
        }
      } catch {}
    }

    let rec = s.records.find(r => r.student_id === studentId)
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    if (rec) {
      rec.status = 'PRESENT'
      rec.timestamp = timeStr
    } else {
      rec = {
        id: `rec-${Date.now()}`,
        student_id: studentId,
        nim: 'A11.2023.14920',
        name: 'Arya Pratama',
        status: 'PRESENT',
        timestamp: timeStr,
        notes: ''
      }
      s.records.push(rec)
    }

    this.saveState()
    return { success: true, session: s, record: rec }
  }

  updateStudentRecord(sessionId, studentId, status, notes) {
    const s = this.sessions.find(item => item.id === sessionId)
    if (s) {
      const rec = s.records.find(r => r.student_id === studentId)
      if (rec) {
        rec.status = status
        if (notes !== undefined) rec.notes = notes
        if (status === 'PRESENT' && !rec.timestamp) {
          rec.timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        }
      }
      this.saveState()
    }
    return s
  }

  getAttendanceSummary(studentId = 'usr-student-01') {
    return INITIAL_ATTENDANCE_SUMMARY
  }

  getAttendanceCourses(studentId = 'usr-student-01') {
    return INITIAL_ATTENDANCE_COURSES
  }

  // --- NOTIFICATIONS ---
  getNotifications(role = 'MAHASISWA') {
    return this.notifications.filter(n => n.recipient_role === role || n.recipient_role === 'ALL')
  }

  markNotificationAsRead(id) {
    const n = this.notifications.find(item => item.id === id)
    if (n) {
      n.is_read = true
      this.saveState()
    }
    return n
  }

  markAllNotificationsRead(role = 'MAHASISWA') {
    this.notifications.forEach(n => {
      if (n.recipient_role === role || n.recipient_role === 'ALL') {
        n.is_read = true
      }
    })
    this.saveState()
    return true
  }

  addNotification(notifData) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      created_at: 'Baru saja',
      is_read: false,
      ...notifData
    }
    this.notifications.unshift(newNotif)
    this.saveState()
    return newNotif
  }
}

export const mockServer = new MockCampusServer()
