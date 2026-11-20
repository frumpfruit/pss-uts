from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Enrollment, EnrollmentItem
from .serializers import EnrollmentSerializer, EnrollmentItemSerializer
from .services import submit_enrollment, approve_enrollment, reject_enrollment, recalculate_enrollment_sks

class EnrollmentViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Enrollment.objects.prefetch_related('items').all().order_by('-created_at')
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student_id')
        status_param = self.request.query_params.get('status')
        academic_year = self.request.query_params.get('academic_year')
        if student_id:
            qs = qs.filter(student_id=student_id)
        if status_param:
            qs = qs.filter(status=status_param)
        if academic_year:
            qs = qs.filter(academic_year=academic_year)
        return qs

    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            return Enrollment.objects.get(pk=pk)
        except (Enrollment.DoesNotExist, ValueError):
            enrollment = Enrollment.objects.filter(student_id=pk).order_by('-created_at').first()
            if enrollment:
                return enrollment
            raise

    @action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk=None):
        enrollment = self.get_object()
        enrollment = submit_enrollment(enrollment.id)
        return Response({
            'success': True,
            'message': 'KRS berhasil diajukan untuk verifikasi.',
            'data': EnrollmentSerializer(enrollment).data,
            'krs': EnrollmentSerializer(enrollment).data
        })

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        enrollment = self.get_object()
        approver = request.data.get('approved_by', 'Administrator Akademik')
        note = request.data.get('approval_note', '')
        enrollment = approve_enrollment(enrollment.id, approver, note)
        return Response({
            'success': True,
            'message': 'KRS berhasil disetujui.',
            'data': EnrollmentSerializer(enrollment).data,
            'krs': EnrollmentSerializer(enrollment).data
        })

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        enrollment = self.get_object()
        rejector = request.data.get('approved_by', 'Administrator Akademik')
        reason = request.data.get('approval_note', 'Pilihan mata kuliah belum sesuai kurikulum.')
        enrollment = reject_enrollment(enrollment.id, rejector, reason)
        return Response({
            'success': True,
            'message': 'KRS ditolak dengan catatan evaluasi.',
            'data': EnrollmentSerializer(enrollment).data,
            'krs': EnrollmentSerializer(enrollment).data
        })

    @action(detail=True, methods=['post'], url_path='request-revision')
    def request_revision(self, request, pk=None):
        enrollment = self.get_object()
        reason = request.data.get('reason', 'Mahasiswa mengajukan izin penyesuaian mata kuliah.')
        enrollment.status = Enrollment.Status.REVISION_REQUESTED
        enrollment.approval_note = f"Permohonan Izin Ubah KRS: {reason}"
        enrollment.save()
        return Response({
            'success': True,
            'message': 'Permohonan izin perubahan KRS berhasil dikirim ke Dosen Wali.',
            'data': EnrollmentSerializer(enrollment).data,
            'krs': EnrollmentSerializer(enrollment).data
        })

    @action(detail=True, methods=['post'], url_path='unlock')
    def unlock(self, request, pk=None):
        enrollment = self.get_object()
        approver = request.data.get('unlocked_by', 'Dr. Ir. Budi Santoso, M.Kom. (Dosen Wali)')
        note = request.data.get('approval_note', 'Izin perubahan KRS diberikan oleh Dosen Wali. Silakan sesuaikan mata kuliah.')
        enrollment.status = Enrollment.Status.DRAFT
        enrollment.approval_note = note
        enrollment.approved_by = approver
        enrollment.save()
        return Response({
            'success': True,
            'message': 'Kunci KRS berhasil dibuka. Mahasiswa diizinkan mengubah mata kuliah.',
            'data': EnrollmentSerializer(enrollment).data,
            'krs': EnrollmentSerializer(enrollment).data
        })

    @action(detail=True, methods=['post'], url_path='add-item')
    def add_item(self, request, pk=None):
        enrollment = self.get_object()
        if enrollment.status != Enrollment.Status.DRAFT and enrollment.status != Enrollment.Status.REJECTED:
            return Response({
                'error': 'KRS sudah diverifikasi / terkunci. Ajukan izin ubah KRS terlebih dahulu jika ingin menambah/mengubah mata kuliah.'
            }, status=400)

        course_id = request.data.get('course_id') or request.data.get('id')
        if course_id and enrollment.items.filter(course_id=course_id).exists():
            return Response({'error': 'Mata kuliah ini sudah ada di dalam KRS Anda.'}, status=400)

        sks = int(request.data.get('sks', 3))
        if enrollment.total_sks + sks > enrollment.max_sks:
            return Response({'error': f'Total SKS akan melebihi batas maksimum ({enrollment.max_sks} SKS).'}, status=400)

        item = EnrollmentItem.objects.create(
            enrollment=enrollment,
            course_id=course_id,
            course_code=request.data.get('course_code', 'MK-BARU'),
            course_name=request.data.get('course_name', 'Mata Kuliah Baru'),
            class_id=request.data.get('class_id', request.data.get('id')),
            class_code=request.data.get('class_code', 'A11.4401'),
            sks=sks,
            lecturer_name=request.data.get('lecturer_name', ''),
            schedule_day=request.data.get('schedule_day', 'Senin'),
            schedule_time=request.data.get('schedule_time', request.data.get('time_slot', '08:40 - 11:10')),
            room_code=request.data.get('room_code', 'H.4.1')
        )
        recalculate_enrollment_sks(enrollment)
        enrollment.refresh_from_db()
        return Response({
            'success': True,
            'message': f'Mata kuliah {item.course_name} ({item.sks} SKS) berhasil ditambahkan.',
            'item': EnrollmentItemSerializer(item).data,
            'data': EnrollmentSerializer(enrollment).data,
            'krs': EnrollmentSerializer(enrollment).data
        })

    @action(detail=True, methods=['delete', 'post'], url_path='remove-item(?:/(?P<item_id>[^/.]+))?')
    def remove_item(self, request, pk=None, item_id=None):
        enrollment = self.get_object()
        if enrollment.status != Enrollment.Status.DRAFT and enrollment.status != Enrollment.Status.REJECTED:
            return Response({
                'error': 'KRS sudah diverifikasi / terkunci. Ajukan izin ubah KRS terlebih dahulu jika ingin menambah/mengubah mata kuliah.'
            }, status=400)

        target_item_id = item_id or request.data.get('item_id') or request.query_params.get('item_id')
        if not target_item_id:
            return Response({'error': 'Parameter item_id diperlukan.'}, status=400)

        deleted_count, _ = EnrollmentItem.objects.filter(
            enrollment=enrollment
        ).filter(
            Q(id=target_item_id) | Q(course_id=target_item_id)
        ).delete()

        recalculate_enrollment_sks(enrollment)
        enrollment.refresh_from_db()
        return Response({
            'success': True,
            'message': 'Mata kuliah dihapus dari KRS.',
            'data': EnrollmentSerializer(enrollment).data,
            'krs': EnrollmentSerializer(enrollment).data
        })
