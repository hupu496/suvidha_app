from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.authentication.models import AgentProfile, User
from apps.tasks.models import Task

User = get_user_model()


class TaskModelTests(APITestCase):
    def test_task_string_representation(self):
        task = Task.objects.create(
            requested_by=User.objects.create_user(username='cust-t', phone_number='9123456785', password='pw123456', role=User.Role.B2C_SUBSCRIBER),
            category=Task.Category.B2C_ASSIST,
            status=Task.Status.CREATED,
            pickup_latitude='22.5700',
            pickup_longitude='88.4300',
        )
        self.assertIn('Task #', str(task))


class TaskAPITests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username='cust-task',
            phone_number='9123456789',
            password='pw123456',
            role=User.Role.B2C_SUBSCRIBER,
            first_name='Cust',
            last_name='Task',
        )
        self.agent_user = User.objects.create_user(
            username='agent-task',
            phone_number='9000000009',
            password='pw123456',
            role=User.Role.FIELD_AGENT,
        )
        AgentProfile.objects.create(user=self.agent_user)

    def auth(self, user):
        from rest_framework_simplejwt.tokens import RefreshToken

        token = RefreshToken.for_user(user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def create_task(self, **overrides):
        data = {
            'category': Task.Category.B2C_ASSIST,
            'instructions': 'Buy medicines from the pharmacy.',
            'pickup_lat': 22.5700,
            'pickup_lng': 88.4300,
            'drop_lat': 22.5800,
            'drop_lng': 88.4400,
        }
        data.update(overrides)
        return self.client.post('/api/v1/tasks/', data, format='json')

    def test_task_create_requires_pickup_coordinates(self):
        self.auth(self.customer)
        response = self.client.post(
            '/api/v1/tasks/',
            {'category': Task.Category.B2C_ASSIST, 'instructions': 'Help'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_customer_can_create_task_with_coordinates(self):
        self.auth(self.customer)
        response = self.create_task()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        task = Task.objects.get(id=response.data['id'])
        self.assertEqual(task.requested_by, self.customer)
        self.assertEqual(task.category, Task.Category.B2C_ASSIST)
        self.assertEqual(task.status, Task.Status.CREATED)
        self.assertEqual(str(task.pickup_latitude), '22.570000')
        self.assertEqual(str(task.drop_latitude), '22.580000')

    def test_customer_task_list_is_scoped_to_own_tasks(self):
        self.auth(self.customer)
        self.create_task()
        other_customer = User.objects.create_user(
            username='cust-other',
            phone_number='9123456790',
            password='pw123456',
            role=User.Role.B2C_SUBSCRIBER,
        )
        self.auth(other_customer)
        other_response = self.create_task(instructions='Other task')

        self.auth(self.customer)
        response = self.client.get('/api/v1/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], Task.objects.get(instructions='Buy medicines from the pharmacy.').id)

        self.auth(other_customer)
        response = self.client.get('/api/v1/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], Task.objects.get(instructions='Other task').id)

    def test_task_retrieve_returns_task_detail(self):
        task = Task.objects.create(
            requested_by=self.customer,
            category=Task.Category.B2C_ASSIST,
            status=Task.Status.CREATED,
            pickup_latitude='22.5700',
            pickup_longitude='88.4300',
        )
        self.auth(self.customer)
        response = self.client.get(f'/api/v1/tasks/{task.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], task.id)
        self.assertEqual(response.data['category'], Task.Category.B2C_ASSIST)
        self.assertEqual(response.data['status'], Task.Status.CREATED)

    def test_task_update_changes_status(self):
        task = Task.objects.create(
            requested_by=self.customer,
            category=Task.Category.B2C_ASSIST,
            status=Task.Status.CREATED,
            pickup_latitude='22.5700',
            pickup_longitude='88.4300',
        )
        self.auth(self.customer)
        response = self.client.patch(f'/api/v1/tasks/{task.id}/', {'status': Task.Status.ACCEPTED}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertEqual(task.status, Task.Status.ACCEPTED)

    def test_emergency_sos_creates_dispatch_task(self):
        self.auth(self.customer)
        response = self.client.post(
            '/api/v1/tasks/sos-trigger/',
            {'latitude': 22.5700, 'longitude': 88.4300},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'EMERGENCY_DISPATCHED')
        task = Task.objects.get(id=response.data['task_id'])
        self.assertEqual(task.category, Task.Category.EMERGENCY_SOS)
        self.assertEqual(task.status, Task.Status.OFFERED)

    def test_agent_task_list_returns_assigned_tasks(self):
        task = Task.objects.create(
            requested_by=self.customer,
            assigned_agent=self.agent_user,
            category=Task.Category.B2C_ASSIST,
            status=Task.Status.ACCEPTED,
        )
        self.auth(self.agent_user)
        response = self.client.get('/api/v1/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], task.id)


class BusinessTaskAPITests(APITestCase):
    def setUp(self):
        self.business = User.objects.create_user(
            username='biz-task',
            phone_number='9444555666',
            password='pw123456',
            role=User.Role.B2B_PARTNER,
            first_name='K.',
            last_name='Basu',
        )
        self.customer = User.objects.create_user(
            username='cust-biz',
            phone_number='9123456799',
            password='pw123456',
            role=User.Role.B2C_SUBSCRIBER,
        )

    def test_business_task_list_returns_only_business_tasks(self):
        Task.objects.create(
            requested_by=self.business,
            category=Task.Category.B2B_LOGISTICS,
            status=Task.Status.CREATED,
        )
        Task.objects.create(
            requested_by=self.customer,
            category=Task.Category.B2C_ASSIST,
            status=Task.Status.CREATED,
        )

        from rest_framework_simplejwt.tokens import RefreshToken

        token = RefreshToken.for_user(self.business).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/v1/business/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['taskCategory'], Task.Category.B2B_LOGISTICS)

    def test_business_task_create(self):
        from rest_framework_simplejwt.tokens import RefreshToken

        token = RefreshToken.for_user(self.business).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.post(
            '/api/v1/business/tasks/',
            {
                'category': Task.Category.B2B_LOGISTICS,
                'instructions': 'Deliver medicines to the store.',
                'pickup_lat': 22.5700,
                'pickup_lng': 88.4300,
                'drop_lat': 22.5800,
                'drop_lng': 88.4400,
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], Task.Status.CREATED)

    def test_fleet_agents_returns_agent_list(self):
        from rest_framework_simplejwt.tokens import RefreshToken

        token = RefreshToken.for_user(self.business).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/v1/business/fleet/agents/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])


class TaskAPIPermissionTests(APITestCase):
    def test_task_list_requires_authentication(self):
        response = self.client.get('/api/v1/tasks/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
