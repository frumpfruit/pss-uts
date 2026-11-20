import uuid
from django.db import models

class Grade(models.Model):
    class LetterGrade(models.TextChoices):
        A = 'A', 'A (4.00)'
        AB = 'AB', 'AB (3.50)'
        B = 'B', 'B (3.00)'
        BC = 'BC', 'BC (2.50)'
        C = 'C', 'C (2.00)'
        D = 'D', 'D (1.00)'
        E = 'E', 'E (0.00)'
        PENDING = 'PENDING', 'Belum Dinilai'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_id = models.UUIDField(db_index=True)
    student_nim = models.CharField(max_length=20)
    student_name = models.CharField(max_length=150)
    class_id = models.UUIDField(db_index=True)
    class_code = models.CharField(max_length=30)
    course_id = models.UUIDField()
    course_code = models.CharField(max_length=30)
    course_name = models.CharField(max_length=150)
    sks = models.PositiveSmallIntegerField(default=3)
    academic_year = models.CharField(max_length=20, default='2025/2026')
    semester = models.CharField(max_length=10, default='GENAP')

    # Component Scores (0.00 - 100.00)
    assignment_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # Tugas (20%)
    midterm_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)    # UTS (30%)
    final_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)      # UAS (40%)
    attendance_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # Presensi (10%)

    # Final Computed Score & Grade
    final_numeric_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    letter_grade = models.CharField(max_length=10, choices=LetterGrade.choices, default=LetterGrade.PENDING)
    grade_point = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)

    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student_id', 'class_id')

    def __str__(self):
        return f"{self.student_nim} - {self.course_code}: {self.letter_grade} ({self.final_numeric_score})"
