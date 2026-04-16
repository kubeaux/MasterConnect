from rest_framework import serializers
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = [
            'id',
            'student',
            'project',
        ]

    def validate(self, data):
        student = data.get('student')
        project = data.get('project')

        if student.user_type != 'student':
            raise serializers.ValidationError("Assignments can only be created for students.")

        queryset = Assignment.objects.filter(project=project)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.count() >= project.capacity:
            raise serializers.ValidationError("This project has already reached its capacity.")

        return data