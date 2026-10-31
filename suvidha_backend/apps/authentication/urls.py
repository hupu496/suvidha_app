from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.authentication import views as auth_views

urlpatterns = [
    path('phone-lookup/', auth_views.PhoneLookupView.as_view(), name='phone-lookup'),
    path('register/customer/', auth_views.CustomerRegistrationView.as_view(), name='register-customer'),
    path('register/business/', auth_views.BusinessRegistrationView.as_view(), name='register-business'),
    path('register/rider/', auth_views.RiderRegistrationView.as_view(), name='register-rider'),
    path('otp/', auth_views.OTPRequestView.as_view(), name='otp-request'),
    path('verify-otp/', auth_views.VerifyOTPView.as_view(), name='verify-otp'),
    path('me/', auth_views.MeView.as_view(), name='me'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('agents/me/', auth_views.AgentProfileView.as_view(), name='agent-profile'),
    path('agents/me/duty/', auth_views.AgentDutyView.as_view(), name='agent-duty'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]
