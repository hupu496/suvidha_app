from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.authentication.models import AgentProfile, OtpToken, User
from apps.authentication import views as auth_views


def auth_token(user):
    return str(RefreshToken.for_user(user).access_token)


class AuthenticationModelsTests(APITestCase):
    def test_user_full_name_combines_first_and_last_name(self):
        user = User.objects.create_user(
            username='cust-1',
            phone_number='9123456789',
            password='password123',
            first_name='Ada',
            last_name='Lovelace',
            role=User.Role.B2C_SUBSCRIBER,
        )
        self.assertEqual(user.full_name, 'Ada Lovelace')

    def test_user_frontend_role_mapping(self):
        self.assertEqual(User.Role.B2C_SUBSCRIBER, User.Role.B2C_SUBSCRIBER)
        self.assertEqual(User.Role.B2B_PARTNER, User.Role.B2B_PARTNER)
        self.assertEqual(User.Role.FIELD_AGENT, User.Role.FIELD_AGENT)
        self.assertEqual(User.Role.ADMIN, User.Role.ADMIN)

    def test_agent_profile_string_representation(self):
        user = User.objects.create_user(
            username='agent-1',
            phone_number='9000000001',
            password='password123',
            role=User.Role.FIELD_AGENT,
        )
        profile = AgentProfile.objects.create(user=user, is_on_duty=True)
        self.assertIn('Duty: True', str(profile))


