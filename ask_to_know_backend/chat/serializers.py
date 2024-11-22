from rest_framework import serializers
from .models import OneToOneMessage, GroupMessage, MessageGroup


class ChatListSerializer(serializers.ModelSerializer):
    class Meta:
        model = OneToOneMessage
        exclude = ['message_from', 'message_to']


class CreateGroupSerializer(serializers.ModelSerializer):
    participants = serializers.ListField(child=serializers.IntegerField(min_value=1))

    class Meta:
        model = MessageGroup
        fields = ('name', 'participants')


class GroupMessageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = ('message_from', 'content', 'created_at')


class MessageGroupWithMessage(serializers.ModelSerializer):
    all_group_message = GroupMessageListSerializer(many=True)

    class Meta:
        model = MessageGroup
        fields = ('name', 'all_group_message')

