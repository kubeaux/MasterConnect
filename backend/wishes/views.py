from rest_framework import viewsets, permissions
from .models import Wish
from .serializers import WishSerializer

class IsStudentOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_staff or getattr(request.user, 'user_type', '') == 'student'

class WishViewSet(viewsets.ModelViewSet):
    queryset = Wish.objects.all()
    serializer_class = WishSerializer
    permission_classes = [IsStudentOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'user_type', '') == 'admin':
            return Wish.objects.all()
        if getattr(user, 'user_type', '') == 'student':
            return Wish.objects.filter(student=user)
        return Wish.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)