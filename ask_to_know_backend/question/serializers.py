import os

from rest_framework import serializers
from .models import Question, Category, QuestionAttachment
from user.serializers import UserNameSerializer


class QuestionAttachmentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = QuestionAttachment
        fields = ('attachment', 'question', 'name', 'id')
        extra_kwargs = {'question': {'write_only': True}}

    def get_name(self, obj):
        name = os.path.basename(obj.attachment.name)
        return name


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    question_attachments = QuestionAttachmentSerializer(many=True, required=False, write_only=True)
    agent_attachments = QuestionAttachmentSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'answer', 'answered_at', 'category', 'question_attachments', 'created_at', 'question',
                  'expected_answer_at', 'agent_attachments')
        extra_kwargs = {'expected_answer_at': {'read_only': True}}

    def create(self, validated_data):
        request = self.context["request"]
        files = request.FILES.getlist('question_attachments')
        question = super(QuestionSerializer, self).create(validated_data)

        if files:
            for file in files:
                QuestionAttachment.objects.create(question=question, attachment=file, user=request.user)
        return question


class AdminQuestionSerializer(serializers.ModelSerializer):
    deleted_attachments = serializers.ListField(child=serializers.IntegerField(), allow_empty=True, write_only=True)
    question_attachments = QuestionAttachmentSerializer(many=True, write_only=True)
    agent_attachments = QuestionAttachmentSerializer(many=True, read_only=True)
    user_attachments = QuestionAttachmentSerializer(many=True, read_only=True)
    category = CategorySerializer()
    user = UserNameSerializer()

    class Meta:
        model = Question
        fields = '__all__'

    def update(self, instance, validated_data):
        request = self.context["request"]
        files = request.FILES.getlist('question_attachments')
        deleted_files = validated_data.get('deleted_attachments', [])
        if deleted_files:
            QuestionAttachment.objects.filter(id__in=deleted_files).delete()

        question = super(AdminQuestionSerializer, self).update(instance, validated_data)
        if files:
            for file in files:
                QuestionAttachment.objects.create(question=question, attachment=file, user=request.user)
        return question


class AdminQuestionListSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    user = UserNameSerializer()
    is_answered = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ('id', 'question', 'category', 'user', 'created_at', 'is_answered', 'expected_answer_at',)

    def get_is_answered(self, obj):
        return obj.answer is not None and obj.answer != ""

