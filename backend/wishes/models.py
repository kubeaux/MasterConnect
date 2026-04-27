from django.db import models
from django.conf import settings
from projects.models import Project

class Wish(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='student_wishes',
        limit_choices_to={'user_type': 'etudiant'}
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    rank = models.PositiveIntegerField() # 1, 2, 3...

    class Meta:
        unique_together = ('student', 'rank')
        ordering = ['rank']

    def __str__(self):
        return f"Rank {self.rank}: {self.student.username} -> {self.project.title}"