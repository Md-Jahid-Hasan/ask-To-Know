from rest_framework import status, serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, DestroyAPIView, ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from ask_to_know_backend.custom_permissions import IsOwnerOrReadOnly
from posts.models import Posts, PostComments
from posts.serializers import PostCreateSerializer, PostVoteSerializer, PostCommentSerializer, PostSerializer


class BasePagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'offset'
    max_page_size = 100


class PostFeedView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = BasePagination
    queryset = Posts.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def post(self, request, *args, **kwargs):
        self.create(request, *args, **kwargs)
        return Response({"result": True}, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)
    queryset = Posts.objects.all()


class PostVoteAPIView(APIView):
    """User vote for post. if same person vote multiple times this class prevent this by default by add() method of
    m2m field"""

    def post(self, request, *args, **kwargs):
        serializer = PostVoteSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            rating = serializer.validated_data['rating']
            post_id = kwargs['pk']
            post = Posts.objects.get(pk=post_id)
            post.votes.add(request.user, through_defaults={'rating': rating})

        return Response({"result": True}, status=status.HTTP_200_OK)


class PostCommentView(ListCreateAPIView, DestroyAPIView):
    """This view is responsible for both create, delete and list post comments. When create a post comment(POST method),
     id/query parameter is represented the post id. And when delete a post comment (DELETE method), id/query parameter
      is represented the comment id. In case of get list (GET Method) id/query parameter is represented as Post."""
    pagination_class = BasePagination
    permission_classes = (IsAuthenticated,)
    serializer_class = PostCommentSerializer

    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method == 'DELETE':
            permissions.append(IsOwnerOrReadOnly())
        return permissions

    def get_queryset(self):
        if self.request.method == 'DELETE':
            return PostComments.objects.all()

        post_id = self.kwargs['pk']
        try:
            post = Posts.objects.get(pk=post_id)
        except Posts.DoesNotExist:
            raise serializers.ValidationError({"post": ["Post does not exist"]})
        return PostComments.objects.filter(post=post)

    def post(self, request, *args, **kwargs):
        self.create(request, *args, **kwargs)
        return Response({"result": True}, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        try:
            post = Posts.objects.get(pk=self.kwargs['pk'])
        except Posts.DoesNotExist:
            raise serializers.ValidationError({"post": ["Post does not exist"]})
        serializer.save(user=self.request.user, post=post)
