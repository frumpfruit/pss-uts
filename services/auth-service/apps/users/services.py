from django.db import transaction
from .models import User, Student, Lecturer

@transaction.atomic
def student_create(*, username: str, email: str, password: str, first_name: str, last_name: str, nim: str, study_program_name: str = 'Teknik Informatika - S1', current_semester: int = 1) -> Student:
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        role=User.Role.MAHASISWA
    )
    student = Student.objects.create(
        user=user,
        nim=nim,
        study_program_name=study_program_name,
        current_semester=current_semester
    )
    return student

@transaction.atomic
def lecturer_create(*, username: str, email: str, password: str, first_name: str, last_name: str, nidn: str, academic_title: str = 'M.Kom.') -> Lecturer:
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        role=User.Role.DOSEN
    )
    lecturer = Lecturer.objects.create(
        user=user,
        nidn=nidn,
        academic_title=academic_title
    )
    return lecturer
