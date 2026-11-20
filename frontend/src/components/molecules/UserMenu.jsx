import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, User, Shield, GraduationCap, BookOpen } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { Avatar } from '../atoms/Avatar'
import { Badge } from '../atoms/Badge'
import { cn } from '../../utils/cn'

export function UserMenu() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  // Subtitle matching reference screenshot
  let subtitle = 'SIAKAD Campus User'
  if (role === 'MAHASISWA' && user.student_profile) {
    subtitle = `${user.student_profile.study_program_name} - Smt ${user.student_profile.current_semester}`
  } else if (role === 'DOSEN' && user.lecturer_profile) {
    subtitle = `${user.lecturer_profile.academic_title} - ${user.lecturer_profile.study_program_name}`
  } else if (role === 'ADMIN') {
    subtitle = 'Biro Administrasi Akademik (BAAK)'
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer select-none text-left"
      >
        <Avatar
          src={user.avatar_url}
          name={user.full_name || user.username}
          size="md"
          status="online"
        />
        <div className="hidden md:block">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 leading-tight">
            Halo, {user.first_name || user.username}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </p>
          <p className="text-[11px] text-slate-400 truncate max-w-[190px] font-medium">
            {subtitle}
          </p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs text-slate-400">Masuk sebagai:</p>
            <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <div className="mt-2 flex items-center justify-between">
              <Badge
                variant={role === 'ADMIN' ? 'gold' : role === 'DOSEN' ? 'purple' : 'primary'}
                size="sm"
                dot
              >
                {role}
              </Badge>
              <span className="text-[10px] text-slate-400 font-mono">
                {role === 'MAHASISWA' ? user.student_profile?.nim : role === 'DOSEN' ? user.lecturer_profile?.nidn : 'BAAK UDINUS'}
              </span>
            </div>
          </div>

          <div className="p-1.5 space-y-0.5">
            <button
              type="button"
              onClick={() => { navigate('/profile'); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <User className="w-4 h-4 text-slate-400" />
              Profil & Identitas Akun
            </button>
            <button
              type="button"
              onClick={() => { logout(); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              Keluar (Logout)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
