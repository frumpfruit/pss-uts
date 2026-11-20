import { apiClient } from './apiClient'
import { mockServer } from './mockServer'

// Toggle to use real Django REST API or fallback to mockServer
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Default PostgreSQL UUID for student Arya Pratama
export const DEFAULT_STUDENT_ID = '9bd53a4e-97ed-4bb7-a62d-9307381de64b'

// Helper for realistic fallback delay
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Safely extracts an array from various API response shapes:
 * - Plain Array: [ ... ]
 * - DRF Pagination: { count: N, results: [ ... ] }
 * - Envelope: { data: [ ... ] } or { data: { results: [ ... ] } }
 */
export function normalizeList(res) {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.results)) return res.results
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.data?.results)) return res.data.results
  if (Array.isArray(res.items)) return res.items
  return []
}

/**
 * AUTH SERVICE API
 * Connected to Django REST Auth Service / JWT
 * Endpoints: /api/auth/login/, /api/auth/me/, /api/users/
 */
export const authApi = {
  login: async (username, password) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post('/auth/login/', { username, password })
        const token = res?.access || res?.token || res?.data?.access || res?.data?.token
        const user = res?.user || res?.data?.user
        if (token) {
          if (user && res?.data?.student_profile) {
            user.student_profile = res.data.student_profile
          }
          localStorage.setItem('siakad_token', token)
          if (user) {
            localStorage.setItem('siakad_current_user', JSON.stringify(user))
          }
          return {
            success: true,
            data: {
              token,
              user,
            },
            message: res?.message || res?.data?.message || 'Login berhasil.'
          }
        }
        return res
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.login(username, password)
  },

  getCurrentUser: async () => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/auth/me/')
        return res?.user || res?.data?.user || res?.data || res
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay(20)
    return mockServer.getCurrentUser()
  },

  switchRole: async (role) => {
    const creds = {
      MAHASISWA: { username: 'aryapratama', password: 'password123' },
      DOSEN: { username: 'dosen', password: 'password123' },
      ADMIN: { username: 'admin', password: 'admin123' }
    }
    const c = creds[role] || creds.MAHASISWA

    if (!USE_MOCK) {
      try {
        const res = await apiClient.post('/auth/login/', c)
        const token = res?.access || res?.token || res?.data?.access || res?.data?.token
        const user = res?.user || res?.data?.user
        if (token) {
          localStorage.setItem('siakad_token', token)
          if (user) {
            localStorage.setItem('siakad_current_user', JSON.stringify(user))
          }
          return user
        }
      } catch (err) {
        console.warn('Real Django API offline on switchRole, using fallback:', err.message)
      }
    }
    await delay(20)
    return mockServer.switchRole(role)
  },

  logout: async () => {
    if (!USE_MOCK) {
      try {
        await apiClient.post('/auth/logout/')
      } catch (e) {
        // ignore offline error on logout
      }
    }
    await delay(20)
    return mockServer.logout()
  }
}

/**
 * ACADEMIC & COURSES SERVICE API
 * Connected to Django Academic Service & PostgreSQL ORM
 * Endpoints: /api/courses/, /api/classes/, /api/schedules/, /api/faculties/, /api/study-programs/
 */
export const academicApi = {
  getCourses: async () => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/courses/')
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getCourses()
  },

  getClasses: async () => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/classes/')
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getClasses()
  },

  getSchedules: async () => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/schedules/')
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getSchedules()
  },

  getFaculties: async () => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/faculties/')
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.faculties
  },

  getStudyPrograms: async () => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/study-programs/')
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.studyPrograms
  }
}

/**
 * ENROLLMENT / KRS SERVICE API
 * Connected to Django Enrollment Service & PostgreSQL ORM
 * Endpoints: /api/enrollments/, /api/enrollments/:id/submit/, /api/enrollments/:id/approve/
 */
