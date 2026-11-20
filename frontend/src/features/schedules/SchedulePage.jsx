import React, { useState, useEffect } from 'react'
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { academicApi, enrollmentApi, DEFAULT_STUDENT_ID } from '../../services/apiService'
import { Badge } from '../../components/atoms/Badge'
import { DAYS_OF_WEEK } from '../../constants/academic'

export function SchedulePage() {
  const { user, isStudent, isLecturer } = useAuth()
  const studentId = (user?.id && user.id !== 'usr-student-01') ? user.id : DEFAULT_STUDENT_ID
  const [schedules, setSchedules] = useState([])
  const [selectedDay, setSelectedDay] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        if (isStudent) {
          const [data, studentKrs] = await Promise.all([
            academicApi.getSchedules().catch(() => []),
            enrollmentApi.getStudentKRS(studentId).catch(() => null)
          ])
          if (studentKrs?.items && studentKrs.items.length > 0) {
            const mapped = studentKrs.items.map(item => ({
              id: item.id,
              course_code: item.course_code,
              course_name: item.course_name,
              class_code: item.class_code,
              sks: item.sks,
              day: item.schedule_day,
              start_time: (item.schedule_time || '').split('-')[0]?.trim() || '08:00',
              end_time: (item.schedule_time || '').split('-')[1]?.trim() || '10:30',
              room_code: item.room_code || 'H.4.1',
              lecturer_name: item.lecturer_name || 'Dosen Pengampu'
            }))
            setSchedules(mapped)
          } else {
            setSchedules(Array.isArray(data) ? data : [])
          }
        } else {
          const data = await academicApi.getSchedules()
          setSchedules(Array.isArray(data) ? data : [])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isStudent, studentId])

  const scheduleList = Array.isArray(schedules) ? schedules : []
  const filtered = selectedDay === 'ALL'
    ? scheduleList
    : scheduleList.filter(s => s.day === selectedDay)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#133E87]" />
            Jadwal Perkuliahan & Ruangan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Semester Genap 2025/2026 • Universitas Dian Nuswantoro
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-100 shadow-2xs">
          <button
            type="button"
            onClick={() => setSelectedDay('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
              selectedDay === 'ALL'
                ? 'bg-[#133E87] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Hari
          </button>
          {DAYS_OF_WEEK.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
                selectedDay === day
                  ? 'bg-[#133E87] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Array.isArray(filtered) ? filtered : []).map(item => (
          <div
            key={item.id}
            className="dashboard-card p-5 border border-slate-100 hover:border-slate-300 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#133E87] bg-blue-50 px-2 py-0.5 rounded-md">
                  {item.course_code}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md ml-1.5">
                  {item.sks} SKS
                </span>
              </div>
              <Badge variant="primary" size="sm">
                Kelompok {item.class_code}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {item.course_name}
              </h4>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.lecturer_name}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#133E87]" />
                {item.day}, {item.time_slot}
              </span>
              <span className="font-medium text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Ruang {item.room_code}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
