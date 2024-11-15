from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    path('ws/chat/single/<str:single_chat>/', ChatConsumer.as_asgi()),
]