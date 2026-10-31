# Suvidha Platform — Full-Stack Django REST Framework + React (Vite) Implementation Blueprint

This document defines the complete technical architecture, backend models, API serializers, Django Channels setup, Celery dispatch queues, and React Vite frontend integration flow for the **Suvidha Essential Services & Logistics Platform**.

## 1. System Architecture & Tech Stack Overview

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FRONTEND TIER (Vite + React)                              │
│                                                                                           │
│   ┌────────────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐  │
│   │   B2C Consumer App     │    │   B2B Merchant Portal  │    │   Field Agent App      │  │
│   │   (React + Leaflet)    │    │   (React + DataGrid)   │    │   (PWA + Camera/OCR)   │  │
│   └───────────┬────────────┘    └───────────┬────────────┘    └───────────┬────────────┘  │
└───────────────┼─────────────────────────────┼─────────────────────────────┼───────────────┘
                │                             │                             │
                │ REST (Axios + JWT)          │ WebSocket (Django Channels) │ WSS Geo-Stream
                ▼                             ▼                             ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                BACKEND TIER (Django REST Framework)                       │
│                                                                                           │
│   ┌───────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                Django ASGI / WSGI Gateway                         │   │
│   └──────────┬──────────────────────────────┬──────────────────────────────┬──────────┘   │
│              │                              │                              │              │
│              ▼                              ▼                              ▼              │
│   ┌────────────────────┐         ┌────────────────────┐         ┌────────────────────┐    │
│   │  authentication/   │         │     tasks/         │         │     ledger/        │    │
│   │  Custom User & JWT │         │ Geo Dispatch & PostGIS │     │ Zero-Fee Invoices  │    │
│   └────────────────────┘         └────────────────────┘         └────────────────────┘    │
└──────────────┬──────────────────────────────┬──────────────────────────────┬──────────────┘
               │                              │                              │
               ▼                              ▼                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DATA & QUEUE TIER                                      │
│                                                                                           │
│  ┌──────────────────────────┐   ┌──────────────────────────┐   ┌───────────────────────┐  │
│  │   PostgreSQL + PostGIS    │   │   Redis Cache & Spatial  │   │  Celery Worker Engine │  │
│  │   (Relational & Spatial) │   │   (Geo-Matching & WS)    │   │  (Async Matching/SOS) │  │
│  └──────────────────────────┘   └──────────────────────────┘   └───────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

## 2. Django Backend Application Structure

### Directory Layout
```
suvidha_backend/
├── manage.py
├── suvidha_core/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py                  # WebSockets + HTTP Entry
│   └── wsgi.py
├── apps/
│   ├── authentication/          # User Profiles, JWT & Auth Roles
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── subscriptions/           # B2B Monthly & B2C Pass Plans
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── views.py
│   ├── tasks/                   # Task Dispatch Engine & PostGIS Models
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── consumers.py         # Django Channels WebSockets
│   │   ├── routing.py
│   │   └── tasks.py             # Celery Async Dispatch Tasks
│   └── ledger/                  # Zero-Fee Billing & OCR Verification
│       ├── models.py
│       ├── serializers.py
│       └── views.py
└── requirements.txt
```

## 3. Core Django Models Implementation

```python
# apps/authentication/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        B2C_SUBSCRIBER = 'B2C', 'B2C Subscriber'
        B2B_PARTNER = 'B2B', 'B2B Partner'
        FIELD_AGENT = 'AGENT', 'Field Agent'
        ADMIN = 'ADMIN', 'System Administrator'

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.B2C_SUBSCRIBER)
    phone_number = models.CharField(max_length=20, unique=True)
    is_emergency_contact_enabled = models.BooleanField(default=False)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)

class AgentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='agent_profile')
    is_on_duty = models.BooleanField(default=False)
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Agent {self.user.first_name} - Duty: {self.is_on_duty}"
```

```python
# apps/tasks/models.py
from django.contrib.gis.db import models as gis_models
from django.db import models
from apps.authentication.models import User

class Task(models.Model):
    class Category(models.TextChoices):
        B2B_LOGISTICS = 'B2B_LOGISTICS', 'B2B Logistics & Delivery'
        B2C_PERSONAL_ASSIST = 'B2C_ASSIST', 'B2C Personal Errand'
        EMERGENCY_SOS = 'EMERGENCY_SOS', 'Emergency First Response'

    class Status(models.TextChoices):
        CREATED = 'CREATED', 'Task Created'
        OFFERED = 'OFFERED', 'Offered to Nearest Agent'
        ACCEPTED = 'ACCEPTED', 'Accepted by Agent'
        EN_ROUTE = 'EN_ROUTE', 'Agent En-Route'
        STORE_PURCHASE = 'STORE_PURCHASE', 'Purchasing Goods'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    assigned_agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    category = models.CharField(max_length=20, choices=Category.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATED)
    
    pickup_location = gis_models.PointField(srid=4326)
    drop_location = gis_models.PointField(srid=4326, null=True, blank=True)
    
    instructions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Task #{self.id} - {self.category} ({self.status})"
```

