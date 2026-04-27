from django.db import models
from django.conf import settings
from projects.models import Project

class Assignment(models.Model):
    student = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='final_assignment',
        limit_choices_to={'user_type': 'etudiant'}
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return f"Assignment: {self.student.username} -> {self.project.title}"