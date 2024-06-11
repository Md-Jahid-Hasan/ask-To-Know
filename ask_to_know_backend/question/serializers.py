import os

from rest_framework import serializers
from .models import Question, Category, QuestionAttachment
from user.serializers import UserNameSerializer


class QuestionAttachmentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    # type = serializers.SerializerMethodField()

    class Meta:
        model = QuestionAttachment
        fields = ('attachment', 'question', 'name')
        extra_kwargs = {'question': {'write_only': True}}

    def get_name(self, obj):
        name = os.path.basename(obj.attachment.name)
        return name


class QuestionSerializer(serializers.ModelSerializer):
    question_attachments = QuestionAttachmentSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = '__all__'

    def create(self, validated_data):
        request = self.context["request"]
        files = request.FILES.getlist('question_attachments')
        question = super(QuestionSerializer, self).create(validated_data)

        if files:
            for file in files:
                QuestionAttachment.objects.create(question=question, attachment=file)
            # file_serializer = QuestionAttachmentSerializer(data=files, many=True)
            # if file_serializer.is_valid():
            #     file_serializer.save(question=question)
        return question


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class AdminQuestionSerializer(QuestionSerializer):
    question_attachments = QuestionAttachmentSerializer(many=True, read_only=True)
    category = CategorySerializer()
    user = UserNameSerializer()
