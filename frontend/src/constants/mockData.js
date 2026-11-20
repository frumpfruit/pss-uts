export const INITIAL_USERS = [
  {
    id: 'usr-student-01',
    username: 'aryapratama',
    email: 'arya.pratama@mhs.dinus.ac.id',
    password: 'password123',
    role: 'MAHASISWA',
    first_name: 'Arya',
    last_name: 'Pratama',
    full_name: 'Arya Pratama',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    phone_number: '081234567890',
    student_profile: {
      id: 'std-01',
      nim: 'A11.2023.14920',
      study_program_id: 'sp-ti',
      study_program_name: 'S1 Teknik Informatika',
      faculty_name: 'Fakultas Ilmu Komputer',
      current_semester: 4,
      academic_year: '2025/2026',
      gpa: 3.82,
      ips: 3.90,
      total_sks_completed: 72,
      target_sks: 144,
      academic_status: 'AKTIF',
      admission_year: 2023,
      rank: 3,
      total_cohort: 120,
    }
  },
  {
    id: 'usr-lecturer-01',
    username: 'budisantoso',
    email: 'budi.santoso@dsn.dinus.ac.id',
    password: 'password123',
    role: 'DOSEN',
    first_name: 'Dr. Ir. Budi',
    last_name: 'Santoso, M.Kom.',
    full_name: 'Dr. Ir. Budi Santoso, M.Kom.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    phone_number: '081987654321',
    lecturer_profile: {
      id: 'lec-01',
      nidn: '0612087501',
      nip: '197508122003121001',
      academic_title: 'Dr. Ir. M.Kom.',
      faculty_name: 'Fakultas Ilmu Komputer',
      study_program_name: 'S1 Teknik Informatika',
      status: 'AKTIF'
    }
  },
  {
    id: 'usr-admin-01',
    username: 'adminbaak',
    email: 'baak@dinus.ac.id',
    password: 'password123',
    role: 'ADMIN',
    first_name: 'Biro Administrasi',
    last_name: 'Akademik (BAAK)',
    full_name: 'Admin Akademik BAAK UDINUS',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    phone_number: '0243517261',
  }
]

export const INITIAL_FACULTIES = [
  { id: 'fac-fik', code: 'FIK', name: 'Fakultas Ilmu Komputer' },
  { id: 'fac-feb', code: 'FEB', name: 'Fakultas Ekonomi dan Bisnis' },
  { id: 'fac-ft', code: 'FT', name: 'Fakultas Teknik' },
  { id: 'fac-fib', code: 'FIB', name: 'Fakultas Ilmu Budaya' },
]

export const INITIAL_STUDY_PROGRAMS = [
  { id: 'sp-ti', faculty_id: 'fac-fik', code: 'A11', name: 'Teknik Informatika', degree: 'S1' },
  { id: 'sp-si', faculty_id: 'fac-fik', code: 'A12', name: 'Sistem Informasi', degree: 'S1' },
  { id: 'sp-dkv', faculty_id: 'fac-fik', code: 'A14', name: 'Desain Komunikasi Visual', degree: 'S1' },
  { id: 'sp-man', faculty_id: 'fac-feb', code: 'B11', name: 'Manajemen', degree: 'S1' },
]

