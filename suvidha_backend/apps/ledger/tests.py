from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.ledger.models import TaskLedger
from apps.subscriptions.models import Subscription, SubscriptionPlan
from apps.tasks.models import Task

User = get_user_model()


class TaskLedgerModelTests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username='cust-ledger',
            phone_number='9123456755',
            password='pw123456',
            role=User.Role.B2C_SUBSCRIBER,
        )
        self.task = Task.objects.create(
            requested_by=self.customer,
            category=Task.Category.B2C_ASSIST,
            status=Task.Status.COMPLETED,
            pickup_latitude='22.5700',
            pickup_longitude='88.4300',
        )

    def test_task_ledger_total_customer_charge_sums_cost_and_fee(self):
        ledger = TaskLedger.objects.create(
            task=self.task, actual_store_cost=Decimal('150.00'), service_fee=Decimal('0.00')
        )
        self.assertEqual(ledger.total_customer_charge, Decimal('150.00'))

        ledger.service_fee = Decimal('5.00')
        self.assertEqual(ledger.total_customer_charge, Decimal('155.00'))


class TaskLedgerApprovalAPITests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username='cust-ledger-api',
            phone_number='9123456756',
            password='pw123456',
            role=User.Role.B2C_SUBSCRIBER,
        )
        self.task = Task.objects.create(
            requested_by=self.customer,
            category=Task.Category.B2C_ASSIST,
            status=Task.Status.COMPLETED,
        )
        self.plan = SubscriptionPlan.objects.create(
            audience=SubscriptionPlan.Audience.CUSTOMER,
            name='Individual Care',
            price=Decimal('299.00'),
            is_active=True,
        )
        Subscription.objects.create(user=self.customer, plan=self.plan, status='active')

    def auth(self, user):
        token = RefreshToken.for_user(user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_ledger_approve_zero_service_fee_for_active_subscriber(self):
        self.auth(self.customer)
        response = self.client.post(
            f'/api/v1/ledger/tasks/{self.task.id}/approve/',
            {'actualStoreCost': 250},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ledger = TaskLedger.objects.get(task=self.task)
        self.assertTrue(ledger.is_approved_by_customer)
        self.assertEqual(ledger.service_fee, Decimal('0.00'))
        self.assertEqual(ledger.total_customer_charge, Decimal('250.00'))
        self.assertEqual(float(response.data['totalCustomerCharge']), 250.0)

    def test_ledger_approve_service_fee_for_non_subscriber(self):
        user = User.objects.create_user(
            username='cust-ledger-nosub',
            phone_number='9123456757',
            password='pw123456',
            role=User.Role.B2C_SUBSCRIBER,
        )
        self.auth(user)
        response = self.client.post(
            f'/api/v1/ledger/tasks/{self.task.id}/approve/',
            {'actualStoreCost': 250},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ledger = TaskLedger.objects.get(task=self.task)
        self.assertEqual(ledger.service_fee, Decimal('5.00'))
        self.assertEqual(ledger.total_customer_charge, Decimal('255.00'))

    def test_ledger_detail_returns_approved_ledger(self):
        TaskLedger.objects.create(task=self.task, actual_store_cost=Decimal('100.00'), service_fee=Decimal('0.00'))
        self.auth(self.customer)
        self.client.post(f'/api/v1/ledger/tasks/{self.task.id}/approve/', {'actualStoreCost': 100}, format='json')
        response = self.client.get(f'/api/v1/ledger/tasks/{self.task.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['isApprovedByCustomer'])
        self.assertEqual(float(response.data['totalCustomerCharge']), 100.0)
