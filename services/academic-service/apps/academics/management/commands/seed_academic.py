from django.core.management.base import BaseCommand
from apps.academics.models import Faculty, StudyProgram, AcademicYear, Room, Course, CourseClass, Schedule

class Command(BaseCommand):
    help = 'Seed academic master data for UDINUS Campus Platform'

    def handle(self, *args, **options):
        self.stdout.write('Seeding UDINUS Academic data into PostgreSQL...')

        # 1. Faculty
        fik, _ = Faculty.objects.get_or_create(
            code='FIK',
            defaults={'name': 'Fakultas Ilmu Komputer'}
        )
        feb, _ = Faculty.objects.get_or_create(
            code='FEB',
            defaults={'name': 'Fakultas Ekonomi & Bisnis'}
        )

        # 2. Study Programs
        ti, _ = StudyProgram.objects.get_or_create(
            code='A11',
            defaults={
                'faculty': fik,
                'name': 'Teknik Informatika',
                'degree': 'S1'
            }
        )
        si, _ = StudyProgram.objects.get_or_create(
            code='A12',
            defaults={
                'faculty': fik,
                'name': 'Sistem Informasi',
                'degree': 'S1'
            }
        )

        # 3. Academic Year
        ay, _ = AcademicYear.objects.get_or_create(
            year='2025/2026',
            defaults={
                'semester_type': 'GENAP',
                'is_active': True
            }
        )

        # 4. Rooms
        r1, _ = Room.objects.get_or_create(code='H.4.1', defaults={'building': 'Gedung H', 'capacity': 45})
        r2, _ = Room.objects.get_or_create(code='D.2.A', defaults={'building': 'Gedung D', 'capacity': 40})
        r3, _ = Room.objects.get_or_create(code='Lab D.2.B', defaults={'building': 'Gedung D', 'capacity': 35})
        r4, _ = Room.objects.get_or_create(code='H.5.2', defaults={'building': 'Gedung H', 'capacity': 50})

        # 5. Courses
        courses_data = [
            ('A11.54302', 'Rekayasa Perangkat Lunak Lanjut', 3, 4, 'Pemodelan arsitektur software, microservices, CI/CD, dan clean architecture enterprise.'),
            ('A11.54401', 'Pemrograman Web Berbasis Komponen', 3, 4, 'Pengembangan frontend modern dengan React, state management, dan integrasi REST API.'),
            ('A11.54303', 'Basis Data Terdistribusi & Replikasi', 3, 4, 'Optimasi query PostgreSQL, sharding, transaksi ACID, dan failover cluster.'),
            ('A11.54304', 'Kecerdasan Buatan & Machine Learning', 3, 4, 'Dasar pembelajaran mesin, supervised learning, neural network, dan computer vision.'),
            ('A11.54205', 'Jaringan Komputer & Keamanan Siber', 3, 4, 'Routing protokol, firewall security, OAuth2/JWT security, dan monitoring lalu lintas data.'),
            ('A11.54101', 'Algoritma & Struktur Data Tingkat Lanjut', 4, 2, 'Struktur pohon, graph traversal, dynamic programming, dan analisis kompleksitas algoritma.')
        ]

        created_courses = []
        for code, name, sks, smt, desc in courses_data:
            c, _ = Course.objects.get_or_create(
                code=code,
                defaults={
                    'study_program': ti,
                    'name': name,
                    'sks': sks,
                    'semester_recommended': smt,
                    'description': desc,
                    'is_mandatory': True
                }
            )
            created_courses.append(c)

        # 6. Course Classes & Schedules
        day_map = {
            'Senin': 'SENIN',
            'Selasa': 'SELASA',
            'Rabu': 'RABU',
            'Kamis': 'KAMIS',
            'Jumat': 'JUMAT',
            'Sabtu': 'SABTU',
        }
        schedules = [
            ('A11.4401', created_courses[0], 'Dr. Ir. Budi Santoso, M.Kom.', 'Senin', '08:00', '10:30', r1),
            ('A11.4402', created_courses[1], 'Ahmad Fauzi, M.Cs.', 'Senin', '10:45', '13:15', r3),
            ('A11.4403', created_courses[2], 'Siti Aminah, M.Kom.', 'Selasa', '07:00', '09:30', r2),
            ('A11.4404', created_courses[3], 'Dr. Hendra Wijaya, S.T., M.T.', 'Rabu', '08:00', '10:30', r4),
            ('A11.4405', created_courses[4], 'Rudi Hermawan, M.Kom.', 'Kamis', '13:00', '15:30', r1),
            ('A11.4406', created_courses[5], 'Bambang Sudarsono, M.Si.', 'Jumat', '08:00', '11:20', r2),
        ]

        for code, course, lec, day, st, et, rm in schedules:
            cls_obj, _ = CourseClass.objects.get_or_create(
                course=course,
                academic_year=ay,
                class_code=code,
                defaults={
                    'lecturer_name': lec,
                    'max_capacity': 40,
                    'enrolled_count': 38
                }
            )
            Schedule.objects.get_or_create(
                course_class=cls_obj,
                room=rm,
                day=day_map.get(day, 'SENIN'),
                defaults={
                    'start_time': st,
                    'end_time': et
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Academic data into PostgreSQL!'))
