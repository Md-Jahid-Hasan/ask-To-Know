from rest_framework import serializers
from .models import Posts, PostVote, PostComments


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        exclude = ('votes', )


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ('content', 'user')
        extra_kwargs = {'user': {'required': False}}


class PostVoteSerializer(serializers.Serializer):
    rating = serializers.IntegerField()


class PostCommentSerializer(serializers.ModelSerializer):
    """This serializer is used for fetch comment list and create comment. During create it accept content, user and post
    field and for fetch list it provide content, user, comment_at field"""
    class Meta:
        model = PostComments
        fields = ('content', 'user', 'post', 'comment_at')
        read_only_fields = ('comment_at', )
        extra_kwargs = {'user': {'required': False}, 'post': {'required': False, 'write_only': True}}


