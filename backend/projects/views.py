# backend/projects/views.py
from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
   #On autorise tout utilisateur connecté à voir les projets
permission_classes = [permissions.AllowAny]