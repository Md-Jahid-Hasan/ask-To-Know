from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .service import MessageService
from chat.serializers import ChatListSerializer, CreateGroupSerializer, MessageGroupWithMessage


class ChatList(ListAPIView):
    serializer_class = ChatListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        query = MessageService.get_one_to_one_message_of_user(self.request.user, self.kwargs['message_to'])
        return query


class DeleteMessage(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, pk, **kwargs):
        MessageService.delete_message(pk, request.query_params.get("type"))
        return Response(status=status.HTTP_204_NO_CONTENT)


class CreateMessageGroup(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CreateGroupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)   # validating api payload
        group = MessageService.create_message_group(serializer.validated_data)
        serialized_data = MessageGroupWithMessage(instance=group) # serializing data for user response
        return Response(data=serialized_data.data, status=status.HTTP_201_CREATED)


class AddUserToGroup(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, group_id, **kwargs):
        payload = request.data
        MessageService.add_user_to_group(payload, group_id, request.user)
        return Response(status=status.HTTP_200_OK)