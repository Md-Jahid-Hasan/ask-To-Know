from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from tests.test_user import create_user, PAYLOAD

from question.models import Question, Category

# get all reverse url from question app
QUESTION_LIST_URL = reverse('question:question-list')
QUESTION_ANSWER_URL = reverse('question:question-answer', kwargs={'pk': 1})
QUESTION_CATEGORY_URL = reverse('question:question-category')


class UserQuestionAPITest(TestCase):
    def setUp(self):
        self.user = create_user(**PAYLOAD)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def create_question(self, admin):
        return Question.objects.create(user=self.user, question='How to create a question?', assignee=admin)

    def test_question_list(self):
        admin = create_user(email="test@gmail.com", name="test", password="1234", phone_number="0123456789",
                            username="test1", is_staff=True)
        [self.create_question(admin) for _ in range(7)]
        res = self.client.get(QUESTION_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 7)
        self.assertIn('next', res.data)

    def test_category(self):
        res = self.client.post(QUESTION_CATEGORY_URL, {'name': 'Python'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        category = Category.objects.get(name="Python")
        self.assertIn("name", category.__dict__)


class AdminQuestionAPITest(TestCase):
    def setUp(self):
        self.user = create_user(**PAYLOAD, is_staff=True)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def create_question(self, user):
        return Question.objects.create(user=user, question='How to create a question?', assignee=self.user)

    def test_answer_question(self):
        new_user = create_user(email="test@gmail.com", name="test", password="1234", phone_number="0123456789",
                               username="test", is_staff=True)
        self.create_question(new_user)
        res = self.client.patch(QUESTION_ANSWER_URL, {'answer': 'This is the answer'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        question = Question.objects.get(pk=1)
        self.assertEqual(question.answer, 'This is the answer')
