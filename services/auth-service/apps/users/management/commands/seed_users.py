from django.core.management.base import BaseCommand
from apps.users.models import User, Student, Lecturer

class Command(BaseCommand):
    help = 'Seed initial campus users for SIAKAD UDINUS'

    def handle(self, *args, **options):
        self.stdout.write('Seeding UDINUS Users into PostgreSQL...')

        # 1. Admin BAAK
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_superuser(
                username='admin',
                email='baak@dinus.ac.id',
                password='admin123',
                first_name='Admin',
                last_name='BAAK UDINUS',
                role=User.Role.ADMIN
            )
            self.stdout.write(f'Created Admin: {admin.username}')

        # 2. Dosen Wali
        if not User.objects.filter(username='dosen').exists():
            dosen = User.objects.create_user(
                username='dosen',
                email='budi.santoso@dsn.dinus.ac.id',
                password='password123',
                first_name='Budi',
                last_name='Santoso',
                role=User.Role.DOSEN,
                avatar_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
            )
            Lecturer.objects.create(
                user=dosen,
                nidn='0612087501',
                academic_title='Dr. Ir. Budi Santoso, M.Kom.',
                study_program_name='Teknik Informatika - S1',
                faculty_name='Fakultas Ilmu Komputer'
            )
            self.stdout.write(f'Created Lecturer: {dosen.username}')

        # 3. Mahasiswa
        if not User.objects.filter(username='aryapratama').exists():
            mhs = User.objects.create_user(
                username='aryapratama',
                email='arya.pratama@mhs.dinus.ac.id',
                password='password123',
                first_name='Arya',
                last_name='Pratama',
                role=User.Role.MAHASISWA,
                avatar_url='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
            )
            Student.objects.create(
                user=mhs,
                nim='A11.2023.14920',
                study_program_name='Teknik Informatika - S1',
                faculty_name='Fakultas Ilmu Komputer',
                current_semester=4,
                gpa=3.82,
                ips=3.88,
                total_sks_completed=72,
                target_sks=144,
                academic_status=Student.AcademicStatus.AKTIF
            )
            self.stdout.write(f'Created Student: {mhs.username}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded Users into PostgreSQL!'))
