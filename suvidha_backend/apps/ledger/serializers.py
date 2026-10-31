from rest_framework import serializers

from apps.ledger.models import TaskLedger


class TaskLedgerSerializer(serializers.ModelSerializer):
    taskId = serializers.IntegerField(source='task_id', read_only=True)
    receiptImage = serializers.FileField(source='receipt_image', read_only=True, allow_null=True)
    actualStoreCost = serializers.DecimalField(source='actual_store_cost', read_only=True, decimal_places=2, max_digits=10)
    serviceFee = serializers.DecimalField(source='service_fee', read_only=True, decimal_places=2, max_digits=10)
    isApprovedByCustomer = serializers.BooleanField(source='is_approved_by_customer', read_only=True)
    totalCustomerCharge = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = TaskLedger
        fields = [
            'id',
            'taskId',
            'receiptImage',
            'actualStoreCost',
            'serviceFee',
            'isApprovedByCustomer',
            'totalCustomerCharge',
            'createdAt',
        ]
        read_only_fields = fields

    def get_totalCustomerCharge(self, obj):
        return obj.total_customer_charge
