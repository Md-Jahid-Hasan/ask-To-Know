from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

CREATE_USER_URL = reverse('users:create')
UPDATE_USER_URL = reverse('users:update', kwargs={'pk': 1})
USERNAME_CHECK_URL = reverse('users:username_check')
HANDLE_ADMIN_STATUS_URL = reverse('users:admin_status_update')
LOGIN_URL = reverse('users:login')
GET_USER_URL = reverse('users:me')

PAYLOAD = {
    "email": "jahidhadiu@gmail.com",
    "name": "jahidhadiu",
    "password": "1234",
    "phone_number": "0123456789",
    "username": "jahid",
}


def create_user(**params):
    return get_user_model().objects.create_user(**params)


class PublicUserAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_valid_user_success(self):
        res = self.client.post(CREATE_USER_URL, {**PAYLOAD, 'confirm_password': '1234'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(email=PAYLOAD['email'], username=PAYLOAD['username'])
        self.assertTrue(user.check_password(PAYLOAD['password']))

    def test_login_user(self):
        create_user(**PAYLOAD)
        login_data = {
            "email": "jahidhadiu@gmail.com",
            "password": "1234",
        }
        res = self.client.post(LOGIN_URL, login_data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', res.data)
        self.assertIn('access', res.data)
        self.assertNotIn("password", res.data['user'])

    def test_username_check(self):
        create_user(**PAYLOAD)
        user = self.client.get(f"{USERNAME_CHECK_URL}?username=jahid")
        self.assertEqual(user.status_code, status.HTTP_200_OK)
        self.assertFalse(user.data['is_unique'])

        user = self.client.get(f"{USERNAME_CHECK_URL}?username=hasan")
        self.assertTrue(user.data['is_unique'])


class PrivateUserAPITests(TestCase):
    def setUp(self):
        self.user = create_user(**PAYLOAD)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_current_user(self):
        user = self.client.get(GET_USER_URL)
        self.assertEqual(user.status_code, status.HTTP_200_OK)
        self.assertNotIn("password", user.data)
        self.assertEqual(user.data['email'], PAYLOAD['email'])
        self.assertEqual(user.data['name'], PAYLOAD['name'])

    def test_update_user(self):
        updated_data = {
            "name": "Jahid",
        }
        res = self.client.patch(UPDATE_USER_URL, updated_data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['name'], updated_data['name'])

    def test_update_admin_status(self):
        res = self.client.get(f"{HANDLE_ADMIN_STATUS_URL}?status=0")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_new_agent(self):
        admin_payload = {
            "email": "agent@gmail.com",
            "name": "agent",
            "username": "agent1",
        }
        res = self.client.post(HANDLE_ADMIN_STATUS_URL, admin_payload)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class PrivateAdminAPITests(TestCase):
    def setUp(self):
        self.user = create_user(**PAYLOAD, is_staff=True, role='admin')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_update_admin_status(self):
        res = self.client.get(f"{HANDLE_ADMIN_STATUS_URL}?status=0")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['success'])

        res = self.client.get(f"{HANDLE_ADMIN_STATUS_URL}")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(res.data['success'])

    def test_create_new_agent(self):
        admin_payload = {
            "email": "agent@gmail.com",
            "name": "agent",
            "username": "agent1",
        }
        res = self.client.post(HANDLE_ADMIN_STATUS_URL, admin_payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        new_admin = get_user_model().objects.get(email=admin_payload['email'])
        self.assertTrue(new_admin.is_staff)
