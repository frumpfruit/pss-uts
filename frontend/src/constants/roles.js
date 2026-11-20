export const ROLES = {
  ADMIN: 'ADMIN',
  DOSEN: 'DOSEN',
  MAHASISWA: 'MAHASISWA',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator Akademik',
  [ROLES.DOSEN]: 'Dosen Pengajar',
  [ROLES.MAHASISWA]: 'Mahasiswa',
}

export const KRS_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

export const KRS_STATUS_LABELS = {
  [KRS_STATUS.DRAFT]: 'Draft / Belum Diajukan',
  [KRS_STATUS.SUBMITTED]: 'Diajukan (Menunggu Verifikasi)',
  [KRS_STATUS.APPROVED]: 'Disetujui',
  [KRS_STATUS.REJECTED]: 'Perlu Perbaikan / Ditolak',
}

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  SICK: 'SICK',
  EXCUSED: 'EXCUSED',
  ABSENT: 'ABSENT',
}

export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Hadir',
  [ATTENDANCE_STATUS.SICK]: 'Sakit',
  [ATTENDANCE_STATUS.EXCUSED]: 'Izin',
  [ATTENDANCE_STATUS.ABSENT]: 'Alpa',
}
