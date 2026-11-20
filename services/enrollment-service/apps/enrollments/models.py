import uuid
from django.db import models

class Enrollment(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft / Belum Diajukan'
        SUBMITTED = 'SUBMITTED', 'Diajukan / Menunggu Persetujuan'
        APPROVED = 'APPROVED', 'Disetujui'
        REJECTED = 'REJECTED', 'Ditolak'
        REVISION_REQUESTED = 'REVISION_REQUESTED', 'Pengajuan Izin Ubah'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_id = models.UUIDField(db_index=True)
    student_nim = models.CharField(max_length=20)
    student_name = models.CharField(max_length=150)
    academic_year = models.CharField(max_length=20, default='2025/2026')
    semester = models.CharField(max_length=10, default='GENAP')
    total_sks = models.PositiveSmallIntegerField(default=0)
    max_sks = models.PositiveSmallIntegerField(default=24)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    approval_note = models.TextField(blank=True, null=True)
    approved_by = models.CharField(max_length=150, blank=True, null=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student_id', 'academic_year', 'semester')

    def __str__(self):
        return f"KRS {self.student_nim} - {self.academic_year} ({self.status})"

class EnrollmentItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='items')
    course_id = models.UUIDField()
    course_code = models.CharField(max_length=30)
    course_name = models.CharField(max_length=150)
    class_id = models.UUIDField()
    class_code = models.CharField(max_length=30)
    sks = models.PositiveSmallIntegerField(default=3)
    lecturer_name = models.CharField(max_length=150, default='Dosen Pengampu')
    schedule_day = models.CharField(max_length=20, default='Senin')
    schedule_time = models.CharField(max_length=50, default='08:40 - 11:10')
    room_code = models.CharField(max_length=30, default='H.4.1')

    class Meta:
        unique_together = ('enrollment', 'course_id')

    def __str__(self):
        return f"{self.enrollment.student_nim} - {self.course_code} {self.course_name} ({self.class_code})"
