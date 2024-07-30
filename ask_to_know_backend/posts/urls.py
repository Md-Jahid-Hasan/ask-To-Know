from django.urls import path
from .views import PostVoteAPIView, PostDeleteView, PostCommentView, PostFeedView

app_name = 'posts'

urlpatterns = [
    path("", PostFeedView.as_view(), name='post-feed'),
    path('<int:pk>/', PostDeleteView.as_view(), name='post-delete'),
    path('vote/<int:pk>/', PostVoteAPIView.as_view(), name='post-vote'),
    path('comment/<int:pk>/', PostCommentView.as_view(), name='post-comment'),
    # comment delete + create + list
]
