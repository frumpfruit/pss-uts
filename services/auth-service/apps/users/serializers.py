from rest_framework import serializers
from .models import User, Student, Lecturer

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'role', 'phone_number', 'avatar_url', 'is_active_campus']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'user', 'nim', 'study_program_id', 'study_program_name',
            'faculty_name', 'current_semester', 'academic_year', 'gpa', 'ips',
            'total_sks_completed', 'target_sks', 'academic_status', 'admission_year'
        ]


class LecturerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Lecturer
        fields = [
            'id', 'user', 'nidn', 'nip', 'academic_title',
            'faculty_name', 'study_program_name', 'status'
        ]
