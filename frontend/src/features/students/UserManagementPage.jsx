import React, { useState } from 'react'
import {
  Users,
  Search,
  Plus,
  Shield,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Lock,
  MoreVertical
} from 'lucide-react'
import { INITIAL_USERS } from '../../constants/mockData'
import { Badge } from '../../components/atoms/Badge'
import { Button } from '../../components/atoms/Button'
import { SearchBar } from '../../components/molecules/SearchBar'

export function UserManagementPage() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  const userList = Array.isArray(users) ? users : []
  const filtered = userList.filter(u => {
    const fullName = u.full_name || ''
    const username = u.username || ''
    const email = u.email || ''
    const matchesSearch = fullName.toLowerCase().includes(search.toLowerCase()) ||
                          username.toLowerCase().includes(search.toLowerCase()) ||
                          email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#133E87]" />
            Manajemen Pengguna & Hak Akses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola akun Mahasiswa, Dosen Pengajar, dan Staf Administrasi Kampus (RBAC)
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Cari nama, email, username..."
          />
        </div>
      </div>

      <div className="dashboard-card p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4 overflow-x-auto">
          {['ALL', 'MAHASISWA', 'DOSEN', 'ADMIN'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
                roleFilter === r
                  ? 'bg-[#133E87] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'ALL' ? 'Semua Pengguna' : r}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Nama Lengkap & Akun</th>
                <th className="py-3 px-3">Email Kampus</th>
                <th className="py-3 px-3 text-center">Hak Akses (Role)</th>
                <th className="py-3 px-3">Nomor Induk</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {(Array.isArray(filtered) ? filtered : []).map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{item.full_name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">@{item.username}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">
                    {item.email}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={item.role === 'ADMIN' ? 'gold' : item.role === 'DOSEN' ? 'purple' : 'primary'}
                      size="sm"
                    >
                      {item.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-700">
                    {item.student_profile?.nim || item.lecturer_profile?.nidn || '-'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button variant="outline" size="sm">
                      Kelola
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
