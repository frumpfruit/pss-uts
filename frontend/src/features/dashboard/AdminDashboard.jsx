import React, { useState, useEffect } from 'react'
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  FileCheck
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts'
import { enrollmentApi } from '../../services/apiService'
import { DashboardTemplate } from '../../components/templates/DashboardTemplate'
import { StatCard } from '../../components/molecules/StatCard'
import { Button } from '../../components/atoms/Button'
import { Badge } from '../../components/atoms/Badge'
import { toast } from '../../utils/toast'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchEnrollments = async () => {
    setLoading(true)
    try {
      const data = await enrollmentApi.getAllEnrollments()
      setEnrollments(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const handleApprove = async (id) => {
    try {
      await enrollmentApi.approveKRS(id, 'Admin BAAK Kampus', 'KRS telah disetujui BAAK.')
      toast.success('KRS Disetujui BAAK', 'Pengajuan rencana studi mahasiswa berhasil disetujui.')
      fetchEnrollments()
    } catch (err) {
      toast.error('Gagal Menyetujui', err.message)
    }
  }

  const handleReject = async (id) => {
    const reason = prompt('Masukkan alasan penolakan KRS:', 'Pilihan SKS melebihi rekomendasi atau belum memenuhi syarat prasyarat.')
    if (reason) {
      try {
        await enrollmentApi.rejectKRS(id, 'Admin BAAK Kampus', reason)
        toast.warning('KRS Dikembalikan', `Rencana studi dikembalikan ke mahasiswa: ${reason}`)
        fetchEnrollments()
      } catch (err) {
        toast.error('Gagal Menolak', err.message)
      }
    }
  }

  const studentProgramData = [
    { name: 'Teknik Informatika', total: 640 },
    { name: 'Sistem Informasi', total: 420 },
    { name: 'DKV', total: 280 },
    { name: 'Manajemen', total: 310 },
    { name: 'Ilmu Komunikasi', total: 190 },
  ]

  const enrollmentTrendData = [
    { semester: '2023/1', count: 1100 },
    { semester: '2023/2', count: 1250 },
    { semester: '2024/1', count: 1320 },
    { semester: '2024/2', count: 1380 },
    { semester: '2025/1', count: 1410 },
    { semester: '2025/2', count: 1480 },
  ]

  const banner = (
    <div className="overflow-hidden rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-slate-900 via-[#0B2545] to-[#133E87] text-white shadow-md select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-amber-300">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Biro Administrasi Akademik & Kemahasiswaan (BAAK)
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Pusat Kendali Akademik UDINUS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
            Pantau arus rencana studi (KRS), master data fakultas & prodi, alokasi kelas perkuliahan, dan distribusi mahasiswa secara terpusat.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="gold"
            size="md"
            icon={FileCheck}
            onClick={() => navigate('/krs')}
          >
            Review Semua KRS
          </Button>
        </div>
      </div>
    </div>
  )

  const stats = (
    <>
      <StatCard
        title="Mahasiswa Aktif"
        value="1,480"
        subtitle="Semester Genap"
        icon={Users}
        iconBgColor="bg-blue-50 text-[#133E87]"
        trend="+6.2%"
        trendType="positive"
        onClick={() => navigate('/users')}
      />

      <StatCard
        title="Dosen Pengajar"
        value="112 Dosen"
        subtitle="NIDN Aktif Mengajar"
        icon={GraduationCap}
        iconBgColor="bg-emerald-50 text-emerald-600"
      />

      <StatCard
        title="Kelas Perkuliahan"
        value="64 Kelas"
        subtitle="Tersebar di 18 Ruangan"
        icon={CalendarDays}
        iconBgColor="bg-amber-50 text-amber-600"
        onClick={() => navigate('/schedule')}
      />

      <StatCard
        title="Verifikasi KRS"
        value={`${(Array.isArray(enrollments) ? enrollments : []).filter(e => e.status === 'SUBMITTED').length}`}
        subtitle="Perlu Tindakan Approval"
        icon={Clock}
        iconBgColor="bg-rose-50 text-rose-600"
        trend="Pending"
        trendType="warning"
        onClick={() => navigate('/krs')}
      />
    </>
  )

  const pendingList = (Array.isArray(enrollments) ? enrollments : []).filter(e => e.status === 'SUBMITTED')

  const mainGrid = (
    <>
      {/* Left Column (7 cols): Charts */}
      <div className="lg:col-span-7 space-y-6">
        <div className="dashboard-card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Distribusi Mahasiswa per Program Studi
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Jumlah mahasiswa aktif terdaftar di tiap program studi tahun 2025/2026
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentProgramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B2545', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  cursor={{ fill: '#F1F5F9' }}
                />
                <Bar dataKey="total" fill="#133E87" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Tren Pendaftaran KRS (Enrollment Trend)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Pertumbuhan partisipasi pengajuan KRS semester demi semester
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B2545', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column (5 cols): Pengajuan KRS Menunggu Approval Langsung */}
      <div className="lg:col-span-5 space-y-6">
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Persetujuan KRS Cepat
              </h3>
              <p className="text-xs text-slate-400">Menunggu verifikasi admin/dosen wali</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {pendingList.length} Menunggu
            </span>
          </div>

          {pendingList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
              Semua pengajuan KRS telah diverifikasi.
            </div>
          ) : (
            <div className="space-y-4">
              {(Array.isArray(pendingList) ? pendingList : []).map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.student_name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{item.student_nim}</p>
                    </div>
                    <Badge variant="warning" size="sm">
                      {item.total_sks} SKS
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-700 mb-1">Mata Kuliah Diajukan:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                      {item.items.map(subItem => (
                        <li key={subItem.id}>
                          {subItem.course_name} ({subItem.sks} SKS) - {subItem.class_code}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleApprove(item.id)}
                      className="grow"
                    >
                      Setujui KRS
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => handleReject(item.id)}
                    >
                      Tolak
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <DashboardTemplate
      banner={banner}
      stats={stats}
      mainGrid={mainGrid}
    />
  )
}
