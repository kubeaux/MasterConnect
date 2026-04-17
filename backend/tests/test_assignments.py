from django.test import TestCase
from django.db.utils import IntegrityError
from users.models import User
from projects.models import Project
from assignments.models import Assignment

class AssignmentModelTest(TestCase):
    def setUp(self):
        self.teacher = User.objects.create_user(username="prof1", user_type="teacher")
        self.student = User.objects.create_user(username="student1", user_type="student")
        self.project1 = Project.objects.create(title="Projet A", teacher=self.teacher)
        self.project2 = Project.objects.create(title="Projet B", teacher=self.teacher)

    def test_assignment_successful(self):
        """Vérifie qu'on peut affecter un projet à un étudiant"""
        assignment = Assignment.objects.create(student=self.student, project=self.project1)
        self.assertEqual(assignment.project.title, "Projet A")

    def test_student_unique_assignment(self):
        """Vérifie qu'un étudiant ne peut pas avoir DEUX projets affectés (Contrainte OneToOne)"""
        Assignment.objects.create(student=self.student, project=self.project1)
        with self.assertRaises(IntegrityError):
            # Tentative d'affecter un deuxième projet au même étudiant
            Assignment.objects.create(student=self.student, project=self.project2)