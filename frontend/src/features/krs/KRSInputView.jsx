import React, { useState } from 'react'
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  BookOpen,
  CalendarDays,
  Search,
  Clock,
  MapPin,
  ShieldCheck,
  Check,
  Lock,
  Unlock,
  FileEdit,
  X
} from 'lucide-react'
import { Button } from '../../components/atoms/Button'
import { Badge } from '../../components/atoms/Badge'
import { SearchBar } from '../../components/molecules/SearchBar'

export function KRSInputView({
  krs,
  availableClasses = [],
  allEnrollments = [],
  isAdmin,
  isLecturer,
  isStudent,
  onAddClass,
  onRemoveItem,
  onSubmitKRS,
  onApproveKRS,
  onRejectKRS,
  onRequestRevision,
  onUnlockKRS,
  onSwitchToOrdinary
}) {
  const [search, setSearch] = useState('')
  const [selectedDay, setSelectedDay] = useState('ALL')
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false)
  const [revisionCategory, setRevisionCategory] = useState('Ingin menambah mata kuliah pilihan baru')
  const [revisionNote, setRevisionNote] = useState('')
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false)

  const isApproved = krs?.status === 'APPROVED'
  const isRevisionRequested = krs?.status === 'REVISION_REQUESTED'
  const isSubmitted = krs?.status === 'SUBMITTED'
  const isRejected = krs?.status === 'REJECTED'
  const isDraft = krs?.status === 'DRAFT'
  const isEditable = isDraft || isRejected

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success" size="lg" dot>Disetujui (Terkunci)</Badge>
      case 'REVISION_REQUESTED': return <Badge variant="warning" size="lg" dot>Menunggu Izin Ubah (Revision Requested)</Badge>
      case 'SUBMITTED': return <Badge variant="warning" size="lg" dot>Menunggu Verifikasi (Submitted)</Badge>
      case 'REJECTED': return <Badge variant="danger" size="lg" dot>Perlu Perbaikan (Rejected)</Badge>
      default: return <Badge variant="default" size="lg" dot>Draft (Dapat Diubah)</Badge>
    }
  }

  // Filter available classes
  const filteredClasses = (Array.isArray(availableClasses) ? availableClasses : []).filter(cls => {
    const name = cls.course_name || ''
    const code = cls.course_code || ''
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || code.toLowerCase().includes(search.toLowerCase())
    const matchDay = selectedDay === 'ALL' || cls.schedule_day === selectedDay
    return matchSearch && matchDay
  })

  const usedSks = krs?.total_sks || 0
  const maxSks = krs?.max_sks || 24
  const sksPercentage = Math.min(100, (usedSks / maxSks) * 100)

  return (
    <div className="space-y-6">
      {/* Top Banner for Input KRS */}
      <div className="dashboard-card p-6 bg-gradient-to-br from-white to-amber-50/20 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                Input & Pemilihan KRS Online
              </span>
              <span className="text-xs text-slate-500">
                Tahun Ajaran 2025/2026 Genap
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Pemilihan Mata Kuliah Rencana Studi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kelas mata kuliah yang ditawarkan, periksa batas maksimal beban SKS, dan ajukan ke Dosen Wali.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(krs?.status)}
          </div>
        </div>

        {/* SKS Allowance Bar */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Kapasitas Beban SKS Semester Ini:</span>
              <span className="text-[#133E87]">
                {usedSks} / {maxSks} SKS Digunakan ({maxSks - usedSks} SKS Tersisa)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  usedSks > maxSks ? 'bg-rose-500' : 'bg-gradient-to-r from-[#133E87] to-blue-600'
                }`}
                style={{ width: `${sksPercentage}%` }}
              />
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Batas Maksimum IPK Lalu:</span>
            <span className="text-xs font-extrabold text-slate-800">
              IPK 3.82 → Hak Beban Maks: 24 SKS
            </span>
          </div>
        </div>
      </div>

      {/* 1. LOCKED STATUS BANNER (When KRS is APPROVED) */}
      {isApproved && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-[#133E87] to-indigo-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/15 text-white shrink-0 mt-0.5">
              <Lock className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 uppercase tracking-wide">
                  Aturan KRS Terkunci
                </span>
                <span className="text-xs text-blue-200">
                  Verifikator: {krs.approved_by || 'Dr. Ir. Budi Santoso, M.Kom. (Dosen Wali)'}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white mt-1">
                KRS Telah Terverifikasi & Disetujui (Terkunci)
              </h4>
              <p className="text-xs text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
                Rencana studi semester Anda telah resmi disahkan oleh Dosen Wali. Sesuai aturan akademik, Anda tidak dapat mengubah atau menambah mata kuliah lagi kecuali telah mengajukan dan memperoleh <strong>izin resmi perubahan KRS</strong>.
              </p>
            </div>
          </div>

          <Button
            variant="gold"
            size="md"
            icon={FileEdit}
            onClick={() => setIsRevisionModalOpen(true)}
            className="shrink-0 font-bold shadow-md cursor-pointer whitespace-nowrap"
          >
            Ajukan Izin Ubah / Tambah KRS
          </Button>
        </div>
      )}

      {/* 2. REVISION REQUESTED BANNER */}
      {isRevisionRequested && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 text-amber-950 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 uppercase">
                Menunggu Persetujuan Dosen Wali
              </span>
              <h4 className="text-base font-extrabold text-amber-950 mt-1">
                Permohonan Izin Ubah KRS Sedang Diproses
              </h4>
              <p className="text-xs text-amber-800 mt-1 max-w-2xl">
                Permohonan izin Anda telah terkirim kepada Dosen Wali. Mohon menunggu Dosen Wali membuka kunci KRS Anda agar dapat melakukan penyesuaian mata kuliah.
              </p>
              {krs.approval_note && (
                <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl mt-2 border border-amber-200">
                  <strong>Keterangan Pengajuan:</strong> {krs.approval_note}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. UNLOCKED / DRAFT BANNER (When student received permission) */}
      {isDraft && krs?.approval_note && (krs.approval_note.toLowerCase().includes('izin') || krs.approval_note.toLowerCase().includes('dibuka')) && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-950 shadow-2xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
            <Unlock className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 uppercase">
              Izin Diberikan Dosen Wali
            </span>
            <h4 className="text-base font-extrabold text-emerald-950 mt-1">
              Kunci KRS Telah Dibuka — Akses Ubah / Tambah Aktif
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              {krs.approval_note}. Anda kini bebas menambah atau menghapus mata kuliah. Setelah selesai, pastikan klik tombol <strong>"Ajukan KRS Sekarang"</strong> untuk verifikasi ulang.
            </p>
          </div>
        </div>
      )}

      {/* Approval/Rejection Notice if regular note */}
      {krs?.approval_note && !isApproved && !isRevisionRequested && !(isDraft && krs.approval_note.toLowerCase().includes('izin')) && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-800 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 text-[#133E87] mt-0.5" />
          <div>
            <p className="font-bold text-[#133E87]">Catatan Verifikator ({krs.approved_by || 'Dosen Wali'}):</p>
            <p className="mt-0.5 text-slate-600">{krs.approval_note}</p>
          </div>
        </div>
      )}

      {/* ADMIN & LECTURER VIEW: KRS Verification Table */}
      {(isAdmin || isLecturer) && (
        <div className="dashboard-card p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Verifikasi Pengajuan KRS Mahasiswa
              </h3>
              <p className="text-xs text-slate-500">
                Persetujuan rencana studi semester dan manajemen perizinan ubah KRS
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#133E87]">
              Total: {allEnrollments.length} KRS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Mahasiswa</th>
                  <th className="py-3 px-3">Semester</th>
                  <th className="py-3 px-3 text-center">Beban SKS</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Catatan / Waktu</th>
                  <th className="py-3 px-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {(Array.isArray(allEnrollments) ? allEnrollments : []).map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{enr.student_name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{enr.student_nim}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {enr.semester} {enr.academic_year}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                        {enr.total_sks} / {enr.max_sks} SKS
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(enr.status)}
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-[200px] truncate">
                      {enr.approval_note || (enr.submitted_at ? 'Menunggu verifikasi' : 'Draft')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {enr.status === 'SUBMITTED' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={CheckCircle2}
                            onClick={() => onApproveKRS(enr.id)}
                          >
                            Setujui
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={XCircle}
                            onClick={() => onRejectKRS(enr.id)}
                          >
                            Tolak
                          </Button>
                        </div>
                      ) : enr.status === 'REVISION_REQUESTED' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Unlock}
                            onClick={() => onUnlockKRS(enr.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Izinkan Ubah (Buka Kunci)
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={XCircle}
                            onClick={() => onRejectKRS(enr.id)}
                          >
                            Tolak Izin
                          </Button>
                        </div>
                      ) : enr.status === 'APPROVED' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Unlock}
                            onClick={() => onUnlockKRS(enr.id)}
                            title="Buka kunci agar mahasiswa dapat mengubah atau menambah mata kuliah"
                          >
                            Buka Kunci
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Draft aktif</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STUDENT KRS PICKER LAYOUT (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Selected Courses in KRS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="dashboard-card p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Daftar Mata Kuliah dalam KRS
                  {isApproved && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3 text-[#133E87]" /> Terkunci
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  Mata kuliah yang Anda rencanakan untuk diambil semester ini
                </p>
              </div>

              {/* SKS Summary Pill */}
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Total Beban</span>
                <span className="text-base font-extrabold text-[#133E87]">
                  {usedSks} <span className="text-xs text-slate-500 font-normal">/ {maxSks} SKS</span>
                </span>
              </div>
            </div>

            {krs?.items?.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">KRS masih kosong</p>
                <p className="text-xs text-slate-400 mt-1">
                  Pilih mata kuliah dari daftar kelas yang tersedia di sebelah kanan.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {krs?.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-[#133E87] bg-blue-50 px-2 py-0.5 rounded-md">
                          {item.course_code}
                        </span>
                        <Badge variant="primary" size="sm">
                          Kelompok {item.class_code}
                        </Badge>
                        <span className="text-xs font-bold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-md text-amber-800">
                          {item.sks} SKS
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {item.course_name}
                      </h4>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-[#133E87]" />
                        {item.schedule_day}, {item.schedule_time} WIB • Ruang {item.room_code}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Dosen: {item.lecturer_name}
                      </p>
                    </div>

                    {isEditable ? (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus dari KRS"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : isApproved ? (
                      <span
                        className="p-2 rounded-xl text-slate-300 bg-slate-100/60"
                        title="KRS Terkunci. Ajukan Izin Ubah KRS jika ingin membatalkan mata kuliah ini."
                      >
                        <Lock className="w-4 h-4 text-slate-400" />
                      </span>
                    ) : (
                      <span
                        className="p-2 rounded-xl text-slate-300"
                        title="KRS sedang diproses verifikasi."
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Action Bar */}
            {isEditable && krs?.items?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Pastikan tidak ada bentrok waktu sebelum mengajukan.
                </span>
                <Button
                  variant="gold"
                  size="md"
                  icon={Send}
                  onClick={onSubmitKRS}
                >
                  Ajukan KRS Sekarang
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Available Classes to Pick */}
        <div className="lg:col-span-5 space-y-6">
          <div className="dashboard-card p-6 border border-slate-200/80 shadow-xs">
            <div className="pb-3 border-b border-slate-100 mb-4 space-y-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Pilihan Kelas Tersedia
                  {isApproved && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                      Input Ditutup (Terkunci)
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  {isApproved
                    ? 'KRS telah disetujui resmi. Ajukan izin ubah KRS untuk memilih mata kuliah tambahan.'
                    : 'Klik tombol + Ambil untuk mendaftarkan kelas ke KRS Anda.'}
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex gap-2">
                <div className="grow">
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    onClear={() => setSearch('')}
                    placeholder="Cari matkul atau kode..."
                  />
                </div>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">Semua Hari</option>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredClasses.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Tidak ditemukan kelas yang cocok dengan pencarian.
                </div>
              ) : (
                filteredClasses.map((cls) => {
                  const isSelected = krs?.items?.some(i => i.course_id === cls.course_id)
                  const isOverQuota = usedSks + cls.sks > maxSks

                  return (
                    <div
                      key={cls.id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 shadow-2xs transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] font-mono font-bold text-[#133E87]">
                              {cls.course_code}
                            </span>
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded">
                              {cls.sks} SKS
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">
                            {cls.course_name}
                          </h4>
                        </div>

                        {isEditable ? (
                          <Button
                            variant={isSelected ? 'secondary' : 'primary'}
                            size="sm"
                            disabled={isSelected || (!isSelected && isOverQuota)}
                            onClick={() => onAddClass(cls)}
                          >
                            {isSelected ? 'Terpilih' : '+ Ambil'}
                          </Button>
                        ) : isApproved ? (
                          <span title="KRS telah diverifikasi dan terkunci. Ajukan Izin Ubah KRS terlebih dahulu jika ingin menambah mata kuliah ini.">
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled
                              icon={Lock}
                              className="opacity-60 cursor-not-allowed"
                            >
                              Terkunci
                            </Button>
                          </span>
                        ) : (
                          <span title="KRS sedang dalam proses verifikasi.">
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled
                              icon={Clock}
                              className="opacity-60 cursor-not-allowed"
                            >
                              Menunggu
                            </Button>
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-0.5 bg-slate-50 p-2 rounded-xl">
                        <p className="font-medium text-slate-700">
                          Kelompok: <span className="font-bold text-[#133E87]">{cls.class_code}</span> ({cls.room_code})
                        </p>
                        <p>Jadwal: {cls.schedule_day}, {cls.time_slot} WIB</p>
                        <p>Kapasitas: {cls.enrolled_count} / {cls.max_capacity} Mahasiswa</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REVISION REQUEST MODAL (Permohonan Izin Ubah / Tambah KRS) */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#133E87]">
                  <FileEdit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Permohonan Izin Ubah / Tambah KRS
                  </h3>
                  <p className="text-xs text-slate-500">
                    KRS Semester Genap 2025/2026 • Universitas Dian Nuswantoro
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-slate-700">
                <p className="font-semibold text-[#133E87] mb-1">Ketentuan Perubahan Rencana Studi:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                  <li>KRS yang telah disetujui berstatus terkunci demi kepastian kuota kelas.</li>
                  <li>Setelah permohonan dikirim, Dosen Wali akan meninjau alasan dan membuka kunci KRS Anda.</li>
                  <li>Setelah kunci dibuka, status menjadi Draft dan Anda dapat menambah atau mengurangi mata kuliah.</li>
                </ul>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kategori Alasan Permohonan:
                </label>
                <select
                  value={revisionCategory}
                  onChange={(e) => setRevisionCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#133E87]"
                >
                  <option value="Ingin menambah mata kuliah pilihan baru">Ingin menambah mata kuliah pilihan baru</option>
                  <option value="Penyesuaian jadwal kuliah dengan magang / kerja">Penyesuaian jadwal kuliah dengan magang / kerja</option>
                  <option value="Pindah kelas / kelompok mata kuliah karena bentrok">Pindah kelas / kelompok mata kuliah karena bentrok</option>
                  <option value="Kelebihan / kekurangan beban SKS kurikulum">Kelebihan / kekurangan beban SKS kurikulum</option>
                  <option value="Lainnya">Lainnya (Tuliskan alasan spesifik di bawah)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan & Rincian Tambahan:
                </label>
                <textarea
                  rows={3}
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Contoh: Ingin menambah 1 matkul pilihan Kecerdasan Buatan (3 SKS) karena kuota SKS masih mencukupi..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#133E87]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsRevisionModalOpen(false)}
                disabled={isSubmittingRevision}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={Send}
                disabled={isSubmittingRevision}
                onClick={async () => {
                  setIsSubmittingRevision(true)
                  try {
                    const finalReason = revisionNote.trim()
                      ? `${revisionCategory} - ${revisionNote.trim()}`
                      : revisionCategory
                    await onRequestRevision(finalReason)
                    setIsRevisionModalOpen(false)
                    setRevisionNote('')
                  } finally {
                    setIsSubmittingRevision(false)
                  }
                }}
              >
                {isSubmittingRevision ? 'Mengirim...' : 'Kirim Permohonan Izin'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
