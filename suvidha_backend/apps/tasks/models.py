from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Task(models.Model):
    """A requested assistance or logistics task with pickup/drop coordinates."""

    class Category(models.TextChoices):
        B2B_LOGISTICS = 'B2B_LOGISTICS', 'B2B Logistics & Delivery'
        B2C_ASSIST = 'B2C_ASSIST', 'B2C Personal Errand'
        EMERGENCY_SOS = 'EMERGENCY_SOS', 'Emergency First Response'

    class Status(models.TextChoices):
        CREATED = 'CREATED', 'Task Created'
        OFFERED = 'OFFERED', 'Offered to Nearest Agent'
        ACCEPTED = 'ACCEPTED', 'Accepted by Agent'
        EN_ROUTE = 'EN_ROUTE', 'Agent En-Route'
        STORE_PURCHASE = 'STORE_PURCHASE', 'Purchasing Goods'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    requested_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='created_tasks'
    )
    assigned_agent = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks'
    )
    category = models.CharField(max_length=20, choices=Category.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATED)

    pickup_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    pickup_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    drop_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    drop_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    instructions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Task #{self.id} - {self.category} ({self.status})'
