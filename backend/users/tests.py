from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User


class UserAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin1",
            password="testpass123",
            user_type="admin"
        )
        self.teacher = User.objects.create_user(
            username="teacher1",
            password="testpass123",
            user_type="teacher"
        )
        self.student = User.objects.create_user(
            username="student1",
            password="testpass123",
            user_type="student"
        )
        self.url = "/api/users/"

    def test_admin_can_list_users(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_teacher_cannot_list_users(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_list_users(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_list_users(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_user(self):
        self.client.force_authenticate(user=self.admin)

        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "user_type": "student",
            "num_etudiant": "12345",
            "is_staff": False
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_teacher_cannot_create_user(self):
        self.client.force_authenticate(user=self.teacher)

        data = {
            "username": "blockedteacher",
            "email": "blockedteacher@example.com",
            "user_type": "student",
            "num_etudiant": "12345",
            "is_staff": False
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_create_user(self):
        self.client.force_authenticate(user=self.student)

        data = {
            "username": "blockedstudent",
            "email": "blockedstudent@example.com",
            "user_type": "student",
            "num_etudiant": "12345",
            "is_staff": False
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_create_user(self):
        data = {
            "username": "blockedanon",
            "email": "blockedanon@example.com",
            "user_type": "student",
            "num_etudiant": "12345",
            "is_staff": False
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)