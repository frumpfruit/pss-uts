from rest_framework import serializers
from .models import Faculty, StudyProgram, AcademicYear, Room, Course, CourseClass, Schedule

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'

class StudyProgramSerializer(serializers.ModelSerializer):
    faculty_name = serializers.ReadOnlyField(source='faculty.name')

    class Meta:
        model = StudyProgram
        fields = '__all__'

class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    study_program_name = serializers.ReadOnlyField(source='study_program.name')
    prerequisite_name = serializers.ReadOnlyField(source='prerequisite_course.name')

    class Meta:
        model = Course
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    room_code = serializers.ReadOnlyField(source='room.code')
    room_building = serializers.ReadOnlyField(source='room.building')
    class_code = serializers.ReadOnlyField(source='course_class.class_code')
    course_code = serializers.ReadOnlyField(source='course_class.course.code')
    course_name = serializers.ReadOnlyField(source='course_class.course.name')
    sks = serializers.ReadOnlyField(source='course_class.course.sks')
    lecturer_name = serializers.ReadOnlyField(source='course_class.lecturer_name')

    class Meta:
        model = Schedule
        fields = '__all__'

class CourseClassSerializer(serializers.ModelSerializer):
    course_code = serializers.ReadOnlyField(source='course.code')
    course_name = serializers.ReadOnlyField(source='course.name')
    sks = serializers.ReadOnlyField(source='course.sks')
    semester_recommended = serializers.ReadOnlyField(source='course.semester_recommended')
    schedules = ScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = CourseClass
        fields = '__all__'
