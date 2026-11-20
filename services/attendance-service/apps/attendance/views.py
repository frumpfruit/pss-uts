from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import AttendanceSession, AttendanceRecord
from .serializers import AttendanceSessionSerializer, AttendanceRecordSerializer
from .services import calculate_student_attendance_stats

class AttendanceSessionViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = AttendanceSession.objects.prefetch_related('records').all()
    serializer_class = AttendanceSessionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        class_id = self.request.query_params.get('class_id')
        lecturer_id = self.request.query_params.get('lecturer_id')
        if class_id:
            qs = qs.filter(class_id=class_id)
        if lecturer_id:
            qs = qs.filter(lecturer_id=lecturer_id)
        return qs

    @action(detail=True, methods=['post'], url_path='close')
    def close_session(self, request, pk=None):
        session = self.get_object()
        session.status = AttendanceSession.SessionStatus.CLOSED
        session.closed_at = timezone.now()
        session.save(update_fields=['status', 'closed_at'])
        return Response({
            'success': True,
            'message': f'Sesi presensi pertemuan #{session.session_number} telah ditutup.',
            'data': AttendanceSessionSerializer(session).data
        })

    @action(detail=True, methods=['post'], url_path='record-presence')
    def record_presence(self, request, pk=None):
        session = self.get_object()

        # 1. Check if closed by lecturer
        if session.status == AttendanceSession.SessionStatus.CLOSED or session.closed_at:
            return Response({
                'success': False,
                'message': 'Sesi presensi ini telah resmi ditutup oleh dosen pengampu.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 2. Check date deadline
        now = timezone.localtime()
        today = now.date()
        if session.date < today:
            session.status = AttendanceSession.SessionStatus.CLOSED
            session.save(update_fields=['status'])
            return Response({
                'success': False,
                'message': f'Batas waktu presensi telah berakhir. Tanggal sesi ({session.date}) telah lewat.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 3. Check time deadline if date is today
        if session.date == today and session.end_time:
            try:
                parts = [int(p) for p in str(session.end_time).split(':')]
                end_hour, end_min = parts[0], parts[1]
                if now.hour > end_hour or (now.hour == end_hour and now.minute >= end_min):
                    session.status = AttendanceSession.SessionStatus.CLOSED
                    session.save(update_fields=['status'])
                    return Response({
                        'success': False,
                        'message': f'Batas jam presensi ({session.end_time} WIB) telah berakhir.'
                    }, status=status.HTTP_400_BAD_REQUEST)
            except Exception:
                pass

        # 4. Valid presence submission
        student_id = request.data.get('student_id')
        student_nim = request.data.get('student_nim', 'A11.2023.14920')
        student_name = request.data.get('student_name', 'Arya Pratama')

        if not student_id:
            return Response({
                'success': False,
                'message': 'Parameter student_id diperlukan.'
            }, status=status.HTTP_400_BAD_REQUEST)

        record, created = AttendanceRecord.objects.update_or_create(
            session=session,
            student_id=student_id,
            defaults={
                'student_nim': student_nim,
                'student_name': student_name,
                'status': AttendanceRecord.Status.PRESENT,
                'notes': ''
            }
        )

        return Response({
            'success': True,
            'message': 'Kehadiran berhasil diverifikasi dan dicatat ke database.',
            'record': AttendanceRecordSerializer(record).data,
            'session': AttendanceSessionSerializer(session).data
        })

    @action(detail=True, methods=['post'], url_path='bulk-record')
    def bulk_record(self, request, pk=None):
        session = self.get_object()
        records_data = request.data.get('records', [])
        saved = []
        for r in records_data:
            record, _ = AttendanceRecord.objects.update_or_create(
                session=session,
                student_id=r.get('student_id'),
                defaults={
                    'student_nim': r.get('student_nim', ''),
                    'student_name': r.get('student_name', ''),
                    'status': r.get('status', AttendanceRecord.Status.PRESENT),
                    'notes': r.get('notes', '')
                }
            )
            saved.append(record)
        return Response({
            'success': True,
            'message': f'Berhasil mencatat presensi untuk {len(saved)} mahasiswa.'
        })

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = AttendanceRecord.objects.select_related('session').all()
    serializer_class = AttendanceRecordSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student_id')
        session_id = self.request.query_params.get('session_id')
        if student_id:
            qs = qs.filter(student_id=student_id)
        if session_id:
            qs = qs.filter(session_id=session_id)
        return qs

    @action(detail=False, methods=['get'], url_path='student-summary')
    def student_summary(self, request):
        student_id = request.query_params.get('student_id')
        class_id = request.query_params.get('class_id')
        if not student_id:
            return Response({'error': 'student_id parameter diperlukan'}, status=400)

        stats = calculate_student_attendance_stats(student_id, class_id)
        return Response({
            'success': True,
            'data': stats
        })
