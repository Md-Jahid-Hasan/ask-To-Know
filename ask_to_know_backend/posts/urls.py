from django.urls import path
from .views import PostVoteAPIView, PostCreateAPIView

app_name = 'posts'

urlpatterns = [
    path('vote/<int:pk>/', PostVoteAPIView.as_view(), name='post-vote'),
    path('create/', PostCreateAPIView.as_view(), name='post-create'),
]
