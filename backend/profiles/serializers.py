from rest_framework import serializers
from .models import SeekerProfile

class SeekerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeekerProfile
        fields = ['profile_picture', 'resume', 'skills', 'experience', 'education', 'certifications']