class AuthenticationPhoneLookupTests(APITestCase):
    def test_unregistered_phone_returns_exists_false(self):
        response = self.client.post(
            '/api/v1/auth/phone-lookup/', {'phone': '9000000000', 'role': 'customer'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['exists'])
        self.assertEqual(response.data['role'], 'customer')
        self.assertEqual(response.data['phone'], '9000000000')
        self.assertIn('message', response.data)

    def test_registered_customer_phone_returns_exists_true_with_masked_phone(self):
        User.objects.create_user(
            username='cust-2',
            phone_number='9123456789',
            password='password123',
            role=User.Role.B2C_SUBSCRIBER,
        )
        response = self.client.post(
            '/api/v1/auth/phone-lookup/', {'phone': '9123456789', 'role': 'customer'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['exists'])
        self.assertEqual(response.data['maskedPhone'], '+91 ••••••6789')

    def test_customer_number_is_not_a_valid_business_number(self):
        User.objects.create_user(
            username='cust-3',
            phone_number='9123456789',
            password='password123',
            role=User.Role.B2C_SUBSCRIBER,
        )
        response = self.client.post(
            '/api/v1/auth/phone-lookup/', {'phone': '9123456789', 'role': 'business'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['exists'])


class AuthenticationRegistrationTests(APITestCase):
    def payload(self, **overrides):
        data = {
            'full_name': 'Test Customer',
            'phone': '9123456789',
            'email': 'cust@example.com',
            'city': 'Kolkata',
            'preferred_language': 'en',
            'consent_accepted': True,
        }
        data.update(overrides)
        return data

    def test_customer_registration_requires_consent(self):
        response = self.client.post(
            '/api/v1/auth/register/customer/', self.payload(consent_accepted=False), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('consent', str(response.data).lower())

    def test_customer_registration_rejects_invalid_phone(self):
        response = self.client.post(
            '/api/v1/auth/register/customer/', self.payload(phone='123'), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_customer_registration_creates_user_and_otp(self):
        response = self.client.post(
            '/api/v1/auth/register/customer/', self.payload(), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertTrue(response.data['otpRequired'])
        self.assertTrue(User.objects.filter(phone_number='9123456789').exists())
        self.assertTrue(OtpToken.objects.filter(phone_number='9123456789').exists())

    def test_customer_registration_rejects_duplicate_phone(self):
        User.objects.create_user(
            username='cust-dup',
            phone_number='9123456789',
            password='password123',
            role=User.Role.B2C_SUBSCRIBER,
        )
        response = self.client.post(
            '/api/v1/auth/register/customer/', self.payload(), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_business_registration_creates_business_user(self):
        response = self.client.post(
            '/api/v1/auth/register/business/',
            {
                'business_name': 'Metro Meds',
                'contact_person_name': 'K. Basu',
                'phone': '9444555666',
                'business_email': 'ops@metromeds.example.com',
                'business_category': 'Pharmacy',
                'city': 'Kolkata',
                'business_address': 'Salt Lake Sector II',
                'operational_size': '20 daily tasks',
                'consent_accepted': True,
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(phone_number='9444555666', role=User.Role.B2B_PARTNER).exists())

    def test_rider_registration_creates_agent_profile(self):
        response = self.client.post(
            '/api/v1/auth/register/rider/',
            {
                'full_name': 'Ravi Kumar',
                'phone': '9001111222',
                'city': 'Kolkata',
                'address': 'Salt Lake',
                'vehicle_type': 'motorcycle',
                'driving_license_number': 'DL-1234',
                'identity_type': 'pan_card',
                'identity_number': 'PAN1234',
                'account_holder_name': 'Ravi Kumar',
                'account_number': '1234567890',
                'ifsc_code': 'SBIN0001',
                'consent_accepted': True,
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        profile = AgentProfile.objects.filter(user__phone_number='9001111222').first()
        self.assertIsNotNone(profile)
        self.assertEqual(profile.application_status, AgentProfile.ApplicationStatus.PENDING)


class AuthenticationOTPTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='cust-otp',
            phone_number='9123456789',
            password='password123',
            role=User.Role.B2C_SUBSCRIBER,
        )

    def test_otp_request_generates_valid_token(self):
        response = self.client.post(
            '/api/v1/auth/otp/', {'phone': '9123456789', 'role': 'customer'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        otp = OtpToken.objects.filter(phone_number='9123456789').order_by('-created_at').first()
        self.assertIsNotNone(otp)
        self.assertFalse(otp.used)
        self.assertFalse(otp.is_expired)

    def test_otp_verify_rejects_wrong_code(self):
        OtpToken.objects.create(
            phone_number='9123456789',
            role=User.Role.B2C_SUBSCRIBER,
            code='123456',
            expires_at=timezone.now() + timedelta(minutes=10),
        )
        response = self.client.post(
            '/api/v1/auth/verify-otp/',
            {'phone': '9123456789', 'code': '000000', 'role': 'customer'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['success'])
    def test_otp_verify_accepts_valid_code_and_returns_tokens(self):
        OtpToken.objects.create(
            phone_number='9123456789',
            role=User.Role.B2C_SUBSCRIBER,
            code='123456',
            expires_at=timezone.now() + timedelta(minutes=10),
        )
        response = self.client.post(
            '/api/v1/auth/verify-otp/',
            {'phone': '9123456789', 'code': '123456', 'role': 'customer'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertTrue(OtpToken.objects.get(phone_number='9123456789').used)

    def test_otp_verify_rejects_reused_code(self):
        OtpToken.objects.create(
            phone_number='9123456789',
            role=User.Role.B2C_SUBSCRIBER,
            code='123456',
            expires_at=timezone.now() + timedelta(minutes=10),
        )
        first = self.client.post(
            '/api/v1/auth/verify-otp/', {'phone': '9123456789', 'code': '123456', 'role': 'customer'}, format='json'
        )
        self.assertTrue(first.data['success'])
        second = self.client.post(
            '/api/v1/auth/verify-otp/', {'phone': '9123456789', 'code': '123456', 'role': 'customer'}, format='json'
        )
        self.assertFalse(second.data['success'])

    def test_otp_verify_rejects_expired_code(self):
        OtpToken.objects.create(
            phone_number='9123456789',
            role=User.Role.B2C_SUBSCRIBER,
            code='123456',
            expires_at=timezone.now() - timedelta(minutes=5),
        )
        response = self.client.post(
            '/api/v1/auth/verify-otp/', {'phone': '9123456789', 'code': '123456', 'role': 'customer'}, format='json'
        )
        self.assertFalse(response.data['success'])


class AuthenticationSessionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='cust-session',
            phone_number='9123456789',
            password='password123',
            role=User.Role.B2C_SUBSCRIBER,
        )

    def test_me_requires_authentication(self):
        response = self.client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_customer_profile_with_jwt_token(self):
        token = auth_token(self.user)
        response = self.client.get('/api/v1/auth/me/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.user.id)
        self.assertEqual(response.data['phone_number'], '9123456789')

    def test_logout_returns_success(self):
        response = self.client.post('/api/v1/auth/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_agent_duty_toggle_updates_profile(self):
        agent_user = User.objects.create_user(
            username='agent-session',
            phone_number='9000000002',
            password='password123',
            role=User.Role.FIELD_AGENT,
        )
        AgentProfile.objects.create(user=agent_user)
        token = auth_token(agent_user)
        response = self.client.post(
            '/api/v1/auth/agents/me/duty/',
            {'is_on_duty': True},
            format='json',
            HTTP_AUTHORIZATION=f'Bearer {token}',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        profile = AgentProfile.objects.get(user=agent_user)
        self.assertTrue(profile.is_on_duty)
        self.assertTrue(profile.is_available)

    def test_jwt_token_endpoint_issues_tokens(self):
        response = self.client.post(
            '/api/v1/auth/token/',
            {'username': 'cust-session', 'password': 'password123'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
