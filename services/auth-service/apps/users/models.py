import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email wajib diisi')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrator'
        DOSEN = 'DOSEN', 'Dosen'
        MAHASISWA = 'MAHASISWA', 'Mahasiswa'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MAHASISWA)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    is_active_campus = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Student(models.Model):
    class AcademicStatus(models.TextChoices):
        AKTIF = 'AKTIF', 'Aktif'
        CUTI = 'CUTI', 'Cuti'
        LULUS = 'LULUS', 'Lulus'
        DROP_OUT = 'DROP_OUT', 'Drop Out'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    nim = models.CharField(max_length=20, unique=True, db_index=True)
    study_program_id = models.UUIDField(null=True, blank=True)
    study_program_name = models.CharField(max_length=100, default='Teknik Informatika - S1')
    faculty_name = models.CharField(max_length=100, default='Fakultas Ilmu Komputer')
    current_semester = models.PositiveSmallIntegerField(default=1)
    academic_year = models.CharField(max_length=20, default='2025/2026')
    gpa = models.DecimalField(max_digits=3, decimal_places=2, default=0.00) # IPK
    ips = models.DecimalField(max_digits=3, decimal_places=2, default=0.00) # IPS
    total_sks_completed = models.PositiveSmallIntegerField(default=0)
    target_sks = models.PositiveSmallIntegerField(default=144)
    academic_status = models.CharField(max_length=20, choices=AcademicStatus.choices, default=AcademicStatus.AKTIF)
    admission_year = models.PositiveIntegerField(default=2024)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nim} - {self.user.get_full_name() or self.user.username}"


class Lecturer(models.Model):
    class LecturerStatus(models.TextChoices):
        AKTIF = 'AKTIF', 'Aktif Mengajar'
        TUGAS_BELAJAR = 'TUGAS_BELAJAR', 'Tugas Belajar'
        CUTI = 'CUTI', 'Cuti'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='lecturer_profile')
    nidn = models.CharField(max_length=20, unique=True, db_index=True)
    nip = models.CharField(max_length=30, blank=True, null=True)
    academic_title = models.CharField(max_length=100, default='Dr. Ir. M.Kom.')
    faculty_name = models.CharField(max_length=100, default='Fakultas Ilmu Komputer')
    study_program_name = models.CharField(max_length=100, default='Teknik Informatika')
    status = models.CharField(max_length=20, choices=LecturerStatus.choices, default=LecturerStatus.AKTIF)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nidn} - {self.user.get_full_name()}"
