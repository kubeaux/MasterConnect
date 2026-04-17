from django.test import TestCase
from django.db.utils import IntegrityError
from users.models import User
from projects.models import Project
from wishes.models import Wish

class WishModelTest(TestCase):
    def setUp(self):
        # On prépare des données de base 
        self.teacher = User.objects.create_user(username="prof1", user_type="teacher")
        self.student = User.objects.create_user(username="eleve1", user_type="student")
        self.project = Project.objects.create(title="IA", teacher=self.teacher, capacity=1)

    def test_wish_creation(self):
        """Vérifie qu'un vœu est bien enregistré en base"""
        wish = Wish.objects.create(student=self.student, project=self.project, rank=1)
        self.assertEqual(wish.rank, 1)
        self.assertEqual(Wish.objects.count(), 1)

    def test_unique_wish_constraint(self):
        """Vérifie qu'un étudiant ne peut pas mettre deux fois le même projet"""
        Wish.objects.create(student=self.student, project=self.project, rank=1)
        with self.assertRaises(IntegrityError):
            # On tente de recréer le même vœu
            Wish.objects.create(student=self.student, project=self.project, rank=2)