from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Faculty, StudyProgram, AcademicYear, Room, Course, CourseClass, Schedule
from .serializers import (
    FacultySerializer, StudyProgramSerializer, AcademicYearSerializer,
    RoomSerializer, CourseSerializer, CourseClassSerializer, ScheduleSerializer
)
from .services import detect_schedule_conflicts

class FacultyViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Faculty.objects.all().order_by('code')
    serializer_class = FacultySerializer

class StudyProgramViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = StudyProgram.objects.select_related('faculty').all().order_by('code')
    serializer_class = StudyProgramSerializer

class AcademicYearViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = AcademicYear.objects.all().order_by('-year')
    serializer_class = AcademicYearSerializer

class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Course.objects.select_related('study_program', 'prerequisite_course').all().order_by('code')
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        study_program_id = self.request.query_params.get('study_program_id')
        semester = self.request.query_params.get('semester')
        if study_program_id:
            qs = qs.filter(study_program_id=study_program_id)
        if semester:
            qs = qs.filter(semester_recommended=semester)
        return qs

class CourseClassViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = CourseClass.objects.select_related('course', 'academic_year').prefetch_related('schedules__room').all()
    serializer_class = CourseClassSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        course_id = self.request.query_params.get('course_id')
        lecturer_id = self.request.query_params.get('lecturer_id')
        if course_id:
            qs = qs.filter(course_id=course_id)
        if lecturer_id:
            qs = qs.filter(lecturer_id=lecturer_id)
        return qs

class ScheduleViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Schedule.objects.select_related('course_class__course', 'room').all().order_by('day', 'start_time')
    serializer_class = ScheduleSerializer

    @action(detail=False, methods=['post'], url_path='check-conflicts')
    def check_conflicts(self, request):
        schedule_ids = request.data.get('schedule_ids', [])
        conflicts = detect_schedule_conflicts(schedule_ids)
        has_conflict = len(conflicts) > 0
        return Response({
            'success': True,
            'has_conflict': has_conflict,
            'conflicts': [{'schedule_1': c[0], 'schedule_2': c[1], 'message': c[2]} for c in conflicts]
        })
