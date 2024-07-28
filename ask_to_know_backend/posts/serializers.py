from rest_framework import serializers
from .models import Posts, PostVote


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = '__all__'


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ('content', 'user', 'created_at', 'average_votes', 'total_comments')
        read_only_fields = ('user', 'created_at', 'average_votes', 'total_comments')
        write_only_fields = ('content', )


class PostVoteSerializer(serializers.Serializer):
    rating = serializers.IntegerField()