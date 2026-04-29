from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    titre = serializers.CharField(source='title')
    capacite = serializers.IntegerField(source='capacity')
    teacher_name = serializers.ReadOnlyField(source='teacher.first_name')
    teacher = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'titre', 'description', 'capacite', 'domaine',
                  'statut_validation', 'teacher', 'teacher_name']

    def validate_capacity(self, value):
        if value < 1:
            raise serializers.ValidationError("Capacity must be at least 1.")
        return value