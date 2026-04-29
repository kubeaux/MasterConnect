from rest_framework import serializers
from .models import Wish
from projects.serializers import ProjectSerializer
from projects.models import Project


class WishSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())

    class Meta:
        model = Wish
        fields = ['id', 'student', 'project', 'rank']
        read_only_fields = ['student']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['project'] = ProjectSerializer(instance.project).data
        return rep

    def validate(self, data):
        request = self.context.get('request')
        student = request.user if request and request.user.is_authenticated else None
        project = data.get('project')
        rank = data.get('rank')

        if not student or student.user_type != 'etudiant':
            raise serializers.ValidationError("Seuls les étudiants peuvent créer des vœux.")

        if rank is None or rank < 1 or rank > 5:
            raise serializers.ValidationError({"rank": "Le rang doit être entre 1 et 5."})

        qs = Wish.objects.filter(student=student)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if not self.instance and qs.count() >= 5:
            raise serializers.ValidationError("Vous avez déjà 5 vœux.")

        if qs.filter(project=project).exists():
            raise serializers.ValidationError({"project": "Ce projet est déjà dans vos vœux."})

        if qs.filter(rank=rank).exists():
            raise serializers.ValidationError({"rank": "Ce rang est déjà utilisé."})

        return data