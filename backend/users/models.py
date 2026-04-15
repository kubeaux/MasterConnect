from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # On définit les rôles pour la logique d'affectation
    USER_TYPE_CHOICES = (
        ('student', 'Étudiant'),
        ('teacher', 'Encadrant'),
        ('admin', 'Administrateur'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    
    # Ajout d'informations nécessaires pour le dossier de recherche
    num_etudiant = models.CharField(max_length=20, blank=True, null=True)