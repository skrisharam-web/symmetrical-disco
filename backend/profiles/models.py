from django.db import models
from django.conf import settings

class SeekerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)  # List of strings
    experience = models.JSONField(default=list, blank=True) # List of {title, company, dates, desc}
    education = models.JSONField(default=list, blank=True) # List of {degree, institution, year}
    certifications = models.JSONField(default=list, blank=True) # List of {name, issuer, year}
    
    def __str__(self):
        return f"{self.user.email}'s Profile"
