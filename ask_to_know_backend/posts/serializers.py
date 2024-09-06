from rest_framework import serializers

from user.serializers import UserNameSerializer
from .models import Posts, PostComments


class PostSerializer(serializers.ModelSerializer):
    user = UserNameSerializer(read_only=True)
    is_voted = serializers.SerializerMethodField()

    class Meta:
        model = Posts
        exclude = ('votes', )

    def get_is_voted(self, obj):
        request = self.context.get('request')
        return obj.votes.filter(postvote__user=request.user).exists()


class PostCreateSerializer(serializers.ModelSerializer):
    user = UserNameSerializer(read_only=True)

    class Meta:
        model = Posts
        fields = ('id', 'content', 'user', 'created_at', 'average_votes', 'total_comments')
        read_only_fields = ('created_at', 'average_votes', 'total_comments', 'id')
        extra_kwargs = {'user': {'required': False}}


class PostVoteSerializer(serializers.Serializer):
    rating = serializers.IntegerField()


class PostCommentSerializer(serializers.ModelSerializer):
    """This serializer is used for fetch comment list and create comment. During create it accept content, user and post
    field and for fetch list it provide content, user, comment_at field"""
    user = UserNameSerializer(read_only=True)
    is_owner = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = PostComments
        fields = ('id', 'content', 'user', 'post', 'comment_at', 'is_owner', 'replies', 'reply_to')
        read_only_fields = ('comment_at', )
        extra_kwargs = {'user': {'required': False}, 'post': {'required': False, 'write_only': True},
                        'is_owner': {'required': False, 'read_only': True},
                        'reply_to': {'required': False, 'write_only': True}}

    def get_is_owner(self, obj):
        request = self.context.get('request')
        return obj.user == request.user

    def get_replies(self, obj):
        replies = obj.replies.all()
        serializer = self.__class__(replies, many=True, context=self.context)
        return serializer.data


