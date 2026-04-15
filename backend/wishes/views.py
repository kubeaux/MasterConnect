from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from .models import Wish
from .serializers import WishSerializer

class WishViewSet(viewsets.ModelViewSet):
    queryset = Wish.objects.all()
    serializer_class = WishSerializer

    def perform_create(self, serializer):
        student = serializer.validated_data.get('student')
        project = serializer.validated_data.get('project')
        rank = serializer.validated_data.get('rank')

        # Rule 1: only students can have wishes
        if student.user_type != 'student':
            raise ValidationError("Only users with type 'student' can create wishes.")

        # Rule 2: a student can have at most 5 wishes
        if Wish.objects.filter(student=student).count() >= 5:
            raise ValidationError("A student can have at most 5 wishes.")

        # Rule 3: same project cannot appear twice in same student's list
        if Wish.objects.filter(student=student, project=project).exists():
            raise ValidationError("This student already selected this project.")

        # Rule 4: rank must be between 1 and 5
        if rank < 1 or rank > 5:
            raise ValidationError("Rank must be between 1 and 5.")

        serializer.save()