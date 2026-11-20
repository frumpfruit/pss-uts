from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceSessionViewSet, AttendanceRecordViewSet

router = DefaultRouter()
router.register('sessions', AttendanceSessionViewSet, basename='attendance_session')
router.register('records', AttendanceRecordViewSet, basename='attendance_record')

urlpatterns = [
    path('', include(router.urls)),
]
