from django.db.models import QuerySet
from .models import User, Student, Lecturer

def user_list() -> QuerySet[User]:
    return User.objects.all().order_by('-created_at')

def user_get(user_id: str) -> User:
    return User.objects.get(id=user_id)

def student_list() -> QuerySet[Student]:
    return Student.objects.select_related('user').all().order_by('nim')

def student_get_by_user(user: User) -> Student:
    return Student.objects.select_related('user').get(user=user)

def lecturer_list() -> QuerySet[Lecturer]:
    return Lecturer.objects.select_related('user').all().order_by('nidn')

def lecturer_get_by_user(user: User) -> Lecturer:
    return Lecturer.objects.select_related('user').get(user=user)
