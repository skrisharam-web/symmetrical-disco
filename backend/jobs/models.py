from django.db import models
from django.conf import settings

class Job(models.Model):
    recruiter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posted_jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    salary_range = models.CharField(max_length=100, blank=True)
    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Dynamic requirements for application
    # Example: {"questions": [{"id": "q1", "text": "Why apply?", "type": "text"}], "attachment_required": true}
    requirements_schema = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.title
