from django.urls import path
from rest_framework import permissions

from apps.tasks import views

urlpatterns = [
    path('tasks/', views.TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name='task-list'),
    path('tasks/<int:pk>/', views.TaskViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    }), name='task-detail'),
    path('tasks/sos-trigger/', views.TaskSOSView.as_view(), name='task-sos'),
    path('business/tasks/', views.BusinessTaskListCreateView.as_view(), name='business-task-list'),
    path('business/fleet/agents/', views.FleetAgentsView.as_view(), name='fleet-agents'),
]
