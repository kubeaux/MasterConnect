from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Wish
from .serializers import WishSerializer
from users.permissions import IsStudentForOwnWishes


class WishViewSet(viewsets.ModelViewSet):
    queryset = Wish.objects.all()
    serializer_class = WishSerializer
    permission_classes = [IsStudentForOwnWishes]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Wish.objects.none()
        if user.user_type == "administrateur":
            return Wish.objects.all()
        if user.user_type == "etudiant":
            return Wish.objects.filter(student=user).select_related('project', 'project__teacher')
        return Wish.objects.none()

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        payload = request.data
        if not isinstance(payload, list):
            return Response({"error": "Format attendu : liste."}, status=400)

        user = request.user
        if user.user_type != 'etudiant':
            return Response({"error": "Réservé aux étudiants."}, status=403)

        ids = [item.get('id') for item in payload]
        ranks = [item.get('rank') for item in payload]
        if len(set(ids)) != len(ids) or len(set(ranks)) != len(ranks):
            return Response({"error": "IDs ou rangs en doublon."}, status=400)

        with transaction.atomic():
            for i, item in enumerate(payload):
                Wish.objects.filter(id=item['id'], student=user).update(rank=10000 + i)
            for item in payload:
                Wish.objects.filter(id=item['id'], student=user).update(
                    rank=int(item['rank']),
                    motivation=item.get('motivation', '')
                )

        return Response({"status": "reordered", "count": len(payload)})