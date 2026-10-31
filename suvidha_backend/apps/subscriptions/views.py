from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.subscriptions.models import Subscription, SubscriptionPlan
from apps.subscriptions.serializers import (
    SubscriptionPlanSerializer,
    SubscriptionSerializer,
)


class SubscriptionPlanListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        plans = SubscriptionPlan.objects.filter(is_active=True).order_by('id')
        serializer = SubscriptionPlanSerializer(plans, many=True)
        return Response(serializer.data)


class SubscriptionListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        subscription = getattr(request.user, 'subscription', None)
        if subscription is None:
            return Response(
                {'success': False, 'error': 'No subscription found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)

    def post(self, request):
        plan_id = request.data.get('planId')
        plan = SubscriptionPlan.objects.filter(id=plan_id, is_active=True).first()
        if plan is None:
            return Response(
                {'success': False, 'error': 'Subscription plan not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        if hasattr(request.user, 'subscription'):
            return Response(
                {'success': False, 'error': 'User already has a subscription.'},
                status=status.HTTP_409_CONFLICT,
            )
        subscription = Subscription.objects.create(user=request.user, plan=plan, status='active')
        return Response(
            {'success': True, 'subscription': SubscriptionSerializer(subscription).data},
            status=status.HTTP_201_CREATED,
        )
