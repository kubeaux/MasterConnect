from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    teacher = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'teacher',
            'capacity',
        ]

    def validate_capacity(self, value):
        if value < 1:
            raise serializers.ValidationError("Capacity must be at least 1.")
        return value
    
    def validate(self, data):
        user = self.context.get('request').user
        if getattr(user, 'user_type', '') == 'student':
            raise serializers.ValidationError("Only teachers can create projects.")
        return data