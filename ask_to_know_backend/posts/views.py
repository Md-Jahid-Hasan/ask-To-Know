from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from posts.models import Posts

from posts.serializers import PostCreateSerializer, PostVoteSerializer


class PostCreateAPIView(CreateAPIView):
    # TODO test this field
    serializer_class = PostCreateSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


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

        return Response({"result": "success"}, status=status.HTTP_200_OK)
