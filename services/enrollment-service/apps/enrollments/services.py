import requests
from django.utils import timezone
from django.conf import settings
from rest_framework.exceptions import ValidationError
from .models import Enrollment, EnrollmentItem

def recalculate_enrollment_sks(enrollment: Enrollment) -> int:
    total = sum(item.sks for item in enrollment.items.all())
    enrollment.total_sks = total
    enrollment.save(update_fields=['total_sks'])
    return total

def get_enrollment(identifier: str) -> Enrollment:
    try:
        return Enrollment.objects.get(id=identifier)
    except (Enrollment.DoesNotExist, ValidationError, ValueError):
        enr = Enrollment.objects.filter(student_id=identifier).order_by('-created_at').first()
        if enr:
            return enr
        raise

def submit_enrollment(enrollment_id: str) -> Enrollment:
    enrollment = get_enrollment(enrollment_id)
    if enrollment.status != Enrollment.Status.DRAFT and enrollment.status != Enrollment.Status.REJECTED:
        raise ValidationError("Hanya KRS berstatus DRAFT atau REJECTED yang dapat diajukan.")

    if enrollment.items.count() == 0:
        raise ValidationError("KRS tidak boleh kosong. Silakan pilih minimal 1 mata kuliah.")

    if enrollment.total_sks > enrollment.max_sks:
        raise ValidationError(f"Total SKS ({enrollment.total_sks}) melebihi batas maksimum ({enrollment.max_sks} SKS).")

    enrollment.status = Enrollment.Status.SUBMITTED
    enrollment.submitted_at = timezone.now()
    enrollment.save(update_fields=['status', 'submitted_at'])

    # Send Notification to Admin
    try:
        requests.post(
            f"{settings.NOTIFICATION_SERVICE_URL}/api/notifications/",
            json={
                "title": f"Pengajuan KRS Baru: {enrollment.student_name} ({enrollment.student_nim})",
                "message": f"Mahasiswa {enrollment.student_name} telah mengajukan KRS ({enrollment.total_sks} SKS) dan menunggu verifikasi.",
                "type": "KRS_SUBMITTED",
                "recipient_role": "ADMIN"
            },
            timeout=2
        )
    except Exception:
        pass

    return enrollment

def approve_enrollment(enrollment_id: str, approver_name: str, note: str = "") -> Enrollment:
    enrollment = get_enrollment(enrollment_id)
    if enrollment.status != Enrollment.Status.SUBMITTED:
        raise ValidationError("Hanya KRS yang berstatus SUBMITTED yang dapat disetujui.")

    enrollment.status = Enrollment.Status.APPROVED
    enrollment.approved_by = approver_name
    enrollment.approval_note = note or "KRS telah disetujui oleh Dosen Pembimbing Akademik / BAAK."
    enrollment.approved_at = timezone.now()
    enrollment.save(update_fields=['status', 'approved_by', 'approval_note', 'approved_at'])

    # Send Notification to Student
    try:
        requests.post(
            f"{settings.NOTIFICATION_SERVICE_URL}/api/notifications/",
            json={
                "title": "KRS Anda Telah Disetujui!",
                "message": f"KRS Semester {enrollment.semester} {enrollment.academic_year} telah disetujui. Anda dapat melihat jadwal perkuliahan.",
                "type": "KRS_APPROVED",
                "recipient_id": str(enrollment.student_id)
            },
            timeout=2
        )
    except Exception:
        pass

    return enrollment

def reject_enrollment(enrollment_id: str, rejector_name: str, reason: str) -> Enrollment:
    if not reason:
        raise ValidationError("Alasan penolakan KRS wajib diisi.")

    enrollment = get_enrollment(enrollment_id)
    enrollment.status = Enrollment.Status.REJECTED
    enrollment.approved_by = rejector_name
    enrollment.approval_note = reason
    enrollment.save(update_fields=['status', 'approved_by', 'approval_note'])

    # Send Notification to Student
    try:
        requests.post(
            f"{settings.NOTIFICATION_SERVICE_URL}/api/notifications/",
            json={
                "title": "KRS Memerlukan Perbaikan / Ditolak",
                "message": f"KRS ditolak dengan catatan: {reason}. Silakan perbaiki pilihan mata kuliah Anda.",
                "type": "KRS_REJECTED",
                "recipient_id": str(enrollment.student_id)
            },
            timeout=2
        )
    except Exception:
        pass

    return enrollment
