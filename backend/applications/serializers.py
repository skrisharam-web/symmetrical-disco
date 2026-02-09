from rest_framework import serializers
from .models import Application
from jobs.models import Job

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    applicant_email = serializers.EmailField(source='applicant.email', read_only=True)
    resume_url = serializers.SerializerMethodField()
    applicant_details = serializers.SerializerMethodField()

    def get_resume_url(self, obj):
        if hasattr(obj.applicant, 'profile') and obj.applicant.profile.resume:
            return obj.applicant.profile.resume.url
        return None

    def get_applicant_details(self, obj):
        if hasattr(obj.applicant, 'profile'):
            profile = obj.applicant.profile
            return {
                'skills': profile.skills,
                'experience': profile.experience,
                'education': profile.education,
                'certifications': getattr(profile, 'certifications', []),
                'profile_picture': profile.profile_picture.url if profile.profile_picture else None
            }
        return None

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('applicant', 'status', 'applied_at')

    def validate(self, attrs):
        job = attrs['job']
        requirement_schema = job.requirements_schema
        responses = attrs.get('responses', {})
        
        # Basic validation against schema
        if requirement_schema:
            questions = requirement_schema.get('questions', [])
            for q in questions:
                q_id = q.get('id')
                if q.get('required', False) and q_id not in responses:
                    raise serializers.ValidationError(f"Missing answer for required question: {q['text']}")
        
        return attrs
