from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from apps.authentication.models import AgentProfile, User
from apps.tasks.models import Task
from apps.tasks.serializers import TaskCreateSerializer
from apps.tasks.tasks import trigger_emergency_dispatch_celery

User = get_user_model()


class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all().select_related('requested_by', 'assigned_agent')
    serializer_class = TaskCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.FIELD_AGENT:
            return Task.objects.filter(assigned_agent=user).select_related('requested_by', 'assigned_agent')
        if user.role == User.Role.ADMIN:
            return Task.objects.all().select_related('requested_by', 'assigned_agent')
        return Task.objects.filter(requested_by=user).select_related('requested_by', 'assigned_agent')

    def perform_create(self, serializer):
        task = serializer.save()
        return task


class TaskSOSView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        task = Task.objects.create(
            requested_by=request.user,
            category=Task.Category.EMERGENCY_SOS,
            status=Task.Status.CREATED,
            pickup_latitude=request.data.get('latitude'),
            pickup_longitude=request.data.get('longitude'),
            instructions='CRITICAL SOS EMERGENCY DISPATCH TRIGGERED',
        )

        trigger_emergency_dispatch_celery.delay(
            task.id, request.user.id, task.pickup_latitude, task.pickup_longitude
        )

        return Response(
            {
                'status': 'EMERGENCY_DISPATCHED',
                'task_id': task.id,
                'message': 'Emergency dispatch initiated. Help is on the way.',
            },
            status=status.HTTP_201_CREATED,
        )


class BusinessTaskListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(
            requested_by__role=User.Role.B2B_PARTNER
        ).select_related('requested_by', 'assigned_agent')

        business_tasks = [
            {
                'id': task.id,
                'businessId': task.requested_by_id,
                'taskCategory': task.category,
                'pickupOrigin': task.pickup_latitude,
                'destination': task.drop_latitude,
                'priority': 'Standard',
                'status': task.status,
                'notes': task.instructions,
                'createdDate': task.created_at,
            }
            for task in tasks
        ]
        return Response(business_tasks)

    def post(self, request):
        from apps.tasks.serializers import TaskCreateSerializer

        serializer = TaskCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        task = serializer.save()

        return Response(
            {
                'id': task.id,
                'status': task.status,
                'category': task.category,
                'pickupLatitude': task.pickup_latitude,
                'pickupLongitude': task.pickup_longitude,
                'dropLatitude': task.drop_latitude,
                'dropLongitude': task.drop_longitude,
                'instructions': task.instructions,
                'createdAt': task.created_at,
            },
            status=status.HTTP_201_CREATED,
        )


class FleetAgentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        agents = AgentProfile.objects.select_related('user').all()
        data = [
            {
                'id': agent.user_id,
                'agentCode': f'AG-{agent.user_id}',
                'name': agent.user.full_name,
                'availability': 'Available' if agent.is_available else 'Standby',
                'currentTaskId': None,
                'specialization': agent.vehicle_type,
                'demoRating': str(agent.rating),
            }
            for agent in agents
        ]
        return Response(data)
