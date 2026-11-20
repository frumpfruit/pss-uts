from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        recipient_id = self.request.query_params.get('recipient_id')
        role = self.request.query_params.get('role')
        unread_only = self.request.query_params.get('unread')

        if recipient_id and role:
            qs = qs.filter(models.Q(recipient_id=recipient_id) | models.Q(recipient_role=role) | models.Q(recipient_role='ALL'))
        elif recipient_id:
            qs = qs.filter(recipient_id=recipient_id)
        elif role:
            qs = qs.filter(recipient_role=role)

        if unread_only and unread_only.lower() == 'true':
            qs = qs.filter(is_read=False)

        return qs

    @action(detail=True, methods=['patch', 'post'], url_path='read')
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save(update_fields=['is_read', 'read_at'])
        return Response({
            'success': True,
            'data': NotificationSerializer(notification).data
        })

    @action(detail=False, methods=['patch', 'post'], url_path='read-all')
    def mark_all_as_read(self, request):
        recipient_id = request.data.get('recipient_id')
        role = request.data.get('role')
        qs = Notification.objects.filter(is_read=False)
        if recipient_id:
            qs = qs.filter(recipient_id=recipient_id)
        if role:
            qs = qs.filter(recipient_role=role)

        count = qs.update(is_read=True, read_at=timezone.now())
        return Response({
            'success': True,
            'message': f'{count} notifikasi ditandai sudah dibaca.',
            'count': count
        })