export const INITIAL_COURSES = [
  {
    id: 'crs-01',
    code: 'A11.54301',
    name: 'Rekayasa Perangkat Lunak',
    sks: 3,
    semester_recommended: 4,
    study_program_name: 'S1 Teknik Informatika',
    is_mandatory: true,
    prerequisite: 'Pemrograman Berorientasi Objek',
    description: 'Metodologi pengembangan perangkat lunak modern, arsitektur microservices, SDLC agile, dan pengujian sistem.'
  },
  {
    id: 'crs-02',
    code: 'A11.54302',
    name: 'Struktur Data & Algoritma',
    sks: 4,
    semester_recommended: 2,
    study_program_name: 'S1 Teknik Informatika',
    is_mandatory: true,
    prerequisite: 'Dasar Pemrograman',
    description: 'Struktur data linear dan non-linear, kompleksitas algoritma Big-O, graf, pohon pencarian biner.'
  },
  {
    id: 'crs-03',
    code: 'A11.54401',
    name: 'Pemrograman Web Lanjut',
    sks: 3,
    semester_recommended: 4,
    study_program_name: 'S1 Teknik Informatika',
    is_mandatory: true,
    prerequisite: 'Pemrograman Web Dasar',
    description: 'Fullstack modern dengan React, Next.js, REST API, state management, dan cloud deployment.'
  },
  {
    id: 'crs-04',
    code: 'A11.54402',
    name: 'Sistem Basis Data Terdistribusi',
    sks: 3,
    semester_recommended: 4,
    study_program_name: 'S1 Teknik Informatika',
    is_mandatory: true,
    prerequisite: 'Basis Data',
    description: 'Relational PostgreSQL, normalisasi, replikasi database, sharding, transaksi ACID, dan NoSQL.'
  },
  {
    id: 'crs-05',
    code: 'A11.54501',
    name: 'Jaringan Komputer & Keamanan Siber',
    sks: 3,
    semester_recommended: 4,
    study_program_name: 'S1 Teknik Informatika',
    is_mandatory: true,
    prerequisite: 'Sistem Operasi',
    description: 'Protokol TCP/IP, routing, switching, kriptografi, JWT, firewall, dan mitigasi ancaman siber.'
  },
  {
    id: 'crs-06',
    code: 'A11.54502',
    name: 'Kecerdasan Buatan & Machine Learning',
    sks: 3,
    semester_recommended: 4,
    study_program_name: 'S1 Teknik Informatika',
    is_mandatory: false,
    prerequisite: 'Matematika Diskrit',
    description: 'Algoritma machine learning, neural networks, supervised & unsupervised learning dengan Python.'
  },
  {
    id: 'crs-07',
    code: 'A11.54601',
    name: 'Interaksi Manusia dan Komputer (UI/UX)',
    sks: 2,
    semester_recommended: 4,
    study_program_name: 'S1 Teknik Informatika',
    is_mandatory: true,
    prerequisite: null,
    description: 'Prinsip desain UX modern, design system, prototyping Figma, usability testing, dan aksesibilitas.'
  },
]

export const INITIAL_CLASSES = [
  {
    id: 'cls-01',
    course_id: 'crs-01',
    course_code: 'A11.54301',
    course_name: 'Rekayasa Perangkat Lunak',
    class_code: 'A11.4401',
    sks: 3,
    lecturer_id: 'lec-01',
    lecturer_name: 'Dr. Ir. Budi Santoso, M.Kom.',
    max_capacity: 45,
    enrolled_count: 42,
    room_code: 'H.4.1',
    building: 'Gedung H',
    schedule_day: 'Senin',
    start_time: '08:40',
    end_time: '11:10',
    time_slot: '08:40 - 11:10'
  },
  {
    id: 'cls-02',
    course_id: 'crs-03',
    course_code: 'A11.54401',
    course_name: 'Pemrograman Web Lanjut',
    class_code: 'A11.4402',
    sks: 3,
    lecturer_id: 'lec-01',
    lecturer_name: 'Dr. Ir. Budi Santoso, M.Kom.',
    max_capacity: 40,
    enrolled_count: 38,
    room_code: 'D.2.A',
    building: 'Gedung D Lab Komputer',
    schedule_day: 'Selasa',
    start_time: '10:20',
    end_time: '12:50',
    time_slot: '10:20 - 12:50'
  },
  {
    id: 'cls-03',
    course_id: 'crs-04',
    course_code: 'A11.54402',
    course_name: 'Sistem Basis Data Terdistribusi',
    class_code: 'A11.4401',
    sks: 3,
    lecturer_id: 'lec-02',
    lecturer_name: 'Prof. Dr. Supriyono, M.Cs.',
    max_capacity: 45,
    enrolled_count: 40,
    room_code: 'H.4.2',
    building: 'Gedung H',
    schedule_day: 'Rabu',
    start_time: '07:00',
    end_time: '09:30',
    time_slot: '07:00 - 09:30'
  },
  {
    id: 'cls-04',
    course_id: 'crs-05',
    course_code: 'A11.54501',
    course_name: 'Jaringan Komputer & Keamanan Siber',
    class_code: 'A11.4403',
    sks: 3,
    lecturer_id: 'lec-03',
    lecturer_name: 'Ahmad Fauzi, M.T.',
    max_capacity: 40,
    enrolled_count: 39,
    room_code: 'D.3.B',
    building: 'Gedung D Lab Jaringan',
    schedule_day: 'Kamis',
    start_time: '13:00',
    end_time: '15:30',
    time_slot: '13:00 - 15:30'
  },
  {
    id: 'cls-05',
    course_id: 'crs-06',
    course_code: 'A11.54502',
    course_name: 'Kecerdasan Buatan & Machine Learning',
    class_code: 'A11.4401',
    sks: 3,
    lecturer_id: 'lec-04',
    lecturer_name: 'Dr. Retno Kusumaningrum, M.Kom.',
    max_capacity: 45,
    enrolled_count: 35,
    room_code: 'H.5.1',
    building: 'Gedung H',
    schedule_day: 'Jumat',
    start_time: '08:00',
    end_time: '10:30',
    time_slot: '08:00 - 10:30'
  },
  {
    id: 'cls-06',
    course_id: 'crs-07',
    course_code: 'A11.54601',
    course_name: 'Interaksi Manusia dan Komputer (UI/UX)',
    class_code: 'A11.4402',
    sks: 2,
    lecturer_id: 'lec-05',
    lecturer_name: 'Dian Permatasari, M.Ds.',
    max_capacity: 45,
    enrolled_count: 44,
    room_code: 'H.3.2',
    building: 'Gedung H',
    schedule_day: 'Jumat',
    start_time: '13:30',
    end_time: '15:10',
    time_slot: '13:30 - 15:10'
  },
]

