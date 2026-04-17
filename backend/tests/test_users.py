from django.test import TestCase
from users.models import User

class UserModelTest(TestCase):
    def test_create_student(self):
        user = User.objects.create_user(username="test_student", user_type="student")
        self.assertEqual(user.user_type, "student")
        self.assertFalse(user.is_staff) # Un étudiant n'est pas admin

    def test_num_etudiant_required_logic(self):
        # tester si tes règles de numéro d'étudiant sont respecté
        user = User.objects.create_user(username="s1", user_type="student", num_etudiant="12345")
        self.assertEqual(user.num_etudiant, "12345")