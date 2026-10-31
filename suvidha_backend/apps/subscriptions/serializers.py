from rest_framework import serializers

from apps.subscriptions.models import Subscription, SubscriptionPlan


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    priceDisplay = serializers.SerializerMethodField()
    billingPeriod = serializers.CharField(source='billing_period', read_only=True)
    externalExpensePolicy = serializers.SerializerMethodField()

    class Meta:
        model = SubscriptionPlan
        fields = [
            'id',
            'name',
            'audience',
            'price',
            'priceDisplay',
            'billingPeriod',
            'badge',
            'description',
            'features',
            'externalExpensePolicy',
        ]
        read_only_fields = fields

    def get_priceDisplay(self, obj):
        return f'₹{obj.price:.0f}'

    def get_externalExpensePolicy(self, obj):
        return obj.external_expense_policy or 'Third-party expenses billed transparently.'


class SubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    plan_price = serializers.DecimalField(source='plan.price', read_only=True, decimal_places=2, max_digits=10)
    isActive = serializers.SerializerMethodField()
    startedAt = serializers.DateTimeField(source='started_at', read_only=True)
    endsAt = serializers.DateTimeField(source='ends_at', read_only=True)

    class Meta:
        model = Subscription
        fields = [
            'id',
            'user',
            'plan',
            'plan_name',
            'plan_price',
            'status',
            'isActive',
            'startedAt',
            'endsAt',
        ]
        read_only_fields = fields

    def get_isActive(self, obj):
        return obj.is_active
