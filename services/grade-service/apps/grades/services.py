import requests
from decimal import Decimal
from django.utils import timezone
from django.conf import settings
from .models import Grade

DEFAULT_WEIGHTS = {
    'assignment': Decimal('0.20'),
    'midterm': Decimal('0.30'),
    'final': Decimal('0.40'),
    'attendance': Decimal('0.10'),
}

def convert_score_to_letter_grade(score: Decimal) -> tuple[str, Decimal]:
    """Converts a 0-100 numeric score to UDINUS Standard Letter Grade and Grade Point."""
    if score >= 85:
        return ('A', Decimal('4.00'))
    elif score >= 80:
        return ('AB', Decimal('3.50'))
    elif score >= 70:
        return ('B', Decimal('3.00'))
    elif score >= 65:
        return ('BC', Decimal('2.50'))
    elif score >= 55:
        return ('C', Decimal('2.00'))
    elif score >= 40:
        return ('D', Decimal('1.00'))
    else:
        return ('E', Decimal('0.00'))

def update_student_grade(
    grade: Grade,
    assignment: Decimal,
    midterm: Decimal,
    final: Decimal,
    attendance: Decimal
) -> Grade:
    grade.assignment_score = assignment
    grade.midterm_score = midterm
    grade.final_score = final
    grade.attendance_score = attendance

    # Calculate weighted score: (Tugas*0.2) + (UTS*0.3) + (UAS*0.4) + (Presensi*0.1)
    final_numeric = (
        (assignment * DEFAULT_WEIGHTS['assignment']) +
        (midterm * DEFAULT_WEIGHTS['midterm']) +
        (final * DEFAULT_WEIGHTS['final']) +
        (attendance * DEFAULT_WEIGHTS['attendance'])
    )
    grade.final_numeric_score = round(final_numeric, 2)
    letter, point = convert_score_to_letter_grade(grade.final_numeric_score)
    grade.letter_grade = letter
    grade.grade_point = point
    grade.save()
    return grade

def publish_class_grades(class_id: str) -> int:
    grades = Grade.objects.filter(class_id=class_id)
    count = grades.update(is_published=True, published_at=timezone.now())

    # Send Notification to students in this class
    for g in grades:
        try:
            requests.post(
                f"{settings.NOTIFICATION_SERVICE_URL}/api/notifications/",
                json={
                    "title": f"Nilai Telah Dipublish: {g.course_name}",
                    "message": f"Nilai akhir untuk mata kuliah {g.course_name} ({g.course_code}) telah dipublikasikan oleh Dosen. Nilai Anda: {g.letter_grade}.",
                    "type": "GRADE_PUBLISHED",
                    "recipient_id": str(g.student_id)
                },
                timeout=2
            )
        except Exception:
            pass

    return count
