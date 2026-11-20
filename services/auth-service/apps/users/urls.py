from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomLoginView, CurrentUserView, StudentListView, LecturerListView, UserListView

urlpatterns = [
    path('auth/login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('students/', StudentListView.as_view(), name='student_list'),
    path('lecturers/', LecturerListView.as_view(), name='lecturer_list'),
    path('users/', UserListView.as_view(), name='user_list'),
]
