export const CAMPUS_CONFIG = {
  name: 'Universitas Dian Nuswantoro',
  shortName: 'UDINUS',
  city: 'Semarang',
  tagline: 'For a Better Future',
  activeAcademicYear: '2025/2026',
  activeSemester: 'Genap',
  minimumAttendancePercentage: 75.0,
  maxSksDefault: 24,
}

export const GRADING_SCALE = [
  { letter: 'A', min: 85, point: 4.0, label: 'Sangat Baik' },
  { letter: 'AB', min: 80, point: 3.5, label: 'Lebih Dari Baik' },
  { letter: 'B', min: 70, point: 3.0, label: 'Baik' },
  { letter: 'BC', min: 65, point: 2.5, label: 'Lebih Dari Cukup' },
  { letter: 'C', min: 55, point: 2.0, label: 'Cukup' },
  { letter: 'D', min: 40, point: 1.0, label: 'Kurang' },
  { letter: 'E', min: 0, point: 0.0, label: 'Gagal' },
]

export const DAYS_OF_WEEK = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu'
]

export const GRADING_WEIGHTS = {
  assignment: 0.20, // 20%
  midterm: 0.30,    // 30%
  final: 0.40,      // 40%
  attendance: 0.10, // 10%
}
