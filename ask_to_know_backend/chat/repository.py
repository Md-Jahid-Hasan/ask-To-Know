from chat.models import OneToOneMessage, MessageGroup, GroupMessage
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError


class MessageRepository:

    @staticmethod
    def get_all_one_to_one_message():
        """
        :return: list of all one to one message
        """
        return OneToOneMessage.objects.all()

    @staticmethod
    def get_one_to_one_message_of_user(message_from, message_to):
        """
        :param message_from: user that send the message or request user
        :param message_to: user that receive the message or target user
        :return: list of message between the two user
        """
        return OneToOneMessage.objects.filter(
            Q(message_from=message_from, message_to=message_to) | Q(message_from=message_to, message_to=message_from)
        )

    @staticmethod
    def delete_one_to_one_message(message_id: int):
        """
        :param message_id: id of the message
        :return: None
        """
        try:
            OneToOneMessage.objects.get(id=message_id).delete()
        except OneToOneMessage.DoesNotExist:
            raise NotFound("No message found with this is")

    @staticmethod
    def create_one_to_one_message(data: dict):
        """
        :param data: dict of message data
        :return: None
        """
        message = OneToOneMessage.objects.create(**data)
        return message

    @staticmethod
    def create_group_message(data: dict):
        """
        :param data: dict of message data for group message
        :return: GroupMessage Object
        """
        message = GroupMessage.objects.create(**data)
        return message

    @staticmethod
    def check_message_group_existence(group_id: int) -> bool:
        """
        :param group_id: id of the message group
        :return: True if group exists else False
        """
        return MessageGroup.objects.filter(id=group_id).exists()

    @staticmethod
    def get_group_by_payload(payload: dict):
        """
        :param payload: lookup field for group query
        :return: MessageGroup object
        """
        try:
            return MessageGroup.objects.get(**payload)
        except MessageGroup.DoesNotExist:
            return None

    @staticmethod
    def check_group_member_or_not(group, user) -> bool:
        """
        :param group: MessageGroup object
        :param user: User object
        return: True if user is member of the group else False
        """
        return group.users.filter(id=user.id).exists()

    @staticmethod
    def create_message_group(name: str, participants: list):
        """
        :param name: name of the group
        :param participants: list of user id
        :return: None
        """
        #TODO: need to add transaction here
        group = MessageGroup.objects.create(name=name)
        MessageRepository.add_user_to_group(group, participants)
        return group

    @staticmethod
    def add_user_to_group(group, participants):
        """
        :param group: a group object from MessageGroup model
        :param participants: list of user id
        """
        try:
            group.users.add(*participants)
        except Exception as e:
            raise ValidationError("Failed add user on group")

