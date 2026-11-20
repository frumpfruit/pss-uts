from rest_framework import serializers
from .models import Enrollment, EnrollmentItem

class EnrollmentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrollmentItem
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    items = EnrollmentItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Enrollment
        fields = '__all__'
