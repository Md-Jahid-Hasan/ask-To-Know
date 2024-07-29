from django.urls import path
from .views import PostVoteAPIView, PostCreateAPIView, PostDeleteView, PostCommentCreateView

app_name = 'posts'

urlpatterns = [
    path('vote/<int:pk>/', PostVoteAPIView.as_view(), name='post-vote'),
    path('create/', PostCreateAPIView.as_view(), name='post-create'),
    path('<int:pk>/', PostDeleteView.as_view(), name='post-delete'),
    path('comment/<int:pk>/', PostCommentCreateView.as_view(), name='post-comment'),
    # path("comment/<int:pk>/", PostCommentDestroyView.as_view(), name='post-comment-delete'),
]