export const INITIAL_ENROLLMENTS = [
  {
    id: 'enr-01',
    student_id: 'usr-student-01',
    student_nim: 'A11.2023.14920',
    student_name: 'Arya Pratama',
    academic_year: '2025/2026',
    semester: 'GENAP',
    status: 'APPROVED',
    total_sks: 17,
    max_sks: 24,
    approved_by: 'Dr. Ir. Budi Santoso, M.Kom. (Dosen Wali)',
    approval_note: 'KRS telah disetujui untuk Semester Genap 2025/2026.',
    submitted_at: '2026-02-10T09:30:00Z',
    approved_at: '2026-02-11T14:15:00Z',
    items: [
      {
        id: 'item-01',
        course_id: 'crs-01',
        course_code: 'A11.54301',
        course_name: 'Rekayasa Perangkat Lunak',
        class_id: 'cls-01',
        class_code: 'A11.4401',
        sks: 3,
        lecturer_name: 'Dr. Ir. Budi Santoso, M.Kom.',
        schedule_day: 'Senin',
        schedule_time: '08:40 - 11:10',
        room_code: 'H.4.1'
      },
      {
        id: 'item-02',
        course_id: 'crs-03',
        course_code: 'A11.54401',
        course_name: 'Pemrograman Web Lanjut',
        class_id: 'cls-02',
        class_code: 'A11.4402',
        sks: 3,
        lecturer_name: 'Dr. Ir. Budi Santoso, M.Kom.',
        schedule_day: 'Selasa',
        schedule_time: '10:20 - 12:50',
        room_code: 'D.2.A'
      },
      {
        id: 'item-03',
        course_id: 'crs-04',
        course_code: 'A11.54402',
        course_name: 'Sistem Basis Data Terdistribusi',
        class_id: 'cls-03',
        class_code: 'A11.4401',
        sks: 3,
        lecturer_name: 'Prof. Dr. Supriyono, M.Cs.',
        schedule_day: 'Rabu',
        schedule_time: '07:00 - 09:30',
        room_code: 'H.4.2'
      },
      {
        id: 'item-04',
        course_id: 'crs-05',
        course_code: 'A11.54501',
        course_name: 'Jaringan Komputer & Keamanan Siber',
        class_id: 'cls-04',
        class_code: 'A11.4403',
        sks: 3,
        lecturer_name: 'Ahmad Fauzi, M.T.',
        schedule_day: 'Kamis',
        schedule_time: '13:00 - 15:30',
        room_code: 'D.3.B'
      },
      {
        id: 'item-05',
        course_id: 'crs-06',
        course_code: 'A11.54502',
        course_name: 'Kecerdasan Buatan & Machine Learning',
        class_id: 'cls-05',
        class_code: 'A11.4401',
        sks: 3,
        lecturer_name: 'Dr. Retno Kusumaningrum, M.Kom.',
        schedule_day: 'Jumat',
        schedule_time: '08:00 - 10:30',
        room_code: 'H.5.1'
      },
      {
        id: 'item-06',
        course_id: 'crs-07',
        course_code: 'A11.54601',
        course_name: 'Interaksi Manusia dan Komputer (UI/UX)',
        class_id: 'cls-06',
        class_code: 'A11.4402',
        sks: 2,
        lecturer_name: 'Dian Permatasari, M.Ds.',
        schedule_day: 'Jumat',
        schedule_time: '13:30 - 15:10',
        room_code: 'H.3.2'
      }
    ]
  },
  {
    id: 'enr-02',
    student_id: 'usr-student-02',
    student_nim: 'A11.2023.14925',
    student_name: 'Rian Syahputra',
    academic_year: '2025/2026',
    semester: 'GENAP',
    status: 'SUBMITTED',
    total_sks: 18,
    max_sks: 24,
    approved_by: null,
    approval_note: null,
    submitted_at: '2026-03-01T10:15:00Z',
    approved_at: null,
    items: [
      {
        id: 'item-21',
        course_id: 'crs-01',
        course_code: 'A11.54301',
        course_name: 'Rekayasa Perangkat Lunak',
        class_id: 'cls-01',
        class_code: 'A11.4401',
        sks: 3,
        lecturer_name: 'Dr. Ir. Budi Santoso, M.Kom.',
        schedule_day: 'Senin',
        schedule_time: '08:40 - 11:10',
        room_code: 'H.4.1'
      },
      {
        id: 'item-22',
        course_id: 'crs-03',
        course_code: 'A11.54401',
        course_name: 'Pemrograman Web Lanjut',
        class_id: 'cls-02',
        class_code: 'A11.4402',
        sks: 3,
        lecturer_name: 'Dr. Ir. Budi Santoso, M.Kom.',
        schedule_day: 'Selasa',
        schedule_time: '10:20 - 12:50',
        room_code: 'D.2.A'
      }
    ]
  }
]

