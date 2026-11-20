import requests
from django.conf import settings
from .models import AttendanceSession, AttendanceRecord

def calculate_student_attendance_stats(student_id: str, class_id: str = None) -> dict:
    records_qs = AttendanceRecord.objects.filter(student_id=student_id)
    if class_id:
        records_qs = records_qs.filter(session__class_id=class_id)

    total_sessions = records_qs.count()
    if total_sessions == 0:
        return {
            'total_sessions': 0,
            'present': 0,
            'sick': 0,
            'excused': 0,
            'absent': 0,
            'percentage': 100.0,
            'is_warning': False
        }

    present = records_qs.filter(status=AttendanceRecord.Status.PRESENT).count()
    sick = records_qs.filter(status=AttendanceRecord.Status.SICK).count()
    excused = records_qs.filter(status=AttendanceRecord.Status.EXCUSED).count()
    absent = records_qs.filter(status=AttendanceRecord.Status.ABSENT).count()

    # Formula: (present / total_sessions) * 100
    percentage = round((present / total_sessions) * 100, 1)
    is_warning = percentage < settings.ATTENDANCE_MINIMUM_PERCENTAGE

    # Trigger warning notification if below threshold
    if is_warning:
        try:
            requests.post(
                f"{settings.NOTIFICATION_SERVICE_URL}/api/notifications/",
                json={
                    "title": "Peringatan Kehadiran Rendah (< 75%)",
                    "message": f"Persentase kehadiran Anda saat ini ({percentage}%) berada di bawah batas minimum (75%). Anda berisiko tidak diperkenankan mengikuti UAS.",
                    "type": "ATTENDANCE_WARNING",
                    "recipient_id": str(student_id)
                },
                timeout=2
            )
        except Exception:
            pass

    return {
        'total_sessions': total_sessions,
        'present': present,
        'sick': sick,
        'excused': excused,
        'absent': absent,
        'percentage': percentage,
        'is_warning': is_warning
    }
