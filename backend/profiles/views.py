from rest_framework import generics, permissions
from .models import SeekerProfile
from .serializers import SeekerProfileSerializer

class SeekerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = SeekerProfileSerializer

    def get_object(self):
        profile, created = SeekerProfile.objects.get_or_create(user=self.request.user)
        return profile
