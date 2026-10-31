from django.conf import settings
from django.db import models


class SubscriptionPlan(models.Model):
    class Audience(models.TextChoices):
        CUSTOMER = 'customer', 'Customer'
        TOURIST = 'tourist', 'Tourist'
        BUSINESS = 'business', 'Business'
        ENTERPRISE = 'enterprise', 'Enterprise'

    audience = models.CharField(max_length=20, choices=Audience.choices)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    billing_period = models.CharField(max_length=20, default='Monthly')
    description = models.TextField(blank=True)
    features = models.JSONField(default=list, blank=True)
    external_expense_policy = models.TextField(blank=True)
    badge = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Subscription(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscription'
    )
    plan = models.ForeignKey(
        SubscriptionPlan, on_delete=models.PROTECT, related_name='subscriptions'
    )
    status = models.CharField(max_length=20, default='active')
    started_at = models.DateTimeField(auto_now_add=True)
    ends_at = models.DateField(blank=True, null=True)

    @property
    def is_active(self):
        return self.status == 'active'

    def __str__(self):
        return f'{self.user} - {self.plan}'
