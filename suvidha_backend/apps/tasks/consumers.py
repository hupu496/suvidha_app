from channels.generic.websocket import AsyncWebsocketConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path


class TaskDispatchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.task_id = self.scope['url_route']['kwargs']['task_id']
        self.room_group_name = f'task_{self.task_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        import json

        data = json.loads(text_data)
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'location_update',
                'latitude': latitude,
                'longitude': longitude,
                'agent_id': data.get('agent_id')
            }
        )

    async def location_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'LOCATION_STREAM',
            'latitude': event['latitude'],
            'longitude': event['longitude'],
            'agent_id': event['agent_id']
        }))


application = ProtocolTypeRouter({
    'websocket': URLRouter([
        re_path(r'ws/tasks/(?P<task_id>\d+)/$', TaskDispatchConsumer.as_asgi()),
    ]),
})
