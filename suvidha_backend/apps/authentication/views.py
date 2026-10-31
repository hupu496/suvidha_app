from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.authentication.models import AgentProfile, OtpToken, User
from apps.authentication.serializers import (
    AgentProfileSerializer,
    BusinessProfileSerializer,
    BusinessRegistrationSerializer,
    CustomerProfileSerializer,
    CustomerRegistrationSerializer,
    OTPRequestSerializer,
    PhoneLookupSerializer,
    RiderRegistrationSerializer,
    VerifyOTPSerializer,
)

FRONTEND_TO_BACKEND_ROLE = {
    'customer': User.Role.B2C_SUBSCRIBER,
    'business': User.Role.B2B_PARTNER,
    'rider': User.Role.FIELD_AGENT,
    'admin': User.Role.ADMIN,
}


def get_token_pair(user: User):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


def build_user_payload(user: User):
    """Return the frontend-shaped profile payload for the given user role."""
    if user.role == User.Role.B2B_PARTNER:
        serializer = BusinessProfileSerializer(user)
    elif user.role == User.Role.FIELD_AGENT:
        serializer = AgentProfileSerializer(user.agent_profile)
        payload = dict(serializer.data)
        payload['id'] = user.agent_profile.user_id
        payload['role'] = 'rider'
        return payload
    elif user.role == User.Role.ADMIN:
        return {
            'id': user.id,
            'role': 'admin',
            'full_name': user.full_name,
            'phone_number': user.phone_number,
            'email': user.email,
        }
    serializer = CustomerProfileSerializer(user)
    return dict(serializer.data)


class PhoneLookupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PhoneLookupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        role = serializer.validated_data['role']

        user = User.objects.filter(phone_number=phone, role=role).first()

        if user is None:
            frontend_role = 'rider' if role == User.Role.FIELD_AGENT else (
                'business' if role == User.Role.B2B_PARTNER else 'customer'
            )
            return Response(
                {
                    'exists': False,
                    'role': frontend_role,
                    'phone': phone,
                    'message': (
                        'No Rider application was found for this number. Please register first.'
                        if frontend_role == 'rider'
                        else 'This mobile number is not registered for the selected account type.'
                    ),
                }
            )

        frontend_role = 'rider' if role == User.Role.FIELD_AGENT else (
            'business' if role == User.Role.B2B_PARTNER else 'customer'
        )

        return Response(
            {
                'exists': True,
                'role': frontend_role,
                'phone': phone,
                'maskedPhone': f'+91 ••••••{phone[-4:]}',
                'message': 'OTP sent for verification.',
            }
        )


class CustomerRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomerRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if User.objects.filter(phone_number=data['phone']).exists():
            return Response(
                {'success': False, 'error': 'A customer account already exists for this number. Please log in.'},
                status=status.HTTP_409_CONFLICT,
            )

        user = User.objects.create_user(
            username=data['email'] or data['phone'],
            email=data['email'] or '',
            password=None,
            phone_number=data['phone'],
            city=data.get('city') or '',
            preferred_language=data.get('preferred_language') or 'en',
            emergency_contact_name=data.get('emergency_contact_name') or '',
            emergency_contact_phone=data.get('emergency_contact_phone') or '',
            is_emergency_contact_enabled=bool(data.get('emergency_contact_name')),
            first_name=data['full_name'],
            last_name='',
            role=User.Role.B2C_SUBSCRIBER,
        )
        user.save()

        OtpToken.generate_otp(phone_number=data['phone'], role=User.Role.B2C_SUBSCRIBER)

        return Response(
            {
                'success': True,
                'otpRequired': True,
                'user': build_user_payload(user),
                'message': 'OTP sent for verification.',
            },
            status=status.HTTP_201_CREATED,
        )


class BusinessRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = BusinessRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if User.objects.filter(phone_number=data['phone']).exists():
            return Response(
                {'success': False, 'error': 'A business account already exists for this number. Please log in.'},
                status=status.HTTP_409_CONFLICT,
            )

        user = User.objects.create_user(
            username=data['business_email'] or data['phone'],
            email=data['business_email'] or '',
            phone_number=data['phone'],
            city=data['city'],
            business_name=data['business_name'],
            contact_person_name=data['contact_person_name'],
            business_email=data['business_email'],
            business_category=data['business_category'],
            business_address=data['business_address'],
            operational_size=data['operational_size'],
            billing_frequency='Monthly',
            included_capacity=0,
            used_capacity=0,
            first_name=data['contact_person_name'],
            last_name='',
            role=User.Role.B2B_PARTNER,
        )
        user.save()

        OtpToken.generate_otp(phone_number=data['phone'], role=User.Role.B2B_PARTNER)

        return Response(
            {
                'success': True,
                'otpRequired': True,
                'user': build_user_payload(user),
                'message': 'OTP sent for verification.',
            },
            status=status.HTTP_201_CREATED,
        )


class RiderRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RiderRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if User.objects.filter(phone_number=data['phone']).exists():
            return Response(
                {'success': False, 'error': 'A Rider application already exists for this number. Please log in.'},
                status=status.HTTP_409_CONFLICT,
            )

        user = User.objects.create_user(
            username=data.get('email') or data['phone'],
            email=data.get('email') or '',
            phone_number=data['phone'],
            city=data['city'],
            first_name=data['full_name'],
            last_name='',
            role=User.Role.FIELD_AGENT,
        )
        user.save()

        AgentProfile.objects.create(
            user=user,
            vehicle_type=data.get('vehicle_type') or 'other',
            vehicle_registration_number=data.get('vehicle_registration_number') or '',
            documents=[
                {
                    'type': 'driving_license',
                    'documentNumber': data.get('driving_license_number') or '',
                    'verificationStatus': 'pending',
                },
                {
                    'type': data.get('identity_type') or 'identity_proof',
                    'documentNumber': data.get('identity_number') or '',
                    'verificationStatus': 'pending',
                },
            ],
            bank_account={
                'accountHolderName': data.get('account_holder_name') or '',
                'accountNumber': data.get('account_number') or '',
                'ifscCode': data.get('ifsc_code') or '',
                'verificationStatus': 'pending',
            },
            application_status=AgentProfile.ApplicationStatus.PENDING,
            submitted_at=timezone.now(),
        )

        OtpToken.generate_otp(phone_number=data['phone'], role=User.Role.FIELD_AGENT)

        return Response(
            {
                'success': True,
                'otpRequired': True,
                'user': build_user_payload(user),
                'message': 'Rider application submitted. OTP sent for verification.',
            },
            status=status.HTTP_201_CREATED,
        )


class OTPRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        role = serializer.validated_data['role']

        user = User.objects.filter(phone_number=phone, role=role).first()

        if user is None:
            return Response(
                {
                    'success': False,
                    'error': 'This mobile number is not registered for the selected account type.',
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        OtpToken.generate_otp(phone_number=phone, role=role)

        return Response(
            {
                'success': True,
                'message': 'OTP generated successfully.',
            },
            status=status.HTTP_200_OK,
        )


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        code = serializer.validated_data['code']
        role = serializer.validated_data['role']

        otp = OtpToken.objects.filter(phone_number=phone, role=role).order_by('-created_at').first()

        if otp is None or not otp.is_valid_code(code):
            return Response(
                {
                    'success': False,
                    'error': 'Invalid or expired OTP. Please request a new one.',
                },
                status=status.HTTP_200_OK,
            )

        otp.used = True
        otp.save(update_fields=['used'])

        user = User.objects.filter(phone_number=phone, role=role).first()
        if user is None:
            return Response(
                {
                    'success': False,
                    'error': 'This mobile number is not registered for the selected account type.',
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        token_pair = get_token_pair(user)

        return Response(
            {
                'success': True,
                'user': build_user_payload(user),
                'access': token_pair['access'],
                'refresh': token_pair['refresh'],
                'message': 'OTP verified successfully.',
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    def get(self, request):
        user = request.user
        return Response(build_user_payload(user))


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response({'success': True, 'message': 'Logged out successfully.'})


class AgentProfileView(APIView):
    def get(self, request):
        profile = getattr(request.user, 'agent_profile', None)
        if profile is None:
            return Response(
                {'success': False, 'error': 'Agent profile not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = AgentProfileSerializer(profile)
        data = dict(serializer.data)
        data['id'] = profile.user_id
        data['role'] = 'rider'
        return Response(data)


class AgentDutyView(APIView):
    def post(self, request):
        profile = getattr(request.user, 'agent_profile', None)
        if profile is None:
            return Response(
                {'success': False, 'error': 'Agent profile not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        is_on_duty = bool(request.data.get('is_on_duty', False))
        profile.is_on_duty = is_on_duty
        if is_on_duty:
            profile.is_available = True
        else:
            profile.is_available = False
        profile.save(update_fields=['is_on_duty', 'is_available'])
        return Response(
            {
                'success': True,
                'is_on_duty': profile.is_on_duty,
                'is_available': profile.is_available,
            }
        )


class TokenView(TokenObtainPairView):
    """JWT token pair endpoint (SimpleJWT)."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
