from rest_framework import serializers
from .models import Project

# backend/projects/serializers.py
from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    # On crée des alias pour que le Frontend 
    titre = serializers.CharField(source='title')
    capacite = serializers.IntegerField(source='capacity')
    teacher_name = serializers.ReadOnlyField(source='teacher.first_name')

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'titre', 
            'description', 'capacity', 'capacite', 
            'domaine', 'statut_validation', 'teacher_name'
        ]
    def validate_capacity(self, value):
        if value < 1:
            raise serializers.ValidationError("Capacity must be at least 1.")
        return value