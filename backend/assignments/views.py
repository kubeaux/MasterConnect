from rest_framework import viewsets, permissions
from .models import Assignment
from .serializers import AssignmentSerializer

class isStudentOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_staff or getattr(request.user, 'user_type', '') == 'student'

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [isStudentOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'user_type', '') == 'student':
            return Assignment.objects.filter(student=user)
        return super().get_queryset()