```python
# apps/ledger/models.py
from django.db import models
from apps.tasks.models import Task

class TaskLedger(models.Model):
    task = models.OneToOneField(Task, on_delete=models.CASCADE, related_name='ledger')
    receipt_image = models.ImageField(upload_to='receipts/%Y/%m/')
    actual_store_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # Guaranteed 0.00 for active subscribers
    is_approved_by_customer = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_customer_charge(self):
        return self.actual_store_cost + self.service_fee
```

## 4. API Endpoints & Serializers Architecture

```python
# apps/tasks/serializers.py
from rest_framework import serializers
from apps.tasks.models import Task
from django.contrib.gis.geos import Point

class TaskCreateSerializer(serializers.ModelSerializer):
    pickup_lat = serializers.FloatField(write_only=True)
    pickup_lng = serializers.FloatField(write_only=True)
    drop_lat = serializers.FloatField(write_only=True, required=False)
    drop_lng = serializers.FloatField(write_only=True, required=False)

    class Meta:
        model = Task
        fields = ['id', 'category', 'instructions', 'pickup_lat', 'pickup_lng', 'drop_lat', 'drop_lng', 'status', 'created_at']

    def create(self, validated_data):
        pickup_lat = validated_data.pop('pickup_lat')
        pickup_lng = validated_data.pop('pickup_lng')
        validated_data['pickup_location'] = Point(pickup_lng, pickup_lat, srid=4326)

        if 'drop_lat' in validated_data and 'drop_lng' in validated_data:
            drop_lat = validated_data.pop('drop_lat')
            drop_lng = validated_data.pop('drop_lng')
            validated_data['drop_location'] = Point(drop_lng, drop_lat, srid=4326)

        validated_data['requested_by'] = self.context['request'].user
        return super().create(validated_data)
```

```python
# apps/tasks/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.tasks.models import Task
from apps.tasks.serializers import TaskCreateSerializer
from apps.tasks.tasks import trigger_emergency_dispatch_celery

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'AGENT':
            return Task.objects.filter(assigned_agent=user)
        return Task.objects.filter(requested_by=user)

    @action(detail=False, methods=['post'], url_path='sos-trigger')
    def emergency_sos(self, request):
        user = request.user
        lat = request.data.get('latitude')
        lng = request.data.get('longitude')

        emergency_task = Task.objects.create(
            requested_by=user,
            category=Task.Category.EMERGENCY_SOS,
            status=Task.Status.CREATED,
            pickup_location=Point(float(lng), float(lat), srid=4326),
            instructions="CRITICAL SOS EMERGENCY DISPATCH TRIGGERED"
        )

        trigger_emergency_dispatch_celery.delay(emergency_task.id, user.id, lat, lng)

        return Response({
            "status": "EMERGENCY_DISPATCHED",
            "task_id": emergency_task.id,
            "message": "Emergency dispatch initiated. Help is on the way."
        }, status=status.HTTP_201_CREATED)
```

## 5. WebSockets & Real-Time Setup (Django Channels)

```python
# apps/tasks/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

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
```

## 6. Frontend Integration (React + Vite)

```javascript
// src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

```javascript
// src/hooks/useTaskSocket.js
import { useEffect, useState, useRef } from 'react';

export function useTaskSocket(taskId) {
  const [location, setLocation] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!taskId) return;

    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000'}/ws/tasks/${taskId}/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => setIsConnected(true);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'LOCATION_STREAM') {
        setLocation({ lat: data.latitude, lng: data.longitude });
      }
    };

    socketRef.current.onclose = () => setIsConnected(false);

    return () => {
      socketRef.current?.close();
    };
  }, [taskId]);

  return { location, isConnected };
}
```

## 7. Execution & Deployment Commands

```bash
# Backend Setup
pip install -r requirements.txt
python manage.py migrate
daphne -b 0.0.0.0 -p 8000 suvidha_core.asgi:application
celery -A suvidha_core worker --loglevel=info -P solo

# Frontend Setup
npm install
npm run dev
```