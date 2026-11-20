from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FacultyViewSet, StudyProgramViewSet, AcademicYearViewSet,
    CourseViewSet, CourseClassViewSet, ScheduleViewSet
)

router = DefaultRouter()
router.register('faculties', FacultyViewSet, basename='faculty')
router.register('study-programs', StudyProgramViewSet, basename='study_program')
router.register('academic-years', AcademicYearViewSet, basename='academic_year')
router.register('courses', CourseViewSet, basename='course')
router.register('classes', CourseClassViewSet, basename='course_class')
router.register('schedules', ScheduleViewSet, basename='schedule')

urlpatterns = [
    path('', include(router.urls)),
]
