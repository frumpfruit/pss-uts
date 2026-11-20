from decimal import Decimal
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Grade
from .serializers import GradeSerializer
from .services import update_student_grade, publish_class_grades

class GradeViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Grade.objects.all().order_by('course_code')
    serializer_class = GradeSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student_id')
        class_id = self.request.query_params.get('class_id')
        published_only = self.request.query_params.get('published_only')

        if student_id:
            qs = qs.filter(student_id=student_id)
        if class_id:
            qs = qs.filter(class_id=class_id)
        if published_only and published_only.lower() == 'true':
            qs = qs.filter(is_published=True)

        return qs

    @action(detail=True, methods=['patch', 'put'], url_path='update-scores')
    def update_scores(self, request, pk=None):
        grade = self.get_object()
        assignment = Decimal(str(request.data.get('assignment_score', grade.assignment_score)))
        midterm = Decimal(str(request.data.get('midterm_score', grade.midterm_score)))
        final = Decimal(str(request.data.get('final_score', grade.final_score)))
        attendance = Decimal(str(request.data.get('attendance_score', grade.attendance_score)))

        updated_grade = update_student_grade(grade, assignment, midterm, final, attendance)
        return Response({
            'success': True,
            'message': 'Nilai berhasil diperbarui dan dikalkulasi otomatis.',
            'data': GradeSerializer(updated_grade).data
        })

    @action(detail=False, methods=['post'], url_path='publish-class')
    def publish_class(self, request):
        class_id = request.data.get('class_id')
        if not class_id:
            return Response({'error': 'Parameter class_id diperlukan.'}, status=400)

        count = publish_class_grades(class_id)
        return Response({
            'success': True,
            'message': f'Berhasil mempublikasikan nilai untuk {count} mahasiswa.',
            'count': count
        })
