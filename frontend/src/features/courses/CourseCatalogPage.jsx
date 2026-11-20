import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Search,
  CheckCircle2,
  FileText,
  Layers,
  GraduationCap
} from 'lucide-react'
import { academicApi } from '../../services/apiService'
import { Badge } from '../../components/atoms/Badge'
import { SearchBar } from '../../components/molecules/SearchBar'

export function CourseCatalogPage() {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('ALL')

  useEffect(() => {
    async function load() {
      const data = await academicApi.getCourses()
      setCourses(Array.isArray(data) ? data : [])
    }
    load()
  }, [])

  const courseList = Array.isArray(courses) ? courses : []
  const filtered = courseList.filter(c => {
    const name = c.name || ''
    const code = c.code || ''
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
                          code.toLowerCase().includes(search.toLowerCase())
    const matchesSemester = selectedSemester === 'ALL' || (c.semester_recommended && c.semester_recommended.toString() === selectedSemester)
    return matchesSearch && matchesSemester
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#133E87]" />
            Katalog Mata Kuliah & Kurikulum
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Program Studi S1 Teknik Informatika • Fakultas Ilmu Komputer UDINUS
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Cari mata kuliah atau kode..."
          />
        </div>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(course => (
          <div
            key={course.id}
            className="dashboard-card p-5 border border-slate-100 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#133E87] bg-blue-50 px-2 py-0.5 rounded-md">
                  {course.code}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md">
                  {course.sks} SKS
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {course.name}
              </h4>

              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center justify-between">
                <span>Semester Anjuran:</span>
                <span className="font-bold text-slate-700">Semester {course.semester_recommended}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Prasyarat:</span>
                <span className="font-medium text-slate-600 truncate max-w-[150px]">
                  {course.prerequisite || 'Tidak Ada'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
