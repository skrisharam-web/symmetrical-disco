from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        HR = "HR", "Recruiter"
        SEEKER = "SEEKER", "Job Seeker"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.SEEKER)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email
