from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='user_type')
    prenom = serializers.CharField(source='first_name')
    nom = serializers.CharField(source='last_name')

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'user_type', 'role', 
            'first_name', 'last_name', 'prenom', 'nom', 
            'num_etudiant', 'departement', 'statut_validation',
            'date_joined', 'is_active'
        ]
        read_only_fields = ('id', 'date_joined')

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer spécifique pour le profil de l'utilisateur connecté"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'user_type', 'first_name', 'last_name',)