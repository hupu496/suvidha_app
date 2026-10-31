from django.db import models
from django.conf import settings

from apps.tasks.models import Task


class TaskLedger(models.Model):
    """Zero-fee billing ledger for completed tasks."""

    task = models.OneToOneField(Task, on_delete=models.CASCADE, related_name='ledger')
    receipt_image = models.FileField(upload_to='receipts/%Y/%m/', blank=True, null=True)
    actual_store_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_approved_by_customer = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_customer_charge(self):
        return self.actual_store_cost + self.service_fee

    def __str__(self):
        return f'Ledger for Task #{self.task_id}'
