import uuid
from django.db import models

class Faculty(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class StudyProgram(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='study_programs')
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)
    degree = models.CharField(max_length=20, default='S1') # D3, S1, S2
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.degree} {self.name} ({self.code})"

class AcademicYear(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    year = models.CharField(max_length=20, unique=True) # 2025/2026
    semester_type = models.CharField(max_length=10, choices=[('GANJIL', 'Ganjil'), ('GENAP', 'Genap')], default='GENAP')
    is_active = models.BooleanField(default=False)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.year} - {self.semester_type} ({'Aktif' if self.is_active else 'Nonaktif'})"

class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=30, unique=True) # H.4.1, D.2.A
    building = models.CharField(max_length=100, default='Gedung H')
    capacity = models.PositiveIntegerField(default=40)

    def __str__(self):
        return f"{self.code} ({self.building})"

class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    study_program = models.ForeignKey(StudyProgram, on_delete=models.CASCADE, related_name='courses')
    code = models.CharField(max_length=30, unique=True, db_index=True) # A11.54302
    name = models.CharField(max_length=150)
    sks = models.PositiveSmallIntegerField(default=3)
    semester_recommended = models.PositiveSmallIntegerField(default=1)
    is_mandatory = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)
    prerequisite_course = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='dependent_courses')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.name} ({self.sks} SKS)"

class CourseClass(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='classes')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='classes')
    class_code = models.CharField(max_length=30) # e.g. A11.4401, A11.4402
    lecturer_id = models.UUIDField(null=True, blank=True)
    lecturer_name = models.CharField(max_length=150, default='Dr. Ir. Budi Santoso, M.Kom.')
    max_capacity = models.PositiveIntegerField(default=40)
    enrolled_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course', 'academic_year', 'class_code')

    def __str__(self):
        return f"{self.course.name} - Kelompok {self.class_code}"

class Schedule(models.Model):
    class DayOfWeek(models.TextChoices):
        SENIN = 'SENIN', 'Senin'
        SELASA = 'SELASA', 'Selasa'
        RABU = 'RABU', 'Rabu'
        KAMIS = 'KAMIS', 'Kamis'
        JUMAT = 'JUMAT', 'Jumat'
        SABTU = 'SABTU', 'Sabtu'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course_class = models.ForeignKey(CourseClass, on_delete=models.CASCADE, related_name='schedules')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='schedules')
    day = models.CharField(max_length=10, choices=DayOfWeek.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.course_class} | {self.day} {self.start_time}-{self.end_time} ({self.room.code})"
