from decimal import Decimal

from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.models import User
from apps.ledger.models import TaskLedger
from apps.ledger.serializers import TaskLedgerSerializer
from apps.tasks.models import Task


class TaskLedgerDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        ledger = TaskLedger.objects.filter(task=task).first()
        if ledger is None:
            return Response(
                {'success': False, 'error': 'No ledger found for this task.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = TaskLedgerSerializer(ledger)
        return Response(serializer.data)


class TaskLedgerApproveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, task_id):
        task = get_object_or_404(Task, id=task_id)
        ledger = TaskLedger.objects.filter(task=task).first()

        if ledger is None:
            ledger = TaskLedger.objects.create(task=task)

        service_fee = Decimal('0.00')
        subscription = getattr(request.user, 'subscription', None)
        if subscription is None or subscription.status != 'active':
            service_fee = Decimal('5.00')

        ledger.actual_store_cost = Decimal(str(request.data.get('actualStoreCost') or 0))
        ledger.service_fee = service_fee
        ledger.is_approved_by_customer = True
        ledger.save(update_fields=['actual_store_cost', 'service_fee', 'is_approved_by_customer'])

        return Response(
            {
                'success': True,
                'ledger': TaskLedgerSerializer(ledger).data,
                'totalCustomerCharge': ledger.total_customer_charge,
            },
            status=status.HTTP_200_OK,
        )
