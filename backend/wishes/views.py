from rest_framework import viewsets, permissions
from .models import Wish
from .serializers import WishSerializer

class WishViewSet(viewsets.ModelViewSet):
    queryset = Wish.objects.all()
    serializer_class = WishSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_staff', False) or getattr(user, 'is_superuser', False):
            return Wish.objects.all()
        return Wish.objects.filter(student=user)