export const INITIAL_GRADES = [
  {
    id: 'grd-01',
    student_id: 'usr-student-01',
    student_nim: 'A11.2023.14920',
    student_name: 'Arya Pratama',
    class_id: 'cls-01',
    class_code: 'A11.4401',
    course_id: 'crs-01',
    course_code: 'A11.54301',
    course_name: 'Rekayasa Perangkat Lunak',
    sks: 3,
    assignment_score: 90,
    midterm_score: 88,
    final_score: 92,
    attendance_score: 95,
    final_numeric_score: 90.7,
    letter_grade: 'A',
    grade_point: 4.0,
    is_published: true,
    published_at: '2026-01-20',
    evaluation_type: 'Evaluasi Semester'
  },
  {
    id: 'grd-02',
    student_id: 'usr-student-01',
    student_nim: 'A11.2023.14920',
    student_name: 'Arya Pratama',
    class_id: 'cls-03',
    class_code: 'A11.4401',
    course_id: 'crs-04',
    course_code: 'A11.54402',
    course_name: 'Sistem Basis Data Terdistribusi',
    sks: 3,
    assignment_score: 86,
    midterm_score: 84,
    final_score: 88,
    attendance_score: 90,
    final_numeric_score: 86.6,
    letter_grade: 'A',
    grade_point: 4.0,
    is_published: true,
    published_at: '2026-01-22',
    evaluation_type: 'Evaluasi Semester'
  },
  {
    id: 'grd-03',
    student_id: 'usr-student-01',
    student_nim: 'A11.2023.14920',
    student_name: 'Arya Pratama',
    class_id: 'cls-04',
    class_code: 'A11.4403',
    course_id: 'crs-05',
    course_code: 'A11.54501',
    course_name: 'Jaringan Komputer & Keamanan Siber',
    sks: 3,
    assignment_score: 82,
    midterm_score: 79,
    final_score: 84,
    attendance_score: 85,
    final_numeric_score: 82.2,
    letter_grade: 'AB',
    grade_point: 3.5,
    is_published: true,
    published_at: '2026-01-24',
    evaluation_type: 'Evaluasi Semester'
  },
  {
    id: 'grd-04',
    student_id: 'usr-student-01',
    student_nim: 'A11.2023.14920',
    student_name: 'Arya Pratama',
    class_id: 'cls-05',
    class_code: 'A11.4401',
    course_id: 'crs-06',
    course_code: 'A11.54502',
    course_name: 'Kecerdasan Buatan & Machine Learning',
    sks: 3,
    assignment_score: 92,
    midterm_score: 85,
    final_score: 89,
    attendance_score: 95,
    final_numeric_score: 89.0,
    letter_grade: 'A',
    grade_point: 4.0,
    is_published: true,
    published_at: '2026-01-25',
    evaluation_type: 'Evaluasi Semester'
  },
  {
    id: 'grd-05',
    student_id: 'usr-student-01',
    student_nim: 'A11.2023.14920',
    student_name: 'Arya Pratama',
    class_id: 'cls-06',
    class_code: 'A11.4402',
    course_id: 'crs-07',
    course_code: 'A11.54601',
    course_name: 'Interaksi Manusia dan Komputer (UI/UX)',
    sks: 2,
    assignment_score: 95,
    midterm_score: 90,
    final_score: 94,
    attendance_score: 100,
    final_numeric_score: 93.6,
    letter_grade: 'A',
    grade_point: 4.0,
    is_published: true,
    published_at: '2026-01-26',
    evaluation_type: 'Evaluasi Semester'
  },
  {
    id: 'grd-06',
    student_id: 'usr-student-01',
    student_nim: 'A11.2023.14920',
    student_name: 'Arya Pratama',
    class_id: 'cls-02',
    class_code: 'A11.4402',
    course_id: 'crs-03',
    course_code: 'A11.54401',
    course_name: 'Pemrograman Web Lanjut',
    sks: 3,
    assignment_score: 88,
    midterm_score: 85,
    final_score: 90,
    attendance_score: 92,
    final_numeric_score: 88.3,
    letter_grade: 'A',
    grade_point: 4.0,
    is_published: true,
    published_at: '2026-01-28',
    evaluation_type: 'Evaluasi Semester'
  }
]

