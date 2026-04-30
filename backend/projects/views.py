from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer
from users.permissions import IsProjectOwnerOrAdmin, IsAdminUserType
from rest_framework.decorators import action
from rest_framework.response import Response

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer    
    permission_classes = [IsProjectOwnerOrAdmin]

    def perform_create(self, serializer):
        serializer.save(
            teacher=self.request.user,
            statut_validation='EN_ATTENTE',    
        )

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or user.user_type == 'etudiant':
            return Project.objects.filter(statut_validation='APPROUVE')
        if user.user_type == 'encadrant':
            return Project.objects.filter(teacher=user)
        if user.user_type == 'administrateur':
            return Project.objects.all()
        return Project.objects.none()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserType])
    def approve(self, request, pk=None):
        project = self.get_object()
        project.statut_validation = 'APPROUVE'
        project.save(update_fields=['statut_validation'])
        return Response({'status': 'approved', 'id': project.id})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserType])
    def reject(self, request, pk=None):
        project = self.get_object()
        project.statut_validation = 'REFUSE'
        project.save(update_fields=['statut_validation'])
        return Response({'status': 'rejected', 'id': project.id})