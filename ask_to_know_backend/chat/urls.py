from django.urls import path
from .views import ChatList, DeleteMessage, CreateMessageGroup, AddUserToGroup

app_name = 'chat'

urlpatterns = [
    path('<int:message_to>/', ChatList.as_view(), name='chat-list'),
    path("message/<int:pk>", DeleteMessage.as_view(), name="delete-message"),
    path("create-group/", CreateMessageGroup.as_view(), name="create-group"),
    path("add-user-to-group/<int:group_id>/", AddUserToGroup.as_view(), name="add-user-to-group"),
]