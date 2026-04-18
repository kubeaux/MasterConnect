from rest_framework import viewsets, permissions
from .models import Wish
from .serializers import WishSerializer

class WishViewSet(viewsets.ModelViewSet):
    queryset = Wish.objects.all()
    serializer_class = WishSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'is_superuser', False):
            return Wish.objects.all()
        return Wish.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)