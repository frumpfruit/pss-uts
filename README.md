# SIAKAD UDINUS — Enterprise Campus Operating System
### Sistem Informasi Akademik Berbasis Microservices Architecture

Platform sistem digital akademik perguruan tinggi modern, modular, dan terukur yang mengintegrasikan alur kerja **Mahasiswa**, **Dosen**, dan **Administrator BAAK** dalam satu ekosistem terpadu berstandar enterprise SaaS.

Dirancang dengan identitas visual khas **Universitas Dian Nuswantoro (UDINUS)**: **Biru Dongker (#0B2545 / #133E87)**, **Kuning Emas (#F59E0B)**, dan **Putih Bersih (#FFFFFF)**.

---

## 1. Arsitektur Sistem (Microservices)

Sistem mengadopsi pendekatan **Microservices Architecture** dengan *database-per-service pattern* dan Nginx API Gateway sebagai pintu gerbang (*single entry point*).

```
                            ┌────────────────────────────────────────┐
                            │    React 19 + Vite + Tailwind (Bun)    │
                            │        (Frontend Port 3000)            │
                            └───────────────────┬────────────────────┘
                                                │ REST API / JWT
                                                ▼
                            ┌────────────────────────────────────────┐
                            │      Nginx API Gateway (Port 8000)     │
                            └───────────────────┬────────────────────┘
                                                │
         ┌──────────────┬──────────────┬────────┴─────┬──────────────┬──────────────┐
         ▼              ▼              ▼              ▼              ▼              ▼
   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
   │   Auth    │  │ Academic  │  │Enrollment │  │   Grade   │  │Attendance │  │Notification│
   │  Service  │  │  Service  │  │   (KRS)   │  │  Service  │  │  Service  │  │  Service  │
   │ Port 8001 │  │ Port 8002 │  │ Port 8003 │  │ Port 8004 │  │ Port 8005 │  │ Port 8006 │
   └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
         │              │              │              │              │              │
         ▼              ▼              ▼              ▼              ▼              ▼
   ┌────────────────────────────────────────────────────────────────────────────────────┐
   │                       PostgreSQL 16 (Isolated DB per Service)                      │
   │   [siakad_auth_db, siakad_academic_db, siakad_enrollment_db, siakad_grade_db...]   │
   └────────────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ Redis 7 Broker/Cache  │
                                    └───────────────────────┘
```

### Domain Boundary & Tanggung Jawab Service:

1. **Auth & User Service (Port 8001)**: Autentikasi JWT, manajemen hak akses RBAC (Admin, Dosen, Mahasiswa), profil mahasiswa, dan profil dosen.
2. **Academic Service (Port 8002)**: Master data fakultas, program studi, tahun akademik, kurikulum, mata kuliah, alokasi kelas, ruangan, dan algoritma *schedule conflict detection*.
3. **Enrollment Service / KRS (Port 8003)**: Rencana studi mahasiswa, validasi kuota kelas, batas maksimum SKS, dan state machine alur persetujuan: `DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` / `REJECTED`.
4. **Grade Service (Port 8004)**: Formula pembobotan nilai (Tugas 20% + UTS 30% + UAS 40% + Presensi 10%), konversi nilai huruf (A, AB, B, BC, C, D, E), kalkulasi IPK/IPS, dan alur publikasi nilai.
5. **Attendance Service (Port 8005)**: Pembukaan sesi presensi dosen per pertemuan (1 s/d 14), pencatatan kehadiran (Hadir, Sakit, Izin, Alpa), formula persentase, dan *warning alert* jika presensi < 75%.
6. **Notification Service (Port 8006)**: Notifikasi real-time kampus (KRS disetujui/ditolak, nilai dipublikasi, peringatan presensi rendah, perubahan jadwal).

---

## 2. Struktur Repository

```
siakad-platform/
├── frontend/                     # React 19 + Vite + Tailwind CSS + Bun
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/            # Button, Input, Select, Badge, Avatar, Typography, Spinner
│   │   │   ├── molecules/        # StatCard, SearchBar, FormField, UserMenu, QuickAccessCard
│   │   │   ├── organisms/        # Sidebar, Topbar, StudentHeroBanner, RecentResultsTable,
│   │   │   │                     # MiniCalendar, NoticeBoard, PerformanceDonutChart, NotificationPanel
│   │   │   └── templates/        # DashboardTemplate
│   │   ├── features/
│   │   │   ├── auth/             # LoginPage (dengan 1-Click Role Demo Switcher)
│   │   │   ├── dashboard/        # StudentDashboard, LecturerDashboard, AdminDashboard
│   │   │   ├── krs/              # KRSPage (Interactive Study Plan & Admin Review)
│   │   │   ├── grades/           # GradesPage (Transkrip KHS & Live Grade Input Sheet)
│   │   │   ├── attendance/       # AttendancePage (Student Summary & Session Checklist)
│   │   │   ├── schedules/        # SchedulePage (Weekly Timetable & Room Filter)
│   │   │   ├── courses/          # CourseCatalogPage (Katalog Kurikulum & Prasyarat)
│   │   │   ├── students/         # StudentProfilePage, UserManagementPage
│   │   │   └── notifications/    # NoticeListPage (Papan Pengumuman Kampus)
│   │   ├── store/                # AuthContext (Role State & Demo Switcher)
│   │   ├── services/             # apiService.js, mockServer.js (Stateful Mock Engine)
│   │   ├── api/                  # client.js (Axios JWT Interceptor)
│   │   ├── constants/            # mockData.js, roles.js, academic.js
│   │   └── routes/               # AppRoutes.jsx
│   ├── package.json
│   └── vite.config.js
│
├── services/                     # Django REST Framework Microservices
│   ├── auth-service/
│   ├── academic-service/
│   ├── enrollment-service/
│   ├── grade-service/
│   ├── attendance-service/
│   └── notification-service/
│
├── gateway/                      # Nginx Reverse Proxy / API Gateway
│   ├── nginx.conf
│   └── Dockerfile
│
├── infrastructure/               # Database initialization & Docker config
│   ├── postgres/init-databases.sql
│   └── docker/
│
├── docker-compose.yml            # Multi-container orchestration
├── .env.example
└── README.md
```

---

## 3. Cara Menjalankan Aplikasi

### A. Menjalankan Frontend Secara Langsung (Menggunakan Bun)
Aplikasi frontend telah dilengkapi dengan *Stateful Campus Engine* yang mengimplementasikan seluruh kontrak REST API dan *realistic seed data*, sehingga dapat langsung dijalankan tanpa setup database eksternal:

```bash
cd frontend
bun run dev
```

Buka browser di: **`http://localhost:3000/`**

### Kredensial Akun Bawaan (1-Click Login):
Pada halaman login, Anda dapat langsung mengklik tombol **1-Click Demo Login** atau menggunakan:

| Role | Username / Email | Password | Nama Profil |
| :--- | :--- | :--- | :--- |
| **Mahasiswa** | `aryapratama` / `arya.pratama@mhs.dinus.ac.id` | `password123` | Arya Pratama (S1 TI - Smt 4) |
| **Dosen** | `budisantoso` / `budi.santoso@dsn.dinus.ac.id` | `password123` | Dr. Ir. Budi Santoso, M.Kom. |
| **Admin** | `adminbaak` / `baak@dinus.ac.id` | `password123` | Admin BAAK UDINUS |

> **Fitur Demo Instan:** Saat login, klik menu profil di pojok kanan atas untuk mengganti role secara instan (Mahasiswa ↔ Dosen ↔ Admin) dan mengevaluasi seluruh tampilan secara bergantian.

---

### B. Menjalankan Seluruh Microservices dengan Docker Compose

Untuk menjalankan backend Django microservices lengkap bersama PostgreSQL, Redis, dan Nginx API Gateway:

```bash
# Salin konfigurasi environment
cp .env.example .env

# Jalankan seluruh stack microservices
docker compose up --build
```

Setelah container aktif:
- **Frontend App**: `http://localhost:3000`
- **API Gateway**: `http://localhost:8000`
- **Auth Service**: `http://localhost:8001`
- **Academic Service**: `http://localhost:8002`
- **Enrollment Service**: `http://localhost:8003`
- **Grade Service**: `http://localhost:8004`
- **Attendance Service**: `http://localhost:8005`
- **Notification Service**: `http://localhost:8006`

---

## 4. Alur Kerja Inti (Core Academic Workflows)

### 1. Alur Mahasiswa (Student Flow)
1. **Dashboard**: Menampilkan banner ucapan selamat pagi dengan ilustrasi, 5 metrik statistik utama (IPK Kumulatif, SKS Diambil, Pertemuan Selesai, Peringkat Akademik, Tingkat Presensi), tabel Nilai Hasil Studi Terbaru, Kalender Akademik, Akses Cepat, dan Donut Chart Performa Akademik (84% Sangat Memuaskan).
2. **KRS Online (`/krs`)**: Mahasiswa memilih kelas dari daftar kelas yang tersedia, sistem memvalidasi batas maksimum 24 SKS, mendeteksi bentrok jadwal, dan memungkinkan pengajuan (*Submit*) ke dosen wali.
3. **Presensi Kuliah (`/attendance`)**: Mahasiswa memantau kehadiran per mata kuliah. Jika presensi di bawah 75%, sistem menampilkan peringatan kelayakan ujian.
4. **Nilai & Transkrip (`/grades`)**: Mahasiswa melihat rincian nilai komponen (Tugas, UTS, UAS, Presensi), konversi nilai huruf (A, AB, B, dst.), dan dapat mencetak Kartu Hasil Studi (KHS).

### 2. Alur Dosen (Lecturer Flow)
1. **Dashboard Dosen**: Menampilkan jadwal mengajar hari ini, rekapitulasi kelas yang diampu, peringatan batas akhir input nilai, dan akses cepat ke sesi presensi.
2. **Kelola Presensi (`/attendance`)**: Dosen membuka sesi pertemuan baru (misal Pertemuan ke-8), mencatat kehadiran mahasiswa (Hadir, Sakit, Izin, Alpa) dengan sekali klik, dan menutup sesi presensi.
3. **Input Nilai (`/grades`)**: Dosen memasukkan nilai Tugas, UTS, UAS, dan Presensi. Rumus kalkulasi otomatis menghitung skor akhir dan grade huruf, lalu dosen menekan tombol **Publikasikan Nilai ke Mahasiswa**.

### 3. Alur Administrator BAAK (Admin Flow)
1. **Dashboard Admin**: Menyajikan grafik analitik interaktif distribusi mahasiswa per program studi dan tren *enrollment* semester.
2. **Verifikasi KRS**: Admin dapat mereview pengajuan KRS mahasiswa bimbingan, memeriksa daftar mata kuliah yang diajukan, dan memberikan persetujuan (*Approve*) atau penolakan dengan catatan perbaikan (*Reject*).
3. **Manajemen Pengguna (`/users`)**: Mengelola data mahasiswa, dosen, dan staf administrasi dengan RBAC.

---

## 5. Standar Desain Visual & UI/UX

- **Komponen Atomik Reusable**: Dibangun dengan metodologi *Atomic Design* (Atoms, Molecules, Organisms, Templates, Pages) untuk skalabilitas dan konsistensi UI.
- **Identitas Visual UDINUS**: Menggunakan palette warna resmi Universitas Dian Nuswantoro:
  - **Navy Blue Utama**: `#0B2545` / `#133E87` (Sidebar, Navbar, Header Table, Hero Banner)
  - **Gold / Kuning Emas**: `#F59E0B` / `#D97706` (Aksen, Badge Status, Peringkat, Notifikasi Penting)
  - **White & Slate Neutral**: `#FFFFFF` / `#F8FAFC` (Card Background, Canvas, Typography Contrast)
- **Role-Based Experience**: Tampilan beradaptasi secara dinamis sesuai peran pengguna (Mahasiswa, Dosen, Administrator BAAK) lengkap dengan validasi visual state instan.

---

## 6. Referensi Source Code & Pemenuhan Syarat Soal UAS

Berikut adalah matriks komprehensif dan rincian referensi implementasi *source code* pada repositori ini yang menjawab 4 aspek penilaian utama Soal UAS:

### Matriks Pemetaan Soal UAS vs Source Code

| No | Syarat / Topik Soal UAS | Fitur / Implementasi Kunci | Referensi Source Code Terkait |
| :--- | :--- | :--- | :--- |
| **1** | **Analisis dan Arsitektur** | - Arsitektur Microservices terdistribusi<br>- Reverse Proxy API Gateway & CORS<br>- *Database-per-Service Pattern*<br>- Komunikasi Antar-Layanan (REST Event & Redis)<br>- Dekomposisi Domain Bounded Context | - [`gateway/nginx.conf`](gateway/nginx.conf)<br>- [`infrastructure/postgres/init-databases.sql`](infrastructure/postgres/init-databases.sql)<br>- [`docker-compose.yml`](docker-compose.yml)<br>- [`services/enrollment-service/apps/enrollments/services.py`](services/enrollment-service/apps/enrollments/services.py)<br>- [`services/grade-service/apps/grades/services.py`](services/grade-service/apps/grades/services.py) |
| **2** | **Containerization** | - Multi-Container Docker Compose Orchestration<br>- Healthcheck & Dependency Management (`depends_on`)<br>- Isolated Bridge Network (`siakad-network`)<br>- Named Persistent Volumes (`postgres_data`, `redis_data`)<br>- Dockerfile Microservice Backend (Python 3.11-slim)<br>- Dockerfile Multi-Stage Frontend (Bun ➔ Nginx) | - [`docker-compose.yml`](docker-compose.yml)<br>- [`services/auth-service/Dockerfile`](services/auth-service/Dockerfile)<br>- [`services/academic-service/Dockerfile`](services/academic-service/Dockerfile)<br>- [`frontend/Dockerfile`](frontend/Dockerfile)<br>- [`gateway/Dockerfile`](gateway/Dockerfile)<br>- [`.env.example`](.env.example) |
| **3** | **Django & ORM** | - Custom User Model RBAC (`AbstractUser`)<br>- Relasi 1-to-1, 1-to-Many, & Self-Referencing FK<br>- Integritas Data & `Meta.unique_together`<br>- UUID Primary Key (`UUIDField`)<br>- Service Layer Pattern & State Machine<br>- DRF Serializer & ViewSet Custom Action | - [`services/auth-service/apps/users/models.py`](services/auth-service/apps/users/models.py)<br>- [`services/academic-service/apps/academics/models.py`](services/academic-service/apps/academics/models.py)<br>- [`services/enrollment-service/apps/enrollments/models.py`](services/enrollment-service/apps/enrollments/models.py)<br>- [`services/enrollment-service/apps/enrollments/services.py`](services/enrollment-service/apps/enrollments/services.py)<br>- [`services/grade-service/apps/grades/services.py`](services/grade-service/apps/grades/services.py)<br>- [`services/academic-service/apps/academics/services.py`](services/academic-service/apps/academics/services.py) |
| **4** | **Optimasi Query** | - Solusi N+1 Query via `select_related()` (SQL JOIN)<br>- Batch Loading via `prefetch_related()` (M2M/Reverse FK)<br>- B-Tree Database Indexing (`db_index=True`)<br>- Partial Database Update (`save(update_fields=[...])`)<br>- Bulk Operation & Atomicity (`update()`, `update_or_create()`)<br>- In-Memory Caching dengan Redis | - [`services/academic-service/apps/academics/views.py`](services/academic-service/apps/academics/views.py)<br>- [`services/auth-service/apps/users/selectors.py`](services/auth-service/apps/users/selectors.py)<br>- [`services/enrollment-service/apps/enrollments/views.py`](services/enrollment-service/apps/enrollments/views.py)<br>- [`services/attendance-service/apps/attendance/views.py`](services/attendance-service/apps/attendance/views.py)<br>- [`services/grade-service/apps/grades/services.py`](services/grade-service/apps/grades/services.py)<br>- [`docker-compose.yml`](docker-compose.yml) |

---

### 1. Analisis dan Arsitektur Sistem

Sistem dirancang dengan pendekatan arsitektur terdistribusi modern untuk mendukung ketersediaan tinggi (*high availability*), skalabilitas horizontal independen, dan isolasi domain akademik:

1. **Pola Arsitektur (Architectural Patterns)**:
   - **Microservices Architecture**: Sistem dipecah menjadi 6 domain mikro independen (Auth, Academic, Enrollment/KRS, Grade, Attendance, Notification) dengan batasan tanggung jawab yang jelas (*Separation of Concerns*).
   - **Single Entry Point (API Gateway Pattern)**: Seluruh lalu lintas dari klien (frontend React/mobile) diarahkan ke port `8000` melalui Nginx Reverse Proxy. Klien tidak berinteraksi langsung dengan IP/port internal microservice.
   - **Database-per-Service Pattern**: Setiap microservice memiliki basis data terisolasi untuk menjamin kepemilikan data eksklusif (*data encapsulation*) dan mencegah ketergantungan skema database (*loose coupling*).
     - Referensi Source Code: [`infrastructure/postgres/init-databases.sql`](infrastructure/postgres/init-databases.sql#L18-L32) menginisialisasi 6 database: `siakad_auth_db`, `siakad_academic_db`, `siakad_enrollment_db`, `siakad_grade_db`, `siakad_attendance_db`, `siakad_notification_db`.

2. **API Gateway & Routing Configuration**:
   - File: [`gateway/nginx.conf`](gateway/nginx.conf)
   - **Upstream Service Discovery**: Mendefinisikan endpoint internal untuk setiap service (`auth_service:8001`, `academic_service:8002`, `enrollment_service:8003`, `grade_service:8004`, `attendance_service:8005`, `notification_service:8006`) pada baris [`L16-L38`](gateway/nginx.conf#L16-L38).
   - **Path-Based Routing**:
     - `/api/auth/`, `/api/users/`, `/api/students/`, `/api/lecturers/` ➔ `auth_service` ([`L59-L65`](gateway/nginx.conf#L59-L65))
     - `/api/courses/`, `/api/classes/`, `/api/schedules/` ➔ `academic_service` ([`L68-L74`](gateway/nginx.conf#L68-L74))
     - `/api/enrollments/` ➔ `enrollment_service` ([`L77-L83`](gateway/nginx.conf#L77-L83))
     - `/api/grades/` ➔ `grade_service` ([`L86-L92`](gateway/nginx.conf#L86-L92))
     - `/api/attendance/`, `/api/sessions/`, `/api/records/` ➔ `attendance_service` ([`L95-L101`](gateway/nginx.conf#L95-L101))
     - `/api/notifications/` ➔ `notification_service` ([`L104-L110`](gateway/nginx.conf#L104-L110))
   - **Cross-Origin Resource Sharing (CORS)**: Konfigurasi header CORS universal dan penanganan request preflight `OPTIONS` otomatis ([`L44-L51`](gateway/nginx.conf#L44-L51)).

3. **Komunikasi Antar-Layanan (Inter-Service Communication)**:
   - **Sinkron (HTTP/REST Event Notification)**:
     - Saat KRS diajukan atau disetujui, `enrollment-service` mengirimkan request HTTP POST ke `notification-service` ([`services/enrollment-service/apps/enrollments/services.py#L38-L50`](services/enrollment-service/apps/enrollments/services.py#L38-L50), [`L66-L78`](services/enrollment-service/apps/enrollments/services.py#L66-L78)).
     - Saat nilai akhir dipublikasikan, `grade-service` memicu notifikasi mahasiswa ([`services/grade-service/apps/grades/services.py#L62-L75`](services/grade-service/apps/grades/services.py#L62-L75)).
     - Saat persentase presensi mahasiswa < 75%, `attendance-service` otomatis mengirimkan peringatan risiko kelayakan ujian ([`services/attendance-service/apps/attendance/services.py#L33-L45`](services/attendance-service/apps/attendance/services.py#L33-L45)).
   - **Asinkron & Caching**: Redis 7 bertindak sebagai in-memory store dan message broker antrian untuk kinerja tinggi.

---

### 2. Containerization & Multi-Container Orchestration

Pengemasan aplikasi mengadopsi standar container berbasis Docker untuk memastikan portabilitas lingkungan pengembangan (*development*) maupun produksi (*production*):

1. **Orkestrasi Multi-Container (`docker-compose.yml`)**:
   - File: [`docker-compose.yml`](docker-compose.yml)
   - Mengorkestrasi total **9 container**:
     - `postgres` (PostgreSQL 16 Alpine - Database Master Multi-DB)
     - `redis` (Redis 7 Alpine - Cache & Broker)
     - 6 Microservices Django REST (`auth`, `academic`, `enrollment`, `grade`, `attendance`, `notification`)
     - `api-gateway` (Nginx Reverse Proxy)
   - **Jaringan Terisolasi (Isolated Bridge Network)**: Seluruh container terhubung ke dalam virtual network `siakad-network` ([`docker-compose.yml#L235-L237`](docker-compose.yml#L235-L237)), memungkinkan resolusi nama host antar-container menggunakan DNS Docker internal (misal: `http://notification-service:8006`).
   - **Persistensi Data (Named Volumes)**:
     - `postgres_data:/var/lib/postgresql/data` ([`docker-compose.yml#L18, L238`](docker-compose.yml#L18)) menjamin ACID compliance dan persistensi data saat container dihentikan atau di-rebuild.
     - `redis_data:/data` ([`docker-compose.yml#L38, L239`](docker-compose.yml#L38)) menjaga persistensi cache/session.
   - **Healthcheck & Dependency Ordering**:
     - Database PostgreSQL dilengkapi healthcheck `pg_isready` ([`L20-L24`](docker-compose.yml#L20-L24)).
     - Redis dilengkapi healthcheck `redis-cli ping` ([`L39-L43`](docker-compose.yml#L39-L43)).
     - Seluruh microservice menggunakan deklarasi `depends_on` dengan `condition: service_healthy` ([`L63-L67`](docker-compose.yml#L63-L67)), menjamin backend tidak berjalan sebelum database dan redis siap menerima koneksi.
   - **Inisialisasi Otomatis Database Multi-Service**: Berkas [`infrastructure/postgres/init-databases.sql`](infrastructure/postgres/init-databases.sql) di-mount langsung ke `/docker-entrypoint-initdb.d/`, mengeksekusi pembuatan 6 database secara otomatis pada inisiasi pertama container PostgreSQL ([`docker-compose.yml#L19`](docker-compose.yml#L19)).

2. **Dockerfile Microservice Backend (Django)**:
   - File Contoh: [`services/auth-service/Dockerfile`](services/auth-service/Dockerfile) & [`services/academic-service/Dockerfile`](services/academic-service/Dockerfile)
   - **Base Image Ramping**: Menggunakan `python:3.11-slim` untuk meminimalkan ukuran image dan permukaan celah keamanan.
   - **Optimasi Python Container**:
     - `ENV PYTHONDONTWRITEBYTECODE=1` (menghindari penulisan bytecode `.pyc` ke disk container).
     - `ENV PYTHONUNBUFFERED=1` (memastikan log output langsung dialirkan ke stdout terminal tanpa buffering).
   - **Multi-Layer Dependency Caching**: `COPY requirements.txt .` dan `RUN pip install --no-cache-dir -r requirements.txt` dijalankan mendahului `COPY . .`, memanfaatkan caching layer Docker agar proses build tidak mengulang instalasi library jika tidak ada perubahan dependensi.
   - **System Compilers**: Instalasi `gcc` dan `libpq-dev` untuk mengompilasi driver database C PostgreSQL (`psycopg2-binary`).

3. **Dockerfile Frontend Multi-Stage Build**:
   - File: [`frontend/Dockerfile`](frontend/Dockerfile)
   - **Stage 1 (Builder)**: Menggunakan `oven/bun:1.1-alpine` untuk kompilasi ultra-cepat dependensi NPM dan proses *Vite build* ([`L1-L6`](frontend/Dockerfile#L1-L6)).
   - **Stage 2 (Production Serving)**: Menggunakan `nginx:1.25-alpine` dengan menyalin artefak kompilasi statis `--from=builder /app/dist /usr/share/nginx/html` ([`L8-L12`](frontend/Dockerfile#L8-L12)). Menghasilkan image produksi yang sangat kecil (~25 MB) tanpa menyertakan compiler Bun/Node.

---

### 3. Django & ORM (Object-Relational Mapping)

Implementasi backend menggunakan Django ORM dengan pemisahan lapisan arsitektur (*Model*, *Serializer*, *View/ViewSet*, *Service Layer*, dan *Selector*):

1. **Pemodelan Data Relasional & Skema (Schema Modeling)**:
   - **Custom User Model & RBAC**:
     - File: [`services/auth-service/apps/users/models.py#L21-L39`](services/auth-service/apps/users/models.py#L21-L39)
     - Mewarisi `AbstractUser` dengan field `role` menggunakan `models.TextChoices` (`ADMIN`, `DOSEN`, `MAHASISWA`), didukung oleh `UserManager` kustom (`create_user`, `create_superuser`).
   - **Relasi One-to-One (1:1)**:
     - `Student.user = models.OneToOneField(User, related_name='student_profile')` ([`services/auth-service/apps/users/models.py#L49`](services/auth-service/apps/users/models.py#L49))
     - `Lecturer.user = models.OneToOneField(User, related_name='lecturer_profile')` ([`services/auth-service/apps/users/models.py#L76`](services/auth-service/apps/users/models.py#L76))
   - **Relasi One-to-Many (1:N)**:
     - `Faculty` ➔ `StudyProgram` ([`services/academic-service/apps/academics/models.py#L15`](services/academic-service/apps/academics/models.py#L15))
     - `Course` ➔ `CourseClass` ([`services/academic-service/apps/academics/models.py#L61`](services/academic-service/apps/academics/models.py#L61))
     - `CourseClass` ➔ `Schedule` ([`services/academic-service/apps/academics/models.py#L86`](services/academic-service/apps/academics/models.py#L86))
     - `Enrollment` ➔ `EnrollmentItem` ([`services/enrollment-service/apps/enrollments/models.py#L36`](services/enrollment-service/apps/enrollments/models.py#L36))
     - `AttendanceSession` ➔ `AttendanceRecord` ([`services/attendance-service/apps/attendance/models.py#L39`](services/attendance-service/apps/attendance/models.py#L39))
   - **Self-Referential Foreign Key**:
     - `Course.prerequisite_course = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='dependent_courses')` ([`services/academic-service/apps/academics/models.py#L53`](services/academic-service/apps/academics/models.py#L53)) untuk memodelkan struktur hierarki mata kuliah prasyarat.
   - **Penggunaan Primary Key UUID**:
     - Penggunaan `id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)` di seluruh entitas untuk keamanan ID, menghindari *enumeration attack*, dan menjamin integritas migrasi data terdistribusi.

2. **Integritas Data & Database Constraints (`Meta.unique_together`)**:
   - `Enrollment.Meta.unique_together = ('student_id', 'academic_year', 'semester')` ([`services/enrollment-service/apps/enrollments/models.py#L28-L29`](services/enrollment-service/apps/enrollments/models.py#L28-L29)): Mencegah duplikasi lembar KRS untuk mahasiswa pada semester yang sama.
   - `EnrollmentItem.Meta.unique_together = ('enrollment', 'course_id')` ([`services/enrollment-service/apps/enrollments/models.py#L48-L49`](services/enrollment-service/apps/enrollments/models.py#L48-L49)): Menjamin satu mata kuliah hanya dapat diambil satu kali dalam satu lembar KRS.
   - `CourseClass.Meta.unique_together = ('course', 'academic_year', 'class_code')` ([`services/academic-service/apps/academics/models.py#L70-L71`](services/academic-service/apps/academics/models.py#L70-L71)): Menjamin keunikan kode kelas per mata kuliah per periode akademik.
   - `Grade.Meta.unique_together = ('student_id', 'class_id')` ([`services/grade-service/apps/grades/models.py#L44-L45`](services/grade-service/apps/grades/models.py#L44-L45)): Menjamin integritas pencatatan nilai agar tidak terjadi duplikasi entri nilai mahasiswa pada kelas yang sama.
   - `AttendanceRecord.Meta.unique_together = ('session', 'student_id')` ([`services/attendance-service/apps/attendance/models.py#L47-L48`](services/attendance-service/apps/attendance/models.py#L47-L48)): Menjamin presensi mahasiswa bersifat *idempotent* per pertemuan.

3. **Service Layer Pattern & Business Logic**:
   - Memisahkan logika bisnis kompleks dari View / Controller ke dalam berkas `services.py`:
     - **KRS State Machine Workflow**: [`services/enrollment-service/apps/enrollments/services.py`](services/enrollment-service/apps/enrollments/services.py) mengatur transisi status `DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` / `REJECTED`, validasi kuota SKS maksimal (24 SKS), dan kalkulasi otomatis total SKS.
     - **Formula Pembobotan & Konversi Nilai Standar UDINUS**: [`services/grade-service/apps/grades/services.py#L7-L56`](services/grade-service/apps/grades/services.py#L7-L56) menerapkan formula bobot: $\text{Skor} = (20\% \times \text{Tugas}) + (30\% \times \text{UTS}) + (40\% \times \text{UAS}) + (10\% \times \text{Presensi})$, serta konversi otomatis ke huruf mutu (`A`, `AB`, `B`, `BC`, `C`, `D`, `E`) dan nilai bobot IP (4.00 s/d 0.00).
     - **Algoritma Deteksi Bentrok Jadwal (*Conflict Detection*)**: [`services/academic-service/apps/academics/services.py#L5-L26`](services/academic-service/apps/academics/services.py#L5-L26) mengevaluasi irisan interval waktu perkuliahan ($\max(start_1, start_2) < \min(end_1, end_2)$) pada hari yang sama.
     - **Rekapitulasi Kehadiran & Ambang Batas 75%**: [`services/attendance-service/apps/attendance/services.py#L5-L55`](services/attendance-service/apps/attendance/services.py#L5-L55) menghitung persentase kehadiran mahasiswa dan mengevaluasi status peringatan kelayakan ujian.

4. **Django REST Framework (DRF) Endpoints**:
   - Pemanfaatan `ModelViewSet` dengan decorator `@action` untuk endpoint bisnis:
     - `POST /api/enrollments/{id}/submit/`, `approve/`, `reject/`, `unlock/`, `add-item/` ([`services/enrollment-service/apps/enrollments/views.py#L39-L144`](services/enrollment-service/apps/enrollments/views.py#L39-L144))
     - `PATCH /api/grades/{id}/update-scores/` & `POST /api/grades/publish-class/` ([`services/grade-service/apps/grades/views.py#L31-L57`](services/grade-service/apps/grades/views.py#L31-L57))
     - `POST /api/sessions/{id}/record-presence/` & `close/` ([`services/attendance-service/apps/attendance/views.py#L26-L103`](services/attendance-service/apps/attendance/views.py#L26-L103))
     - `GET /api/records/student-summary/` ([`services/attendance-service/apps/attendance/views.py#L141-L151`](services/attendance-service/apps/attendance/views.py#L141-L151))

---

### 4. Optimasi Query Database

Sistem menerapkan prinsip rekayasa query tingkat lanjut untuk menekan beban server database (*database I/O*) dan mencegah degradasi performa di bawah beban lalu lintas tinggi:

1. **Penyelesaian N+1 Query Problem**:
   - **`select_related` (SQL Eager Loading via `JOIN`)**:
     Digunakan untuk relasi satu arah (*single-valued relationships*: `ForeignKey` dan `OneToOneField`) untuk mengeksekusi 1 query SQL gabungan menggunakan `INNER JOIN` / `LEFT OUTER JOIN`:
     - File: [`services/academic-service/apps/academics/views.py`](services/academic-service/apps/academics/views.py)
       - `StudyProgram.objects.select_related('faculty').all()` ([`L20`](services/academic-service/apps/academics/views.py#L20)) ➔ Mengeliminasi query berulang ke tabel fakultas.
       - `Course.objects.select_related('study_program', 'prerequisite_course').all()` ([`L30`](services/academic-service/apps/academics/views.py#L30)) ➔ Menarik program studi dan mata kuliah prasyarat sekaligus.
       - `Schedule.objects.select_related('course_class__course', 'room').all()` ([`L60`](services/academic-service/apps/academics/views.py#L60)) ➔ Query join bertingkat (*nested join*) dari jadwal ➔ kelas ➔ mata kuliah ➔ ruangan.
     - File: [`services/auth-service/apps/users/selectors.py`](services/auth-service/apps/users/selectors.py)
       - `Student.objects.select_related('user').all()` ([`L11`](services/auth-service/apps/users/selectors.py#L11)) ➔ Menggabungkan data profil mahasiswa dengan akun user utamanya.
       - `Lecturer.objects.select_related('user').all()` ([`L17`](services/auth-service/apps/users/selectors.py#L17)) ➔ Menggabungkan data profil dosen dengan akun user utamanya.
     - File: [`services/attendance-service/apps/attendance/views.py`](services/attendance-service/apps/attendance/views.py)
       - `AttendanceRecord.objects.select_related('session').all()` ([`L128`](services/attendance-service/apps/attendance/views.py#L128)) ➔ Mengambil data sesi perkuliahan bersamaan dengan record presensi.

   - **`prefetch_related` (Batch Multi-Query In-Memory Joining)**:
     Digunakan untuk relasi banyak arah (*multi-valued relationships*: reverse `ForeignKey` dan `ManyToManyField`) untuk menghindari perkalian query dengan melakukan eksekusi 2 query batch yang digabungkan pada memori Python:
     - File: [`services/enrollment-service/apps/enrollments/views.py`](services/enrollment-service/apps/enrollments/views.py)
       - `Enrollment.objects.prefetch_related('items').all()` ([`L13`](services/enrollment-service/apps/enrollments/views.py#L13)) ➔ Mengambil seluruh data lembar KRS beserta seluruh rincian item mata kuliahnya hanya dalam 2 query SQL, mencegah ratusan query terpisah saat memuat daftar mahasiswa.
     - File: [`services/academic-service/apps/academics/views.py`](services/academic-service/apps/academics/views.py)
       - `CourseClass.objects.select_related('course', 'academic_year').prefetch_related('schedules__room').all()` ([`L45`](services/academic-service/apps/academics/views.py#L45)) ➔ Kombinasi `select_related` untuk entitas induk dan `prefetch_related` bertingkat untuk jadwal dan ruangan kelas.
     - File: [`services/attendance-service/apps/attendance/views.py`](services/attendance-service/apps/attendance/views.py)
       - `AttendanceSession.objects.prefetch_related('records').all()` ([`L13`](services/attendance-service/apps/attendance/views.py#L13)) ➔ Mengambil sesi pertemuan beserta rekap kehadiran seluruh mahasiswa dalam 2 query efisien.

2. **Strategi Database Indexing (`db_index=True`)**:
   - Pembuatan B-Tree index secara spesifik pada kolom yang memiliki kardinalitas tinggi (*high cardinality*) dan sering digunakan pada klausa `WHERE`, `FILTER`, atau *foreign lookup*:
     - `Enrollment.student_id` (Index lookup KRS per mahasiswa: [`services/enrollment-service/apps/enrollments/models.py#L13`](services/enrollment-service/apps/enrollments/models.py#L13))
     - `Grade.student_id` & `Grade.class_id` (Index filter transkrip & input nilai: [`services/grade-service/apps/grades/models.py#L16, L19`](services/grade-service/apps/grades/models.py#L16))
     - `AttendanceSession.class_id` & `AttendanceRecord.student_id` (Index filter presensi: [`services/attendance-service/apps/attendance/models.py#L10, L40`](services/attendance-service/apps/attendance/models.py#L10))
     - `Student.nim` & `Lecturer.nidn` (Index pencarian identitas unik: [`services/auth-service/apps/users/models.py#L50, L77`](services/auth-service/apps/users/models.py#L50))
     - `Course.code` (Index pencarian kode mata kuliah: [`services/academic-service/apps/academics/models.py#L47`](services/academic-service/apps/academics/models.py#L47))

3. **Optimasi Operasi Penulisan Database (Minimal Payload Updates)**:
   - Penggunaan parameter `update_fields` saat pemanggilan `.save(update_fields=[...])` sehingga query `UPDATE` SQL hanya mengeksekusi kolom yang mengalami perubahan nilai, meminimalkan write-lock dan fragmentasi tuple pada PostgreSQL:
     - [`services/enrollment-service/apps/enrollments/services.py#L10`](services/enrollment-service/apps/enrollments/services.py#L10): `enrollment.save(update_fields=['total_sks'])`
     - [`services/enrollment-service/apps/enrollments/services.py#L36`](services/enrollment-service/apps/enrollments/services.py#L36): `enrollment.save(update_fields=['status', 'submitted_at'])`
     - [`services/enrollment-service/apps/enrollments/services.py#L63`](services/enrollment-service/apps/enrollments/services.py#L63): `enrollment.save(update_fields=['status', 'approved_by', 'approval_note', 'approved_at'])`
     - [`services/attendance-service/apps/attendance/views.py#L31`](services/attendance-service/apps/attendance/views.py#L31): `session.save(update_fields=['status', 'closed_at'])`

4. **Operasi Massal & Idempotensi (Bulk Operations & Upserts)**:
   - **Bulk Update**: Memperbarui status publikasi ratusan record nilai mahasiswa dalam satu eksekusi perintah SQL `UPDATE` tanpa me-load model ke memori satu per satu:
     - File: [`services/grade-service/apps/grades/services.py#L59`](services/grade-service/apps/grades/services.py#L59) ➔ `Grade.objects.filter(class_id=class_id).update(is_published=True, published_at=timezone.now())`.
   - **Atomic Upsert (`update_or_create`)**: Menggunakan `update_or_create()` pada pencatatan presensi mahasiswa ([`services/attendance-service/apps/attendance/views.py#L86-L95, L110-L120`](services/attendance-service/apps/attendance/views.py#L86-L95)) untuk mencegah race condition dan menjamin idempotensi data tanpa duplikasi baris.

5. **In-Memory Caching (Redis 7 Integration)**:
   - Penggunaan Redis 7 terisolasi per microservice (`REDIS_URL=redis://redis:6379/1`, `/2`, `/3` pada [`docker-compose.yml#L59, L83, L107`](docker-compose.yml#L59)) untuk menyimpan hasil komputasi IPK/IPS, data kurikulum statis, dan sesi login pengguna berkinerja tinggi.


