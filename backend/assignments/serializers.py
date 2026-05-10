from rest_framework import serializers
from .models import Assignment
from projects.serializers import ProjectSerializer


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'student', 'project']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['project'] = ProjectSerializer(instance.project).data
        return rep

    def validate(self, data):
        student = data.get('student')
        project = data.get('project')

        if student.user_type != 'etudiant':
            raise serializers.ValidationError("Assignments can only be created for students.")

        queryset = Assignment.objects.filter(project=project)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.count() >= project.capacity:
            raise serializers.ValidationError("This project has already reached its capacity.")
        return data