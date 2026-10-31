import os

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application
from django.urls import re_path

from apps.tasks.consumers import TaskDispatchConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'suvidha_core.settings')

application = ProtocolTypeRouter(
    {
        'http': get_asgi_application(),
        'websocket': re_path(
            r'ws/tasks/(?P<task_id>\d+)/$',
            TaskDispatchConsumer.as_asgi(),
        ),
    }
)