export const INITIAL_ATTENDANCE_SESSIONS = [
  {
    id: 'ses-01',
    class_id: 'cls-01',
    class_code: 'A11.4401',
    course_code: 'A11.54301',
    course_name: 'Rekayasa Perangkat Lunak',
    lecturer_id: 'usr-lecturer-01',
    lecturer_name: 'Dr. Ir. Budi Santoso, M.Kom.',
    room_code: 'D.2.A',
    session_number: 8,
    topic: 'Implementasi Architectural Pattern Microservices & Gateway Routing',
    date: new Date().toISOString().split('T')[0],
    start_time: '10:20',
    end_time: '12:50',
    status: 'OPEN',
    created_at: new Date().toISOString(),
    records: [
      { id: 'rec-01', student_id: 'usr-student-01', nim: 'A11.2023.14920', name: 'Arya Pratama', status: 'NOT_RECORDED', timestamp: null, notes: '' },
      { id: 'rec-02', student_id: 'usr-student-02', nim: 'A11.2023.14925', name: 'Rian Syahputra', status: 'PRESENT', timestamp: '10:24 WIB', notes: '' },
      { id: 'rec-03', student_id: 'usr-student-03', nim: 'A11.2023.14930', name: 'Siti Nurhaliza', status: 'EXCUSED', timestamp: null, notes: 'Izin lomba akademik' },
      { id: 'rec-04', student_id: 'usr-student-04', nim: 'A11.2023.14935', name: 'Dimas Setiawan', status: 'PRESENT', timestamp: '10:22 WIB', notes: '' },
      { id: 'rec-05', student_id: 'usr-student-05', nim: 'A11.2023.14940', name: 'Anisa Rahmawati', status: 'SICK', timestamp: null, notes: 'Surat dokter terlampir' }
    ]
  },
  {
    id: 'ses-02',
    class_id: 'cls-02',
    class_code: 'A11.4402',
    course_code: 'A11.54401',
    course_name: 'Pemrograman Web Lanjut',
    lecturer_id: 'usr-lecturer-01',
    lecturer_name: 'Dr. Ir. Budi Santoso, M.Kom.',
    room_code: 'H.4.1',
    session_number: 8,
    topic: 'State Management & Asynchronous Data Fetching',
    date: new Date().toISOString().split('T')[0],
    start_time: '13:00',
    end_time: '15:30',
    status: 'OPEN',
    created_at: new Date().toISOString(),
    records: [
      { id: 'rec-06', student_id: 'usr-student-01', nim: 'A11.2023.14920', name: 'Arya Pratama', status: 'NOT_RECORDED', timestamp: null, notes: '' },
      { id: 'rec-07', student_id: 'usr-student-02', nim: 'A11.2023.14925', name: 'Rian Syahputra', status: 'PRESENT', timestamp: '13:05 WIB', notes: '' }
    ]
  }
]

