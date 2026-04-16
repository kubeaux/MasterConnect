from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from projects.models import Project
from assignments.models import Assignment


class AssignmentAPITests(APITestCase):
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
        self.student2 = User.objects.create_user(
            username="student2",
            password="testpass123",
            user_type="student"
        )
        self.project = Project.objects.create(
            title="Project 1",
            description="Desc",
            teacher=self.teacher,
            capacity=1
        )
        self.url = "/api/assignments/"

    def test_admin_can_list_assignments(self):
        Assignment.objects.create(student=self.student, project=self.project)

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_assignment(self):
        self.client.force_authenticate(user=self.admin)

        data = {
            "student": self.student.id,
            "project": self.project.id
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Assignment.objects.count(), 1)

    def test_reject_assignment_for_non_student(self):
        self.client.force_authenticate(user=self.admin)

        data = {
            "student": self.teacher.id,
            "project": self.project.id
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_teacher_cannot_create_assignment(self):
        self.client.force_authenticate(user=self.teacher)

        data = {
            "student": self.student.id,
            "project": self.project.id
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_reject_assignment_when_project_is_full(self):
        self.client.force_authenticate(user=self.admin)

        Assignment.objects.create(student=self.student, project=self.project)

        data = {
            "student": self.student2.id,
            "project": self.project.id
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_teacher_cannot_list_assignments(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_list_assignments(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_list_assignments(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)