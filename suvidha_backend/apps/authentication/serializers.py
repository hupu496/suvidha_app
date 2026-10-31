from rest_framework import serializers

from apps.authentication.models import AgentProfile, OtpToken, User

FRONTEND_TO_BACKEND_ROLE = {
    'customer': User.Role.B2C_SUBSCRIBER,
    'business': User.Role.B2B_PARTNER,
    'rider': User.Role.FIELD_AGENT,
    'admin': User.Role.ADMIN,
}


def normalize_phone(raw: str) -> str:
    """Normalize a raw phone input to the last 10 digits used by the platform."""
    digits = ''.join(ch for ch in (raw or '') if ch.isdigit())
    return digits[-10:]


def is_valid_indian_phone(raw: str) -> bool:
    cleaned = normalize_phone(raw)
    return len(cleaned) == 10 and cleaned[0] in '6789'


def normalize_role(role: str = None):
    """Accept both frontend role keys (customer/business/rider) and backend keys."""
    key = (role or '').strip().lower()
    backend_value = FRONTEND_TO_BACKEND_ROLE.get(key)
    if backend_value:
        return backend_value
    if key.upper() in User.Role.values:
        return key.upper()
    return None


class PhoneLookupSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    role = serializers.CharField(max_length=10, required=False, default='customer')

    def validate_phone(self, value):
        if not is_valid_indian_phone(value):
            raise serializers.ValidationError('Enter a valid 10-digit Indian mobile number.')
        return normalize_phone(value)

    def validate_role(self, value):
        normalized = normalize_role(value)
        if not normalized:
            raise serializers.ValidationError('Invalid role.')
        return normalized


class CustomerRegistrationSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=120)
    phone = serializers.CharField(max_length=20)
    email = serializers.EmailField(required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    preferred_language = serializers.CharField(max_length=20, default='en')
    emergency_contact_name = serializers.CharField(max_length=120, required=False, allow_blank=True)
    emergency_contact_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    consent_accepted = serializers.BooleanField()

    def validate_phone(self, value):
        if not is_valid_indian_phone(value):
            raise serializers.ValidationError('Enter a valid 10-digit Indian mobile number.')
        return normalize_phone(value)

    def validate(self, attrs):
        if not attrs.get('consent_accepted'):
            raise serializers.ValidationError('Please accept the consent to continue.')
        return attrs


class BusinessRegistrationSerializer(serializers.Serializer):
    business_name = serializers.CharField(max_length=150)
    contact_person_name = serializers.CharField(max_length=120)
    phone = serializers.CharField(max_length=20)
    business_email = serializers.EmailField()
    business_category = serializers.CharField(max_length=100)
    city = serializers.CharField(max_length=100)
    business_address = serializers.CharField(max_length=255)
    operational_size = serializers.CharField(max_length=100)
    consent_accepted = serializers.BooleanField()

    def validate_phone(self, value):
        if not is_valid_indian_phone(value):
            raise serializers.ValidationError('Enter a valid 10-digit Indian mobile number.')
        return normalize_phone(value)

    def validate(self, attrs):
        if not attrs.get('consent_accepted'):
            raise serializers.ValidationError('Please accept the consent to continue.')
        return attrs


class RiderRegistrationSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=120)
    phone = serializers.CharField(max_length=20)
    email = serializers.EmailField(required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    address = serializers.CharField(max_length=255)
    vehicle_type = serializers.CharField(
        max_length=20, default=AgentProfile.VehicleType.OTHER
    )
    vehicle_registration_number = serializers.CharField(max_length=30, required=False, allow_blank=True)
    driving_license_number = serializers.CharField(max_length=30)
    identity_type = serializers.CharField(max_length=20, default='identity_proof')
    identity_number = serializers.CharField(max_length=30)
    account_holder_name = serializers.CharField(max_length=120)
    account_number = serializers.CharField(max_length=30)
    ifsc_code = serializers.CharField(max_length=20)
    consent_accepted = serializers.BooleanField()

    def validate_phone(self, value):
        if not is_valid_indian_phone(value):
            raise serializers.ValidationError('Enter a valid 10-digit Indian mobile number.')
        return normalize_phone(value)

    def validate(self, attrs):
        if not attrs.get('consent_accepted'):
            raise serializers.ValidationError('Please accept the consent to continue.')
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6)
    role = serializers.CharField(max_length=10, required=False, default='customer')

    def validate_phone(self, value):
        if not is_valid_indian_phone(value):
            raise serializers.ValidationError('Enter a valid 10-digit Indian mobile number.')
        return normalize_phone(value)

    def validate_role(self, value):
        normalized = normalize_role(value)
        if not normalized:
            raise serializers.ValidationError('Invalid role.')
        return normalized


class OTPRequestSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    role = serializers.CharField(max_length=10, required=False, default='customer')

    def validate_phone(self, value):
        if not is_valid_indian_phone(value):
            raise serializers.ValidationError('Enter a valid 10-digit Indian mobile number.')
        return normalize_phone(value)

    def validate_role(self, value):
        normalized = normalize_role(value)
        if not normalized:
            raise serializers.ValidationError('Invalid role.')
        return normalized


class CustomerProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'role',
            'full_name',
            'phone_number',
            'email',
            'city',
            'preferred_language',
            'emergency_contact_name',
            'emergency_contact_phone',
            'is_emergency_contact_enabled',
            'subscription_plan_id',
            'subscription_valid_until',
            'createdAt',
        ]
        read_only_fields = fields

    def get_full_name(self, obj):
        return obj.full_name


class BusinessProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'role',
            'full_name',
            'phone_number',
            'email',
            'city',
            'business_name',
            'contact_person_name',
            'business_email',
            'business_category',
            'business_address',
            'operational_size',
            'billing_frequency',
            'included_capacity',
            'used_capacity',
            'subscription_plan_id',
            'subscription_valid_until',
            'createdAt',
        ]
        read_only_fields = fields

    def get_full_name(self, obj):
        return obj.full_name


class AgentProfileSerializer(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='user.created_at', read_only=True)

    class Meta:
        model = AgentProfile
        fields = [
            'id',
            'user',
            'user_full_name',
            'is_on_duty',
            'current_latitude',
            'current_longitude',
            'rating',
            'wallet_balance',
            'vehicle_type',
            'vehicle_registration_number',
            'documents',
            'bank_account',
            'application_status',
            'is_available',
            'submitted_at',
            'reviewed_at',
            'rejection_reason',
            'admin_notes',
            'createdAt',
        ]
        read_only_fields = fields

    def get_user_full_name(self, obj):
        return obj.user.full_name
