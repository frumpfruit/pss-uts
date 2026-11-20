import uuid
from django.db import models

class AttendanceSession(models.Model):
    class SessionStatus(models.TextChoices):
        OPEN = 'OPEN', 'Presensi Dibuka'
        CLOSED = 'CLOSED', 'Presensi Ditutup'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class_id = models.UUIDField(db_index=True)
    class_code = models.CharField(max_length=30)
    course_name = models.CharField(max_length=150)
    lecturer_id = models.UUIDField()
    lecturer_name = models.CharField(max_length=150)
    session_number = models.PositiveSmallIntegerField(default=1) # 1 s/d 14
    topic = models.CharField(max_length=200, default='Materi Perkuliahan')
    date = models.DateField()
    start_time = models.CharField(max_length=10, default='08:40')
    end_time = models.CharField(max_length=10, default='11:10')
    status = models.CharField(max_length=20, choices=SessionStatus.choices, default=SessionStatus.OPEN)
    opened_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('class_id', 'session_number')
        ordering = ['session_number']

    def __str__(self):
        return f"{self.course_name} ({self.class_code}) - Pertemuan #{self.session_number}"

class AttendanceRecord(models.Model):
    class Status(models.TextChoices):
        PRESENT = 'PRESENT', 'Hadir'
        SICK = 'SICK', 'Sakit'
        EXCUSED = 'EXCUSED', 'Izin'
        ABSENT = 'ABSENT', 'Alpa / Tanpa Keterangan'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
    student_id = models.UUIDField(db_index=True)
    student_nim = models.CharField(max_length=20)
    student_name = models.CharField(max_length=150)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PRESENT)
    notes = models.CharField(max_length=200, blank=True, null=True)
    recorded_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('session', 'student_id')

    def __str__(self):
        return f"{self.student_nim} - Pertemuan #{self.session.session_number}: {self.status}"
