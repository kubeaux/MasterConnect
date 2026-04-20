from rest_framework import serializers
from .models import Wish
from projects.serializers import ProjectSerializer

class WishSerializer(serializers.ModelSerializer):
    student = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Wish
        fields = ['id', 'student', 'project', 'rank']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.project:
            representation['project'] = ProjectSerializer(instance.project).data
        return representation

    def validate(self, data):
        student = data.get('student')
        project = data.get('project', getattr(self.instance, 'project', None))
        rank = data.get('rank', getattr(self.instance, 'rank', None))

        if getattr(student, 'user_type', '') != 'student':
            raise serializers.ValidationError("Seul un étudiant peut créer un vœu.")

        queryset = Wish.objects.filter(student=student)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if not self.instance:
            if queryset.count() >= 5:
                raise serializers.ValidationError("Vous avez atteint la limite de 5 vœux.")
            if queryset.filter(project=project).exists():
                raise serializers.ValidationError("Vous avez déjà sélectionné ce projet.")
            
            existing_ranks = set(queryset.values_list('rank', flat=True))
            if rank is None or rank in existing_ranks:
                for r in range(1, 6):
                    if r not in existing_ranks:
                        data['rank'] = r
                        rank = r
                        break

        if rank is not None and (rank < 1 or rank > 5):
            raise serializers.ValidationError("Le rang doit être compris entre 1 et 5.")
        
        if self.instance and rank is not None and queryset.filter(rank=rank).exists():
            raise serializers.ValidationError("Ce rang est déjà utilisé dans vos vœux.")

        return data