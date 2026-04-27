from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    # On multiplie les chances pour Nathan
    role = serializers.CharField(source='user_type')
    prenom = serializers.CharField(source='first_name')
    nom = serializers.CharField(source='last_name')

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'user_type', 'role', 
            'first_name', 'last_name', 'prenom', 'nom', 'num_etudiant'
        ]
        # On s'assure que l'ID est en lecture seule
        read_only_fields = ('id',)

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer spécifique pour le profil de l'utilisateur connecté"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'user_type', 'first_name', 'last_name')