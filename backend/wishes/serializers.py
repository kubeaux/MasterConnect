from rest_framework import serializers
from .models import Wish

class WishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wish
        fields = [
            'id',
            'student',
            'project',
            'rank',
        ]

    def validate(self, data):
        student = data.get('student')
        project = data.get('project')
        rank = data.get('rank')

        if student.user_type != 'student':
            raise serializers.ValidationError("Only users with type 'student' can create wishes.")

        if rank < 1 or rank > 5:
            raise serializers.ValidationError("Rank must be between 1 and 5.")

        queryset = Wish.objects.filter(student=student)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if not self.instance and queryset.count() >= 5:
            raise serializers.ValidationError("A student can have at most 5 wishes.")

        if queryset.filter(project=project).exists():
            raise serializers.ValidationError("This student already selected this project.")

        if queryset.filter(rank=rank).exists():
            raise serializers.ValidationError("This student already used this rank.")

        return data