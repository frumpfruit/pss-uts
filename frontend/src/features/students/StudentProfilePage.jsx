import React from 'react'
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Shield,
  BookOpen,
  Calendar,
  Sparkles,
  MapPin
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { Avatar } from '../../components/atoms/Avatar'
import { Badge } from '../../components/atoms/Badge'
import { Button } from '../../components/atoms/Button'

export function StudentProfilePage() {
  const { user, role, isStudent, isLecturer } = useAuth()
  const profile = user?.student_profile || {}
  const lecturerProfile = user?.lecturer_profile || {}

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="dashboard-card p-6 lg:p-8 bg-gradient-to-r from-blue-50/80 via-white to-amber-50/40">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar
            src={user?.avatar_url}
            name={user?.full_name || 'User'}
            size="xl"
            className="w-20 h-20 text-2xl"
          />

          <div className="text-center sm:text-left grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
                {user?.full_name}
              </h2>
              <Badge variant="primary" size="md">
                {role}
              </Badge>
            </div>

            <p className="text-sm text-slate-500 font-mono font-medium">
              {isStudent ? `NIM: ${profile.nim}` : isLecturer ? `NIDN: ${lecturerProfile.nidn}` : 'Administrator Kampus'}
            </p>

            <p className="text-xs text-slate-600 mt-1">
              {isStudent ? `${profile.study_program_name} • ${profile.faculty_name}` : isLecturer ? `${lecturerProfile.study_program_name} • ${lecturerProfile.faculty_name}` : 'Biro Administrasi Akademik & Kemahasiswaan'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Profile */}
        <div className="dashboard-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#133E87]" />
            Informasi Akademik
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Tahun Angkatan</span>
              <span className="font-bold text-slate-800">{profile.admission_year || '2023'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Semester Berjalan (Aktif)</span>
              <span className="font-bold text-[#133E87]">Semester {profile.current_semester || 4} (Genap 2025/2026)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Periode Kuliah Berjalan</span>
              <span className="font-bold text-slate-800">16 Feb 2026 – 10 Jul 2026</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Status Akademik</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {profile.academic_status || 'Aktif'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Dosen Pembimbing Akademik</span>
              <span className="font-bold text-[#133E87]">Dr. Ir. Budi Santoso, M.Kom.</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">SKS Lulus Lampau (Sem 1–3)</span>
              <span className="font-bold text-slate-800">63 SKS Lulus</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">SKS Sedang Berjalan (Sem 4)</span>
              <span className="font-bold text-emerald-700">17 SKS Aktif</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Total SKS Terdaftar Kumulatif</span>
              <span className="font-bold text-slate-900">80 dari 144 SKS (Target Kelulusan)</span>
            </div>
          </div>
        </div>

        {/* Contact & Identity */}
        <div className="dashboard-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-[#133E87]" />
            Data Kontak & Akun
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Email Resmi Kampus</span>
              <span className="font-bold text-slate-800 font-mono">{user?.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Nomor Telepon/WhatsApp</span>
              <span className="font-bold text-slate-800">{user?.phone_number || '081234567890'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Kampus Utama</span>
              <span className="font-bold text-slate-800">Gedung H, Jl. Imam Bonjol No. 207</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Keamanan Sandi</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Terproteksi JWT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
