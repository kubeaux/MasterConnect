from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction # L'outil magique pour les requêtes groupées
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

    @action(detail=False, methods=['post'], url_path='reorder')
    def reorder(self, request):
        user = request.user
        if getattr(user, 'user_type', '') != 'student':
            return Response({"error": "Non autorisé"}, status=403)

        wishes_data = request.data

        try:
            with transaction.atomic():
                for item in wishes_data:
                    Wish.objects.filter(id=item['id'], student=user).update(rank=-item['id'])

                for item in wishes_data:
                    Wish.objects.filter(id=item['id'], student=user).update(rank=item['rank'])

            return Response({"message": "Classement sauvegardé !"}, status=200)
        except Exception as e:
            return Response({"error": "Erreur lors de la sauvegarde"}, status=400)