from rest_framework import serializers

from apps.tasks.models import Task


class TaskCreateSerializer(serializers.ModelSerializer):
    pickup_lat = serializers.FloatField(write_only=True)
    pickup_lng = serializers.FloatField(write_only=True)
    drop_lat = serializers.FloatField(write_only=True, required=False)
    drop_lng = serializers.FloatField(write_only=True, required=False)
    status = serializers.ChoiceField(choices=Task.Status.choices, required=False)

    class Meta:
        model = Task
        fields = [
            'id',
            'category',
            'instructions',
            'pickup_lat',
            'pickup_lng',
            'drop_lat',
            'drop_lng',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        pickup_lat = validated_data.pop('pickup_lat')
        pickup_lng = validated_data.pop('pickup_lng')
        drop_lat = validated_data.pop('drop_lat', None)
        drop_lng = validated_data.pop('drop_lng', None)

        task = Task.objects.create(
            requested_by=self.context['request'].user,
            category=validated_data.get('category') or Task.Category.B2C_ASSIST,
            status=validated_data.get('status') or Task.Status.CREATED,
            instructions=validated_data.get('instructions') or '',
            pickup_latitude=pickup_lat,
            pickup_longitude=pickup_lng,
            drop_latitude=drop_lat,
            drop_longitude=drop_lng,
        )
        return task
