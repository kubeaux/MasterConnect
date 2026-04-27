from rest_framework import viewsets
from .models import Wish
from .serializers import WishSerializer
from users.permissions import IsStudentForOwnWishes


class WishViewSet(viewsets.ModelViewSet):
    queryset = Wish.objects.all()
    serializer_class = WishSerializer
    permission_classes = [IsStudentForOwnWishes]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == "administrateur":
            return Wish.objects.all()
        if user.user_type == "etudiant":
            return Wish.objects.filter(student=user)
        return Wish.objects.none()