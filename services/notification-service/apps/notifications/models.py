import uuid
from django.db import models

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        KRS_SUBMITTED = 'KRS_SUBMITTED', 'Pengajuan KRS'
        KRS_APPROVED = 'KRS_APPROVED', 'KRS Disetujui'
        KRS_REJECTED = 'KRS_REJECTED', 'KRS Ditolak'
        GRADE_PUBLISHED = 'GRADE_PUBLISHED', 'Nilai Dipublikasi'
        ATTENDANCE_WARNING = 'ATTENDANCE_WARNING', 'Peringatan Presensi'
        SCHEDULE_CHANGED = 'SCHEDULE_CHANGED', 'Perubahan Jadwal'
        ANNOUNCEMENT = 'ANNOUNCEMENT', 'Pengumuman Kampus'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=30, choices=NotificationType.choices, default=NotificationType.ANNOUNCEMENT)
    recipient_id = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    recipient_role = models.CharField(max_length=20, blank=True, null=True) # ADMIN, DOSEN, MAHASISWA, ALL
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.type}] {self.title}"
