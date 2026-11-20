from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, Student, Lecturer
from .serializers import UserSerializer, StudentSerializer, LecturerSerializer
from .permissions import IsAdminUserRole
from .selectors import student_list, lecturer_list, user_list

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = f"{user.first_name} {user.last_name}".strip()
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            'id': str(user.id),
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'avatar_url': user.avatar_url
        }

        # Attach role specific profile
        if user.role == User.Role.MAHASISWA and hasattr(user, 'student_profile'):
            data['student_profile'] = StudentSerializer(user.student_profile).data
        elif user.role == User.Role.DOSEN and hasattr(user, 'lecturer_profile'):
            data['lecturer_profile'] = LecturerSerializer(user.lecturer_profile).data

        return {
            'success': True,
            'message': 'Autentikasi berhasil',
            'data': data
        }

class CustomLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'user': UserSerializer(user).data
        }
        if user.role == User.Role.MAHASISWA and hasattr(user, 'student_profile'):
            data['student_profile'] = StudentSerializer(user.student_profile).data
        elif user.role == User.Role.DOSEN and hasattr(user, 'lecturer_profile'):
            data['lecturer_profile'] = LecturerSerializer(user.lecturer_profile).data

        return Response({
            'success': True,
            'data': data,
            'message': 'Data profil berhasil diambil'
        })

class StudentListView(APIView):
    def get_permissions(self):
        return [IsAuthenticated()]

    def get(self, request):
        students = student_list()
        serializer = StudentSerializer(students, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'meta': {'total': students.count()}
        })

class LecturerListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lecturers = lecturer_list()
        serializer = LecturerSerializer(lecturers, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'meta': {'total': lecturers.count()}
        })

class UserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        users = user_list()
        serializer = UserSerializer(users, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'meta': {'total': users.count()}
        })
