from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from projects.models import Project


class ProjectAPITests(APITestCase):
    def setUp(self):
        self.teacher = User.objects.create_user(
            username="teacher1",
            password="testpass123",
            user_type="teacher"
        )
        self.admin = User.objects.create_user(
            username="admin1",
            password="testpass123",
            user_type="admin"
        )
        self.student = User.objects.create_user(
            username="student1",
            password="testpass123",
            user_type="student"
        )
        self.project = Project.objects.create(
            title="Existing Project",
            description="Visible project",
            teacher=self.teacher,
            capacity=1
        )
        self.url = "/api/projects/"

    def test_unauthenticated_user_can_list_projects(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_student_can_list_projects(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_teacher_can_list_projects(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_admin_can_list_projects(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_teacher_can_create_project(self):
        self.client.force_authenticate(user=self.teacher)

        data = {
            "title": "AI Project",
            "description": "Test project",
            "teacher": self.teacher.id,
            "capacity": 2
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)

    def test_admin_can_create_project(self):
        self.client.force_authenticate(user=self.admin)

        data = {
            "title": "Admin Project",
            "description": "Created by admin",
            "teacher": self.teacher.id,
            "capacity": 1
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)

    def test_reject_invalid_capacity(self):
        self.client.force_authenticate(user=self.teacher)

        data = {
            "title": "Bad Project",
            "description": "Invalid capacity",
            "teacher": self.teacher.id,
            "capacity": 0
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_student_cannot_create_project(self):
        self.client.force_authenticate(user=self.student)

        data = {
            "title": "Forbidden Project",
            "description": "Should fail",
            "teacher": self.teacher.id,
            "capacity": 1
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_create_project(self):
        data = {
            "title": "Anonymous Project",
            "description": "Should fail",
            "teacher": self.teacher.id,
            "capacity": 1
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)