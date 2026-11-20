import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/organisms/Sidebar'
import { Topbar } from '../components/organisms/Topbar'

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Dynamic topbar title based on route path
  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('/dashboard')) return 'Dashboard'
    if (path === '/krs/input') return 'Input KRS Online'
    if (path.includes('/krs') || path.includes('/courses')) return 'Kartu Rencana Studi (KRS) & Mata Kuliah'
    if (path.includes('/grades')) return 'Nilai & Transkrip Akademik'
    if (path.includes('/attendance')) return 'Presensi Perkuliahan'
    if (path.includes('/schedule')) return 'Jadwal Kuliah & Ruang'
    if (path.includes('/notices')) return 'Papan Pengumuman Kampus'
    if (path.includes('/calendar')) return 'Kalender Akademik'
    if (path.includes('/users')) return 'Manajemen Pengguna'
    if (path.includes('/profile')) return 'Profil Akademik'
    return 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="grow flex flex-col min-w-0 min-h-screen">
        <Topbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle()}
        />

        <main className="p-4 sm:p-6 lg:p-8 grow max-w-7xl 2xl:max-w-[1536px] w-full mx-auto">
          <Outlet />
        </main>

        <footer className="px-6 py-4 border-t border-slate-100 bg-white text-center text-xs text-slate-400 select-none">
          <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Universitas Dian Nuswantoro. Hak Cipta Dilindungi Undang-Undang.</p>
            <p className="flex items-center gap-1">
              Dibuat dengan <span className="text-rose-500 font-bold">♥</span> untuk Civitas Academica UDINUS
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
