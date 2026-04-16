from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from projects.models import Project
from wishes.models import Wish


class WishAPITests(APITestCase):
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
        self.other_student = User.objects.create_user(
            username="student2",
            password="testpass123",
            user_type="student"
        )

        self.project1 = Project.objects.create(
            title="Project 1",
            description="Desc 1",
            teacher=self.teacher,
            capacity=1
        )
        self.project2 = Project.objects.create(
            title="Project 2",
            description="Desc 2",
            teacher=self.teacher,
            capacity=1
        )
        self.project3 = Project.objects.create(
            title="Project 3",
            description="Desc 3",
            teacher=self.teacher,
            capacity=1
        )
        self.project4 = Project.objects.create(
            title="Project 4",
            description="Desc 4",
            teacher=self.teacher,
            capacity=1
        )
        self.project5 = Project.objects.create(
            title="Project 5",
            description="Desc 5",
            teacher=self.teacher,
            capacity=1
        )
        self.project6 = Project.objects.create(
            title="Project 6",
            description="Desc 6",
            teacher=self.teacher,
            capacity=1
        )

        self.url = "/api/wishes/"

    def test_create_valid_wish(self):
        self.client.force_authenticate(user=self.student)

        data = {
            "student": self.student.id,
            "project": self.project1.id,
            "rank": 1
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Wish.objects.count(), 1)

    def test_reject_non_student_wish(self):
        self.client.force_authenticate(user=self.teacher)

        data = {
            "student": self.teacher.id,
            "project": self.project1.id,
            "rank": 1
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_reject_duplicate_project_for_same_student(self):
        self.client.force_authenticate(user=self.student)

        Wish.objects.create(student=self.student, project=self.project1, rank=1)

        data = {
            "student": self.student.id,
            "project": self.project1.id,
            "rank": 2
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reject_rank_outside_range(self):
        self.client.force_authenticate(user=self.student)

        data = {
            "student": self.student.id,
            "project": self.project1.id,
            "rank": 6
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reject_more_than_five_wishes(self):
        self.client.force_authenticate(user=self.student)

        Wish.objects.create(student=self.student, project=self.project1, rank=1)
        Wish.objects.create(student=self.student, project=self.project2, rank=2)
        Wish.objects.create(student=self.student, project=self.project3, rank=3)
        Wish.objects.create(student=self.student, project=self.project4, rank=4)
        Wish.objects.create(student=self.student, project=self.project5, rank=5)

        data = {
            "student": self.student.id,
            "project": self.project6.id,
            "rank": 1
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated_user_cannot_create_wish(self):
        data = {
            "student": self.student.id,
            "project": self.project1.id,
            "rank": 1
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_only_sees_own_wishes(self):
        Wish.objects.create(student=self.student, project=self.project1, rank=1)
        Wish.objects.create(student=self.other_student, project=self.project2, rank=1)

        self.client.force_authenticate(user=self.student)
        response = self.client.get(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["student"], self.student.id)

    def test_admin_sees_all_wishes(self):
        Wish.objects.create(student=self.student, project=self.project1, rank=1)
        Wish.objects.create(student=self.other_student, project=self.project2, rank=1)

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_teacher_sees_no_wishes(self):
        Wish.objects.create(student=self.student, project=self.project1, rank=1)

        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)