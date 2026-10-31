from django.urls import path
from rest_framework import generics, permissions

from apps.subscriptions import views

urlpatterns = [
    path('plans/', views.SubscriptionPlanListView.as_view(), name='subscription-plans'),
    path('subscriptions/', views.SubscriptionListCreateView.as_view(), name='subscription-list'),
]
