from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    recruiter_email = serializers.EmailField(source='recruiter.email', read_only=True)

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ('recruiter', 'created_at')
