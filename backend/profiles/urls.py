from django.urls import path
from .views import SeekerProfileView

urlpatterns = [
    path('me/profile/', SeekerProfileView.as_view(), name='my_profile'),
]
