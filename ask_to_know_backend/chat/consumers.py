import json
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from user.repository import UserRepository
from .service import MessageService


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.chatroom_name = ""
        self.recipients_id = None          # in case of group chat it will be group id
        self.room_model = "one_to_one"
        # self.room_group_name = None

    async def connect(self):
        is_valid_chatroom = False
        self.user = self.scope['user']
        if self.user.is_authenticated:
            self.chatroom_name = self.scope['url_route']['kwargs'].get('room', None) #(1_5) two user id in sorting order
            # get query string from url
            query_string = self.scope.get('query_string').decode()
            query_params = parse_qs(query_string)
            room_type = query_params.get('type', [""])[0]

            if room_type == "single":
                self.room_model = "one_to_one"

                users_id = self.chatroom_name.split('_')
                is_valid_chatroom = len(users_id) == 2 # check for if 2 user id provided
                try:
                    self.recipients_id = next(int(target_user) for target_user in users_id if int(target_user) != self.user.id)
                    is_valid_chatroom = await self.user_exists(self.recipients_id)
                except ValueError:
                    is_valid_chatroom = False

            elif room_type == "group":
                self.room_model = "group"
                self.recipients_id = self.chatroom_name
                is_valid_chatroom = await self.message_group_exists(self.chatroom_name)

            if not is_valid_chatroom:
                await self.close()
            else:
                await self.channel_layer.group_add(
                    self.chatroom_name,
                    self.channel_name
                )
                await self.accept()
        else:
            await self.close()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.chatroom_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message', None)
        if len(message) > 300:
            payload = {
                "error": "too large message",
                "status": 404
            }
            await self.send(text_data=json.dumps(payload))
        else:
            # save message to database
            await self.store_message(self.room_model,
                               {'content': message, 'message_from': self.user, 'message_to_id': self.recipients_id})
            event = {
                'type': 'message_handler',
                "message": message,
                "sender": self.user.id
            }

            await self.channel_layer.group_send(
                self.chatroom_name,
                event
            )

    async def message_handler(self, event):
        message = event['payload']
        await self.send(text_data=json.dumps(message))

    @staticmethod
    @database_sync_to_async
    def user_exists(user_id):
        return UserRepository.check_user_exists([user_id])

    @staticmethod
    @database_sync_to_async
    def message_group_exists(group_id):
        return MessageService.check_message_group_existence(group_id)

    @staticmethod
    @database_sync_to_async
    def store_message(model: str, data: dict):
        MessageService.create_message(data, model)


