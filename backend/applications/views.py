from rest_framework import viewsets, permissions, status
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Application.objects.none()
        if user.role == 'HR':
            # HR sees applications to their jobs
            queryset = Application.objects.filter(job__recruiter=user)
        else:
            # Seekers see their own applications
            queryset = Application.objects.filter(applicant=user)
        
        job_id = self.request.query_params.get('job')
        if job_id:
            queryset = queryset.filter(job_id=job_id)
            
        return queryset

    def perform_create(self, serializer):
        # Ensure user is Seeker? Or anyone can apply?
        # Typically Seekers apply.
        serializer.save(applicant=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        application = self.get_object()
        # Only job recruiter can update status
        if application.job.recruiter != request.user:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        if new_status in Application.Status.values:
            application.status = new_status
            application.save()
            return Response({"status": "updated"})
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def download_resume(self, request, pk=None):
        application = self.get_object()
        # Verify access
        if application.job.recruiter != request.user and application.applicant != request.user:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
            
        if hasattr(application.applicant, 'profile') and application.applicant.profile.resume:
            resume = application.applicant.profile.resume
            response = HttpResponse(resume.open(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{resume.name.split("/")[-1]}"'
            return response
            
        return Response({"error": "No resume found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def view_resume(self, request, pk=None):
        application = self.get_object()
        # Verify access
        if application.job.recruiter != request.user and application.applicant != request.user:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
            
        if hasattr(application.applicant, 'profile') and application.applicant.profile.resume:
            resume = application.applicant.profile.resume
            # Determine content type (simple guess, can be improved)
            content_type = 'application/pdf' if resume.name.lower().endswith('.pdf') else 'application/octet-stream'
            
            response = HttpResponse(resume.open(), content_type=content_type)
            response['Content-Disposition'] = f'inline; filename="{resume.name.split("/")[-1]}"'
            return response
            
        return Response({"error": "No resume found"}, status=status.HTTP_404_NOT_FOUND)
