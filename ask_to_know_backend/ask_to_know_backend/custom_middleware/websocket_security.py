from urllib.parse import parse_qs

import jwt
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model as User


@database_sync_to_async
def get_user_from_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        user = User().objects.get(id=user_id)
        return user
    except Exception as e:
        return AnonymousUser()


class WebsocketAuthorizeMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [""])[0]
        scope['user'] = await get_user_from_token(token)
        return await super().__call__(scope, receive, send)