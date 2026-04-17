from django.test import TestCase
from users.models import User
from projects.models import Project

class ProjectModelTest(TestCase):
    def setUp(self):
        # Création d'un prof pour lier les projets
        self.teacher = User.objects.create_user(username="prof_test", user_type="teacher")

    def test_project_creation(self):
        """Vérifie qu'un projet est bien créé avec ses attributs"""
        project = Project.objects.create(
            title="Optimisation des données",
            teacher=self.teacher,
            capacity=2
        )
        self.assertEqual(project.capacity, 2)
        self.assertEqual(project.teacher.username, "prof_test")

    def test_project_str(self):
        """Vérifie que l'affichage du projet est le titre  pour l'admin)"""
        project = Project.objects.create(title="Blockchain", teacher=self.teacher)
        self.assertEqual(str(project), "Blockchain")