"""
ASGI config for ask_to_know_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from ask_to_know_backend.custom_middleware.websocket_security import WebsocketAuthorizeMiddleware
from chat.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ask_to_know_backend.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    # "websocket": AllowedHostsOriginValidator(
    #     AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
    # ),
    "websocket": WebsocketAuthorizeMiddleware(URLRouter(websocket_urlpatterns))
})
