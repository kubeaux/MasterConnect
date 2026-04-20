from rest_framework import serializers
from .models import Wish

class WishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wish
        fields = ['id', 'student', 'project', 'rank']
        read_only_fields = ['student']

    def validate(self, data):
        request = self.context.get('request')
        student = request.user

        project = data.get('project', getattr(self.instance, 'project', None))
        rank = data.get('rank', getattr(self.instance, 'rank', None))

        if getattr(student, 'user_type', '') != 'student':
            raise serializers.ValidationError("Seul un étudiant peut créer un vœu.")

        if rank is not None and (rank < 1 or rank > 5):
            raise serializers.ValidationError("Le rang doit être compris entre 1 et 5.")

        queryset = Wish.objects.filter(student=student)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if not self.instance:
            if queryset.count() >= 5:
                raise serializers.ValidationError("Vous avez atteint la limite de 5 vœux.")
            if queryset.filter(project=project).exists():
                raise serializers.ValidationError("Vous avez déjà sélectionné ce projet.")

        if rank is not None and queryset.filter(rank=rank).exists():
            raise serializers.ValidationError("Ce rang est déjà utilisé dans vos vœux.")

        return data