import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Shield,
  BookOpen,
  User,
  CheckCircle2
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { Button } from '../../components/atoms/Button'
import { Input } from '../../components/atoms/Input'

const PORTALS = [
  {
    id: 'MAHASISWA',
    label: 'Mahasiswa',
    icon: GraduationCap,
    title: 'Portal Akademik Mahasiswa',
    desc: 'Masuk dengan NIM dan kata sandi akun SIAKAD Anda',
    fieldLabel: 'NIM / Username Mahasiswa',
    placeholder: 'misal: aryapratama (NIM: A11.2023.14920)',
    defaultUsername: 'aryapratama',
    defaultPassword: 'password123',
    badge: 'Mahasiswa S1 Informatika',
    themeClass: 'text-[#133E87] bg-blue-50 border-blue-200'
  },
  {
    id: 'DOSEN',
    label: 'Dosen Pengampu',
    icon: BookOpen,
    title: 'Portal Akademik Dosen',
    desc: 'Masuk dengan NIDN dan kata sandi akun Dosen Anda',
    fieldLabel: 'NIDN / Username Dosen',
    placeholder: 'misal: dosen (NIDN: 0612087501)',
    defaultUsername: 'dosen',
    defaultPassword: 'password123',
    badge: 'Dosen Fakultas Ilmu Komputer',
    themeClass: 'text-purple-700 bg-purple-50 border-purple-200'
  },
  {
    id: 'ADMIN',
    label: 'Admin BAAK',
    icon: Shield,
    title: 'Pusat Kendali Administrasi (BAAK)',
    desc: 'Masuk dengan kredensial administrator kampus',
    fieldLabel: 'Username Administrator',
    placeholder: 'misal: admin',
    defaultUsername: 'admin',
    defaultPassword: 'admin123',
    badge: 'Biro Administrasi Akademik',
    themeClass: 'text-amber-800 bg-amber-50 border-amber-200'
  }
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const getInitialPortal = () => {
    const p = searchParams.get('portal')?.toUpperCase()
    return PORTALS.find(item => item.id === p) || PORTALS[0]
  }

  const [activePortalId, setActivePortalId] = useState(getInitialPortal().id)
  const [username, setUsername] = useState(getInitialPortal().defaultUsername)
  const [password, setPassword] = useState(getInitialPortal().defaultPassword)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const activePortal = PORTALS.find(p => p.id === activePortalId) || PORTALS[0]

  const handlePortalChange = (portal) => {
    setActivePortalId(portal.id)
    setUsername(portal.defaultUsername)
    setPassword(portal.defaultPassword)
    setError('')
    setSearchParams({ portal: portal.id.toLowerCase() })
  }

  const handleLogin = async (e) => {
    e?.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali username dan kata sandi Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B2545] to-[#133E87] flex items-center justify-center p-4 selection:bg-amber-400 selection:text-slate-900">
      <div className="w-full max-w-lg">
        {/* Logo & Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-[#133E87] text-white items-center justify-center shadow-xl shadow-blue-950/40 border border-blue-400/30 mb-3 transform hover:scale-105 transition-transform">
            <GraduationCap className="w-9 h-9 text-amber-300" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            SIAKAD UDINUS
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            Sistem Informasi Akademik Terpadu • Universitas Dian Nuswantoro
          </p>
        </div>

        {/* Portal Selector Tabs */}
        <div className="bg-slate-800/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 grid grid-cols-3 gap-1.5 mb-4 shadow-lg">
          {PORTALS.map((portal) => {
            const Icon = portal.icon
            const isActive = portal.id === activePortalId
            return (
              <button
                key={portal.id}
                type="button"
                onClick={() => handlePortalChange(portal)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md scale-[1.02]'
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#133E87]' : 'text-blue-300'}`} />
                <span>{portal.label}</span>
              </button>
            )
          })}
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-lg font-bold text-slate-900">
                {activePortal.title}
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${activePortal.themeClass}`}>
                {activePortal.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {activePortal.desc}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {activePortal.fieldLabel}
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activePortal.placeholder}
                icon={Mail}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Kata Sandi
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Masuk sebagai {activePortal.label}
            </Button>
          </form>

          {/* Account Credential Notice */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px]">Akun Terpilih: <strong className="text-slate-800 font-mono">{activePortal.defaultUsername}</strong></span>
            <span className="text-[11px] text-slate-400">Password: <strong className="text-slate-800 font-mono">{activePortal.defaultPassword}</strong></span>
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="text-center text-xs text-blue-200/80 mt-6 select-none">
          Universitas Dian Nuswantoro Semarang • SIAKAD Platform 2026
        </p>
      </div>
    </div>
  )
}
