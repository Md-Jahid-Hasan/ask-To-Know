import json

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model as User
from channels.generic.websocket import AsyncWebsocketConsumer

from chat.models import OneToOneMessage


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.chatroom_name = ""
        self.recipients_id = None          # in case of group chat it will be group id
        self.room_model = OneToOneMessage
        # self.room_group_name = None

    async def connect(self):
        is_valid_chatroom = False
        self.user = self.scope['user']
        if self.user.is_authenticated:
            one_to_one_room = self.scope['url_route']['kwargs'].get('single_chat', None)
            if one_to_one_room:
                self.chatroom_name = one_to_one_room
                self.room_model = OneToOneMessage

                users_id = self.chatroom_name.split('_')
                is_valid_chatroom = len(users_id) == 2 # check for if 2 user id provided
                try:
                    # get the other user id and validate it
                    self.recipients_id = next(target_user for target_user in users_id if int(target_user) != self.user.id)
                    is_valid_chatroom = await self.user_exists(self.recipients_id)
                except ValueError:
                    is_valid_chatroom = False

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

        # save message to database
        await self.store_message(self.room_model,
                           {'content': message, 'message_from': self.user, 'message_to_id': self.recipients_id})

        event = {
            'type': 'message_handler',
            'message': message,
            'sender': self.user.id
        }

        await self.channel_layer.group_send(
            self.chatroom_name,
            event
        )

    async def message_handler(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message, 'sender': event['sender']
        }))

    @staticmethod
    @database_sync_to_async
    def user_exists(user_id):
        return User().objects.filter(id=user_id).exists()

    @database_sync_to_async
    def store_message(self, model, data: dict):

        model.objects.create(**data)


