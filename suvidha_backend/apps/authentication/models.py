from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Platform user with role based access (Customer / Business / Agent / Admin)."""

    class Role(models.TextChoices):
        B2C_SUBSCRIBER = 'B2C', 'B2C Subscriber'
        B2B_PARTNER = 'B2B', 'B2B Partner'
        FIELD_AGENT = 'AGENT', 'Field Agent'
        ADMIN = 'ADMIN', 'System Administrator'

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.B2C_SUBSCRIBER)
    phone_number = models.CharField(max_length=20, unique=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    preferred_language = models.CharField(max_length=20, blank=True, default='en')
    emergency_contact_name = models.CharField(max_length=120, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    is_emergency_contact_enabled = models.BooleanField(default=False)

    # Business profile fields.
    business_name = models.CharField(max_length=150, blank=True, null=True)
    contact_person_name = models.CharField(max_length=120, blank=True, null=True)
    business_email = models.EmailField(blank=True, null=True)
    business_category = models.CharField(max_length=100, blank=True, null=True)
    business_address = models.CharField(max_length=255, blank=True, null=True)
    operational_size = models.CharField(max_length=100, blank=True, null=True)
    billing_frequency = models.CharField(max_length=20, blank=True, default='Monthly')
    included_capacity = models.IntegerField(default=0)
    used_capacity = models.IntegerField(default=0)

    # Subscription fields.
    subscription_plan_id = models.CharField(max_length=50, blank=True, null=True)
    subscription_valid_until = models.DateField(blank=True, null=True)

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip() or self.username

    @property
    def frontend_role(self):
        """Map internal role keys to the roles used by the frontend consumers."""
        return {
            User.Role.B2C_SUBSCRIBER: 'customer',
            User.Role.B2B_PARTNER: 'business',
            User.Role.FIELD_AGENT: 'rider',
            User.Role.ADMIN: 'admin',
        }.get(self.role, 'customer')

    def __str__(self):
        return f'{self.username} ({self.role})'


class AgentProfile(models.Model):
    """Field agent / rider operational profile."""

    class VehicleType(models.TextChoices):
        BICYCLE = 'bicycle', 'Bicycle'
        MOTORCYCLE = 'motorcycle', 'Motorcycle'
        SCOOTER = 'scooter', 'Scooter'
        OTHER = 'other', 'Other'

    class ApplicationStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        SUSPENDED = 'suspended', 'Suspended'

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='agent_profile'
    )
    is_on_duty = models.BooleanField(default=False)
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    vehicle_type = models.CharField(
        max_length=20, choices=VehicleType.choices, default=VehicleType.OTHER
    )
    vehicle_registration_number = models.CharField(max_length=30, blank=True, null=True)
    documents = models.JSONField(default=list, blank=True)
    bank_account = models.JSONField(default=dict, blank=True)
    application_status = models.CharField(
        max_length=20, choices=ApplicationStatus.choices, default=ApplicationStatus.PENDING
    )
    is_available = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.CharField(max_length=255, blank=True, null=True)
    admin_notes = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'Agent {self.user.full_name} - Duty: {self.is_on_duty}'


class OtpToken(models.Model):
    phone_number = models.CharField(max_length=20)
    role = models.CharField(max_length=10, choices=User.Role.choices)
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    @classmethod
    def generate_otp(cls, phone_number: str, role: str, code: str = None, validity_minutes: int = 10):
        import secrets

        if not code:
            code = f'{secrets.randbelow(1000000):06d}'

        return cls.objects.create(
            phone_number=phone_number,
            role=role,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=validity_minutes),
        )

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def is_valid_code(self, code: str):
        if self.used or self.is_expired:
            return False
        return self.code == code
