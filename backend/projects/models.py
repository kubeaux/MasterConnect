from django.db import models
from django.conf import settings

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    # On lie le projet à un encadrant
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        limit_choices_to={'user_type': 'teacher'}
    )
    capacity = models.IntegerField(default=1) # Nombre d'étudiants dans le groupe

    def __str__(self):
        return self.title