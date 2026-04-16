from rest_framework import viewsets
from .models import Assignment
from .serializers import AssignmentSerializer
from users.permissions import IsAdminUserType


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAdminUserType]