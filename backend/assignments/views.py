from rest_framework import viewsets, permissions
from .models import Assignment
from .serializers import AssignmentSerializer
from users.permissions import IsAdminUserType


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminUserType()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Assignment.objects.none()
        if user.user_type == 'administrateur':
            return Assignment.objects.all()
        if user.user_type == 'etudiant':
            return Assignment.objects.filter(student=user)
        if user.user_type == 'encadrant':
            return Assignment.objects.filter(project__teacher=user)
        return Assignment.objects.none()