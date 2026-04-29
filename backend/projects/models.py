from django.db import models
from django.conf import settings

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        limit_choices_to={'user_type': 'encadrant'} 
    )
    capacity = models.IntegerField(default=1)
    
    domaine = models.CharField(max_length=100, default='Informatique')
    statut_validation = models.CharField(
        max_length=20, 
        choices=[
            ('EN_ATTENTE', 'En attente'), 
            ('APPROUVE', 'Approuvé'),
            ('REFUSE', 'Refusé'),
        ],
        default='EN_ATTENTE'
    )

    def __str__(self):
        return self.title