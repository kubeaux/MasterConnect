from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Assignment
from .serializers import AssignmentSerializer
from .services import execute_ils_matching
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

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUserType])
    def launch_algorithm(self, request):
        """
        Lance l'algorithme ILS sur la base actuelle.
        Réservé aux administrateurs.
        """
        try:
            iterations = int(request.data.get('iterations', 100))
        except (TypeError, ValueError):
            iterations = 100

        result = execute_ils_matching(max_iterations=iterations)
        http_status = status.HTTP_200_OK if result.get('success') else status.HTTP_400_BAD_REQUEST
        return Response(result, status=http_status)