export const enrollmentApi = {
  getStudentKRS: async (studentId = DEFAULT_STUDENT_ID) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get(`/enrollments/?student_id=${studentId}`)
        const list = normalizeList(res)
        if (list.length > 0) return list[0]
        if (res && res.id && res.items) return res
        if (res?.data?.id && res.data.items) return res.data
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getStudentKRS(studentId)
  },

  getStudentEnrollment: async (studentId = DEFAULT_STUDENT_ID) => {
    return enrollmentApi.getStudentKRS(studentId)
  },

  getAllEnrollments: async () => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/enrollments/')
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getAllEnrollments()
  },

  addCourse: async (studentId, classItem) => {
    if (!USE_MOCK) {
      try {
        const payload = {
          class_id: classItem.id,
          class_code: classItem.class_code,
          course_id: classItem.course_id,
          course_code: classItem.course_code,
          course_name: classItem.course_name,
          sks: classItem.sks,
          lecturer_name: classItem.lecturer_name,
          schedule_day: classItem.schedule_day,
          schedule_time: classItem.time_slot || classItem.schedule_time,
          room_code: classItem.room_code
        }
        const res = await apiClient.post(`/enrollments/${studentId}/add-item/`, payload)
        const updated = res?.krs || res?.data || res
        if (updated && updated.items) {
          return updated
        }
      } catch (err) {
        console.error('API error addCourse:', err.message)
        throw err
      }
    }
    await delay()
    return mockServer.addCourseToKRS(studentId, classItem)
  },

  removeCourse: async (studentId, itemId) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.delete(`/enrollments/${studentId}/remove-item/`, {
          data: { item_id: itemId }
        })
        const updated = res?.krs || res?.data || res
        if (updated && updated.items) {
          return updated
        }
      } catch (err) {
        console.error('API error removeCourse:', err.message)
        throw err
      }
    }
    await delay()
    return mockServer.removeCourseFromKRS(studentId, itemId)
  },

  submitKRS: async (studentId) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/enrollments/${studentId}/submit/`)
        const updated = res?.krs || res?.data || res
        if (updated && updated.status) {
          return updated
        }
      } catch (err) {
        console.error('API error submitKRS:', err.message)
        throw err
      }
    }
    await delay()
    return mockServer.submitKRS(studentId)
  },

  approveKRS: async (id, approver, note) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/enrollments/${id}/approve/`, {
          approved_by: approver,
          approval_note: note
        })
        return res?.krs || res?.data || res
      } catch (err) {
        console.error('API error approveKRS:', err.message)
        throw err
      }
    }
    await delay()
    return mockServer.approveKRS(id, approver, note)
  },

  rejectKRS: async (id, approver, reason) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/enrollments/${id}/reject/`, {
          approved_by: approver,
          approval_note: reason
        })
        return res?.krs || res?.data || res
      } catch (err) {
        console.error('API error rejectKRS:', err.message)
        throw err
      }
    }
    await delay()
    return mockServer.rejectKRS(id, approver, reason)
  },

  requestRevision: async (id, reason) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/enrollments/${id}/request-revision/`, { reason })
        return res?.krs || res?.data || res
      } catch (err) {
        console.error('API error requestRevision:', err.message)
        throw err
      }
    }
    await delay()
    return mockServer.requestKRSRevision(id, reason)
  },

  unlockKRS: async (id, approver, note) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/enrollments/${id}/unlock/`, {
          unlocked_by: approver,
          approval_note: note
        })
        return res?.krs || res?.data || res
      } catch (err) {
        console.error('API error unlockKRS:', err.message)
        throw err
      }
    }
    await delay()
    return mockServer.unlockKRS(id, approver, note)
  }
}

/**
 * GRADE SERVICE API
 * Connected to Django Grade Service & PostgreSQL ORM
 * Endpoints: /api/grades/, /api/grades/:id/update-scores/, /api/grades/publish-class/
 */
export const gradeApi = {
  getStudentGrades: async (studentId = DEFAULT_STUDENT_ID) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get(`/grades/?student_id=${studentId}`)
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getStudentGrades(studentId)
  },

  getTranscriptHistory: async () => {
    await delay(10)
    return mockServer.getTranscriptHistory()
  },

  getClassGrades: async (classId) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get(`/grades/?class_id=${classId}`)
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getAllGradesForClass(classId)
  },

  getAllGrades: async () => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/grades/')
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getAllGrades()
  },

  updateGradeScore: async (gradeId, scores) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.patch(`/grades/${gradeId}/update-scores/`, scores)
        return res?.data || res
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.updateGradeScore(gradeId, scores)
  },

  publishClassGrades: async (classId) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/grades/publish-class/`, { class_id: classId })
        return res?.data || res
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.publishClassGrades(classId)
  }
}

