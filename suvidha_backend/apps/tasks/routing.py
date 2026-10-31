from django.urls import re_path

from apps.tasks.consumers import TaskDispatchConsumer

websocket_urlpatterns = [
    re_path(r'ws/tasks/(?P<task_id>\d+)/$', TaskDispatchConsumer.as_asgi()),
]
