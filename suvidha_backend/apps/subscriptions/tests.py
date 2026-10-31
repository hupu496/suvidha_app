from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.subscriptions.models import Subscription, SubscriptionPlan
from apps.subscriptions import views as subscription_views

User = get_user_model()


class SubscriptionModelsTests(APITestCase):
    def test_subscription_plan_string_representation(self):
        plan = SubscriptionPlan.objects.create(
            audience=SubscriptionPlan.Audience.CUSTOMER,
            name='Individual Care',
            price=Decimal('299.00'),
            billing_period='Monthly',
        )
        self.assertEqual(str(plan), 'Individual Care')

    def test_subscription_is_active_only_when_status_active(self):
        user = User.objects.create_user(username='cust-sub', phone_number='9123456781', password='pw123456')
        plan = SubscriptionPlan.objects.create(
            audience=SubscriptionPlan.Audience.CUSTOMER,
            name='Individual Care',
            price=Decimal('299.00'),
        )
        subscription = Subscription.objects.create(user=user, plan=plan, status='active')
        self.assertTrue(subscription.is_active)
        subscription.status = 'cancelled'
        self.assertFalse(subscription.is_active)


class SubscriptionAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='cust-sub-api',
            phone_number='9123456782',
            password='pw123456',
            role=User.Role.B2C_SUBSCRIBER,
        )
        self.plan = SubscriptionPlan.objects.create(
            audience=SubscriptionPlan.Audience.CUSTOMER,
            name='Individual Care',
            price=Decimal('299.00'),
            billing_period='Monthly',
            description='Everyday assistance plan.',
            features=['3 errands / month'],
            external_expense_policy='Third-party expenses billed transparently.',
            badge='Popular',
            is_active=True,
        )

    def auth(self):
        from rest_framework_simplejwt.tokens import RefreshToken

        token = RefreshToken.for_user(self.user).access_token
        return self.client.get, {'HTTP_AUTHORIZATION': f'Bearer {token}'}

    def test_plan_list_returns_only_active_plans(self):
        SubscriptionPlan.objects.create(
            audience=SubscriptionPlan.Audience.BUSINESS,
            name='Business Growth',
            price=Decimal('1499.00'),
            is_active=False,
        )
        response = self.client.get('/api/v1/subscriptions/plans/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Individual Care')
        self.assertEqual(response.data[0]['priceDisplay'], '₹299')
        self.assertEqual(response.data[0]['billingPeriod'], 'Monthly')

    def test_subscription_subscribe_creates_active_subscription(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(self.user).access_token}')
        response = self.client.post(
            '/api/v1/subscriptions/subscriptions/',
            {'planId': self.plan.id},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        subscription = Subscription.objects.get(user=self.user)
        self.assertEqual(subscription.plan, self.plan)
        self.assertEqual(subscription.status, 'active')

    def test_subscription_subscribe_twice_returns_conflict(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(self.user).access_token}')
        self.client.post(
            '/api/v1/subscriptions/subscriptions/',
            {'planId': self.plan.id},
            format='json',
        )
        response = self.client.post(
            '/api/v1/subscriptions/subscriptions/',
            {'planId': self.plan.id},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_subscription_lookup_for_user_without_subscription_returns_404(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(self.user).access_token}')
        response = self.client.get('/api/v1/subscriptions/subscriptions/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
