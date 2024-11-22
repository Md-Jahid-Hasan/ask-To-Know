from user.repository import UserRepository
from .repository import MessageRepository
from rest_framework.exceptions import ValidationError
from django.core.exceptions import PermissionDenied


class MessageService:

    @staticmethod
    def get_one_to_one_message_of_user(message_from, message_to):
        """
        :param message_from: user that send the message or request user
        :param message_to: user that receive the message or target user
        :return: list of message between the two user
        """
        return MessageRepository.get_one_to_one_message_of_user(message_from, message_to)

    @staticmethod
    def delete_message(message_id: int, message_type: str):
        """
        :param message_id: id of the message for lookup
        :param message_type: type of the message (one_to_one, group)
        """
        if message_type == 'one_to_one':
            MessageRepository.delete_one_to_one_message(message_id)

    @staticmethod
    def create_message(data: dict, message_type: str):
        """
        :param data: dict of message data (content, message_from, message_to)
        :param message_type: type of the message (one_to_one, group)
        """
        if message_type == 'one_to_one':
            message = MessageRepository.create_one_to_one_message(data)
            return message
        if message_type == "group":
            message = MessageRepository.create_group_message(data)
            return message

    @staticmethod
    def check_message_group_existence(user_id: int) -> bool:
        """
        :param user_id: id of the message group
        :return: True if group exists else False
        """
        try:
            user_id = int(user_id)
        except ValueError:
            return False
        return MessageRepository.check_message_group_existence(user_id)

    @staticmethod
    def create_message_group(data: dict):
        """
        :param data: dict of message data (name, participants)
        :return: True if group exists else False
        """
        users = data.get("participants", [])
        if len(users) < 1:
            raise ValidationError({"users": "Need at least one user id for create group."})
        users = [int(user) for user in users]
        check_user_existence = UserRepository.check_user_exists(users)
        if not check_user_existence:
            raise ValidationError({"users": "One or more user not found."})
        group = MessageRepository.create_message_group(data.get("name"), users)
        return group

    @staticmethod
    def add_user_to_group(data: dict, group_id: int, user):
        """
        :param data: list of user id
        :param group_id: id of the group
        :param user: user that request to add user to group
        """
        group = MessageRepository.get_group_by_payload({"id":group_id})
        if not group:
            raise ValidationError({"group": "Group not found."})

        if not MessageRepository.check_group_member_or_not(group, user):
            raise PermissionDenied("You don't have permission to add new member")

        participants = data.get("participants", [])
        if not participants:
            raise ValidationError({"participants": "Need at least one user id for add to group."})
        try:
            users = [int(user) for user in participants]
        except (ValueError, TypeError):
            raise ValidationError({"participants": "Invalid user id."})
        check_user_existence = UserRepository.check_user_exists(users)

        if check_user_existence:
            MessageRepository.add_user_to_group(group, users)
        else:
            raise ValidationError({"participants": "One or more user not found."})



