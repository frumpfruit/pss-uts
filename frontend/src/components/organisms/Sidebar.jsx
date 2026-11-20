import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileSpreadsheet,
  BookOpen,
  GraduationCap,
  CalendarCheck2,
  CalendarDays,
  BellRing,
  Calendar,
  Download,
  Users,
  LogOut,
  Sparkles,
  ClipboardList
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { cn } from '../../utils/cn'

export function Sidebar({ isOpen, onClose }) {
  const { role, logout, isStudent, isLecturer, isAdmin } = useAuth()
  const location = useLocation()

  const studentNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'KRS (Mata Kuliah)', path: '/krs', icon: BookOpen },
    { label: 'Input KRS', path: '/krs/input', icon: FileSpreadsheet },
    { label: 'Nilai & Transkrip', path: '/grades', icon: GraduationCap },
    { label: 'Presensi Kuliah', path: '/attendance', icon: CalendarCheck2 },
    { label: 'Jadwal Kuliah', path: '/schedule', icon: CalendarDays },
    { label: 'Pengumuman', path: '/notices', icon: BellRing },
    { label: 'Kalender Akademik', path: '/calendar', icon: Calendar },
  ]

  const lecturerNavItems = [
    { label: 'Dashboard Dosen', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Jadwal Mengajar', path: '/schedule', icon: CalendarDays },
    { label: 'Kelas & Mahasiswa', path: '/courses', icon: BookOpen },
    { label: 'Kelola Presensi', path: '/attendance', icon: CalendarCheck2 },
    { label: 'Input Nilai', path: '/grades', icon: GraduationCap },
    { label: 'Pengumuman', path: '/notices', icon: BellRing },
  ]

  const adminNavItems = [
    { label: 'Dashboard Admin', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Verifikasi KRS', path: '/krs', icon: ClipboardList },
    { label: 'Manajemen Pengguna', path: '/users', icon: Users },
    { label: 'Mata Kuliah & Kurikulum', path: '/courses', icon: BookOpen },
    { label: 'Jadwal & Ruang', path: '/schedule', icon: CalendarDays },
    { label: 'Rekap Presensi', path: '/attendance', icon: CalendarCheck2 },
    { label: 'Rekap Nilai', path: '/grades', icon: GraduationCap },
  ]

  let navItems = studentNavItems
  if (isLecturer) navItems = lecturerNavItems
  if (isAdmin) navItems = adminNavItems

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-200 select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#133E87] text-white flex items-center justify-center shadow-md shadow-blue-900/20">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">UDINUS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  SIAKAD
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const isKRS = item.path === '/krs'
              const isKRSInput = item.path === '/krs/input'
              const isItemActive = isKRS
                ? (location.pathname === '/krs' || location.pathname === '/courses')
                : isKRSInput
                  ? location.pathname === '/krs/input'
                  : location.pathname === item.path

              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/krs' || item.path === '/krs/input' || item.path === '/dashboard'}
                  onClick={() => onClose && onClose()}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer',
                    isItemActive
                      ? 'bg-[#133E87] text-white shadow-sm shadow-[#133E87]/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105',
                      isItemActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  )
}