/**
 * ATTENDANCE SERVICE API
 * Connected to Django Attendance Service & PostgreSQL ORM
 * Endpoints: /api/sessions/, /api/records/
 */
export const attendanceApi = {
  getSummary: async (studentId = DEFAULT_STUDENT_ID) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get(`/sessions/summary/?student_id=${studentId}`)
        if (res && (res.percentage !== undefined || res?.data?.percentage !== undefined)) {
          return res.data || res
        }
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getAttendanceSummary(studentId)
  },

  getSessions: async (classId = null) => {
    if (!USE_MOCK) {
      try {
        const url = classId ? `/sessions/?class_id=${classId}` : '/sessions/'
        const res = await apiClient.get(url)
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getAttendanceSessions(classId)
  },

  getActiveSessions: async (studentId = DEFAULT_STUDENT_ID) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get('/sessions/?status=OPEN')
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getActiveSessionsForStudent(studentId)
  },

  createSession: async (sessionData) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post('/sessions/', sessionData)
        return res?.data || res
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.createAttendanceSession(sessionData)
  },

  closeSession: async (sessionId) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/sessions/${sessionId}/close/`)
        return res?.data || res
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.closeAttendanceSession(sessionId)
  },

  submitAttendance: async (sessionId, studentId = DEFAULT_STUDENT_ID) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/sessions/${sessionId}/record-presence/`, {
          student_id: studentId,
          status: 'PRESENT'
        })
        return res?.data || res
      } catch (err) {
        // Enforce strict backend validation: do not silently swallow deadline expiration errors!
        throw new Error(err.response?.data?.message || err.message || 'Gagal mencatat presensi.')
      }
    }
    await delay()
    return mockServer.submitStudentAttendance(sessionId, studentId)
  },

  updateStudentRecord: async (sessionId, studentId, status, notes) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/sessions/${sessionId}/bulk-record/`, {
          records: [{ student_id: studentId, status, notes }]
        })
        return res?.data || res
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.updateStudentRecord(sessionId, studentId, status, notes)
  },

  getCoursesAttendance: async (studentId = DEFAULT_STUDENT_ID) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get(`/records/?student_id=${studentId}`)
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getAttendanceCourses(studentId)
  }
}

/**
 * NOTIFICATION SERVICE API
 * Connected to Django Notification Service & PostgreSQL ORM
 * Endpoints: /api/notifications/
 */
export const notificationApi = {
  getNotifications: async (role = 'MAHASISWA') => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.get(`/notifications/?target_role=${role}`)
        const list = normalizeList(res)
        if (list.length > 0) return list
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay()
    return mockServer.getNotifications(role)
  },

  markAsRead: async (id) => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.patch(`/notifications/${id}/`)
        return res?.data || res
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay(20)
    return mockServer.markNotificationAsRead(id)
  },

  markAllAsRead: async (role = 'MAHASISWA') => {
    if (!USE_MOCK) {
      try {
        const res = await apiClient.post(`/notifications/read-all/`, { role })
        return res?.data || res
      } catch (err) {
        console.warn('Real Django API offline, using fallback:', err.message)
      }
    }
    await delay(20)
    return mockServer.markAllNotificationsRead(role)
  }
}
