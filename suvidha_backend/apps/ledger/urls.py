from django.urls import path
from rest_framework import permissions

from apps.ledger import views

urlpatterns = [
    path('tasks/<int:task_id>/approve/', views.TaskLedgerApproveView.as_view(), name='task-ledger-approve'),
    path('tasks/<int:task_id>/', views.TaskLedgerDetailView.as_view(), name='task-ledger-detail'),
]
