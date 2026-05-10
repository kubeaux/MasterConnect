from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
    ('etudiant', 'Étudiant'),
    ('encadrant', 'Encadrant'),
    ('administrateur', 'Administrateur'),
    )

    STATUT_VALIDATION_CHOICES = (
        ('EN_ATTENTE', 'En attente'),
        ('APPROUVE', 'Approuvé'),
        ('REFUSE', 'Refusé'),
    )

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='etudiant')
    num_etudiant = models.CharField(max_length=20, blank=True, null=True)
    departement = models.CharField(max_length=100, blank=True, default='')
    statut_validation = models.CharField(
        max_length=20,
        choices=STATUT_VALIDATION_CHOICES,
        default='APPROUVE'
    )