export const INITIAL_ATTENDANCE_SUMMARY = {
  total_sessions: 24,
  present: 22,
  sick: 1,
  excused: 1,
  absent: 0,
  percentage: 92.5,
  is_warning: false
}

export const INITIAL_ATTENDANCE_COURSES = [
  {
    course_code: 'A11.54301',
    course_name: 'Rekayasa Perangkat Lunak',
    class_code: 'A11.4401',
    total_sessions: 8,
    present: 8,
    sick: 0,
    excused: 0,
    absent: 0,
    percentage: 100.0,
    is_warning: false
  },
  {
    course_code: 'A11.54401',
    course_name: 'Pemrograman Web Lanjut',
    class_code: 'A11.4402',
    total_sessions: 8,
    present: 7,
    sick: 1,
    excused: 0,
    absent: 0,
    percentage: 87.5,
    is_warning: false
  },
  {
    course_code: 'A11.54402',
    course_name: 'Sistem Basis Data Terdistribusi',
    class_code: 'A11.4401',
    total_sessions: 8,
    present: 7,
    sick: 0,
    excused: 1,
    absent: 0,
    percentage: 87.5,
    is_warning: false
  },
  {
    course_code: 'A11.54501',
    course_name: 'Jaringan Komputer & Keamanan Siber',
    class_code: 'A11.4403',
    total_sessions: 8,
    present: 8,
    sick: 0,
    excused: 0,
    absent: 0,
    percentage: 100.0,
    is_warning: false
  }
]

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-01',
    title: 'KRS Semester Genap 2025/2026 Disetujui',
    message: 'KRS Anda telah diverifikasi dan disetujui oleh Dosen Wali (Dr. Ir. Budi Santoso, M.Kom.). Silakan periksa jadwal perkuliahan Anda.',
    type: 'KRS_APPROVED',
    recipient_role: 'MAHASISWA',
    is_read: false,
    created_at: '2 jam yang lalu'
  },
  {
    id: 'notif-02',
    title: 'Nilai Akhir: Rekayasa Perangkat Lunak',
    message: 'Nilai akhir untuk mata kuliah Rekayasa Perangkat Lunak telah resmi dipublikasikan dengan predikat A (4.00).',
    type: 'GRADE_PUBLISHED',
    recipient_role: 'MAHASISWA',
    is_read: false,
    created_at: '1 hari yang lalu'
  },
  {
    id: 'notif-03',
    title: 'Pemberitahuan Jadwal Kuliah Pengganti',
    message: 'Pertemuan ke-7 mata kuliah Pemrograman Web Lanjut dialihkan ke Lab Komputer D.2.A pada hari Selasa pukul 10:20 WIB.',
    type: 'SCHEDULE_CHANGED',
    recipient_role: 'MAHASISWA',
    is_read: true,
    created_at: '3 hari yang lalu'
  },
  {
    id: 'notif-04',
    title: 'Pengajuan KRS Baru Menunggu Approval',
    message: 'Terdapat 3 pengajuan KRS mahasiswa baru yang menunggu verifikasi dan persetujuan Anda sebagai DPA/Admin.',
    type: 'KRS_SUBMITTED',
    recipient_role: 'ADMIN',
    is_read: false,
    created_at: '30 menit yang lalu'
  }
]

export const CAMPUS_ANNOUNCEMENTS = [
  {
    id: 'ann-01',
    title: 'Jadwal Ujian Tengah Semester (UTS) Genap 2025/2026',
    date: '15 Mei 2026',
    category: 'Akademik',
    content: 'Pelaksanaan UTS akan diselenggarakan mulai 25 Mei 2026. Mahasiswa wajib memiliki kehadiran minimal 75% untuk dapat mencetak Kartu Ujian.'
  },
  {
    id: 'ann-02',
    title: 'Pengumuman Beasiswa Prestasi & Bebas Biaya Kuliah',
    date: '12 Mei 2026',
    category: 'Kemahasiswaan',
    content: 'Pendaftaran beasiswa prestasi akademik semester genap dibuka bagi mahasiswa dengan IPK di atas 3.75 melalui portal BAAK UDINUS.'
  },
  {
    id: 'ann-03',
    title: 'Batas Akhir Pengumpulan Laporan Proyek Akhir',
    date: '10 Mei 2026',
    category: 'Tugas Akhir',
    content: 'Batas akhir submit laporan akhir Capstone Project dan Tugas Akhir gelombang I adalah 30 Mei 2026 melalui sistem repositori kampus.'
  }
]

