from rest_framework import serializers
from .models import Posts, PostVote, PostComments


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = '__all__'


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ('content', 'user')
        extra_kwargs = {'user': {'required': False}}


class PostVoteSerializer(serializers.Serializer):
    rating = serializers.IntegerField()


class PostCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostComments
        fields = ('content', 'user', 'post')
        extra_kwargs = {'user': {'required': False}, 'post': {'required': False}}