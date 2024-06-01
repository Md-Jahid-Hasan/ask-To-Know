from rest_framework import serializers
from .models import Question, Category
from user.serializers import UserNameSerializer


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class AdminQuestionSerializer(QuestionSerializer):
    category = CategorySerializer()
    user = UserNameSerializer()