export const INITIAL_TRANSCRIPT_HISTORY = [
  {
    semester_number: 1,
    academic_year: '2024/2025',
    semester_type: 'GANJIL',
    period: '2 September 2024 – 24 Januari 2025',
    status: 'SELESAI',
    total_sks: 20,
    ips: 3.80,
    courses: [
      { code: 'A11.54101', name: 'Kalkulus 1', sks: 3, grade: 'A', point: 4.0 },
      { code: 'A11.54102', name: 'Dasar Pemrograman', sks: 4, grade: 'A', point: 4.0 },
      { code: 'A11.54103', name: 'Logika Informatika', sks: 3, grade: 'A', point: 4.0 },
      { code: 'A11.54104', name: 'Pengantar Teknologi Informasi', sks: 3, grade: 'A', point: 4.0 },
      { code: 'UDS.101', name: 'Bahasa Inggris 1', sks: 2, grade: 'AB', point: 3.5 },
      { code: 'UDS.102', name: 'Pendidikan Pancasila', sks: 2, grade: 'A', point: 4.0 },
      { code: 'A11.54105', name: 'Fisika Dasar', sks: 3, grade: 'B', point: 3.0 },
    ]
  },
  {
    semester_number: 2,
    academic_year: '2024/2025',
    semester_type: 'GENAP',
    period: '17 Februari 2025 – 11 Juli 2025',
    status: 'SELESAI',
    total_sks: 22,
    ips: 3.73,
    courses: [
      { code: 'A11.54201', name: 'Algoritma & Pemrograman Lanjut', sks: 4, grade: 'A', point: 4.0 },
      { code: 'A11.54202', name: 'Struktur Data & Analisis Algoritma', sks: 3, grade: 'A', point: 4.0 },
      { code: 'A11.54203', name: 'Arsitektur & Organisasi Komputer', sks: 3, grade: 'AB', point: 3.5 },
      { code: 'A11.54204', name: 'Kalkulus 2', sks: 3, grade: 'B', point: 3.0 },
      { code: 'A11.54205', name: 'Matematika Diskrit', sks: 3, grade: 'A', point: 4.0 },
      { code: 'A11.54206', name: 'Sistem Operasi Komputer', sks: 3, grade: 'AB', point: 3.5 },
      { code: 'UDS.103', name: 'Pendidikan Kewarganegaraan', sks: 2, grade: 'A', point: 4.0 },
      { code: 'UDS.104', name: 'Pendidikan Agama', sks: 1, grade: 'A', point: 4.0 },
    ]
  },
  {
    semester_number: 3,
    academic_year: '2025/2026',
    semester_type: 'GANJIL',
    period: '1 September 2025 – 23 Januari 2026',
    status: 'SELESAI',
    total_sks: 21,
    ips: 3.93,
    courses: [
      { code: 'A11.54301', name: 'Pemrograman Berorientasi Objek', sks: 4, grade: 'A', point: 4.0 },
      { code: 'A11.54302', name: 'Sistem Manajemen Basis Data', sks: 3, grade: 'A', point: 4.0 },
      { code: 'A11.54303', name: 'Rekayasa Perangkat Lunak Dasar', sks: 3, grade: 'A', point: 4.0 },
      { code: 'A11.54304', name: 'Teori Bahasa & Otomata', sks: 3, grade: 'A', point: 4.0 },
      { code: 'A11.54305', name: 'Aljabar Linier & Matriks', sks: 3, grade: 'AB', point: 3.5 },
      { code: 'A11.54306', name: 'Statistika & Probabilitas', sks: 3, grade: 'A', point: 4.0 },
      { code: 'UDS.105', name: 'Bahasa Indonesia Ilmiah', sks: 2, grade: 'A', point: 4.0 },
    ]
  }
]
