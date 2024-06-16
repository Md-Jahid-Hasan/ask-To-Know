from django.db.models import Count, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response

from question.models import Question, Category, QuestionAttachment
from django.contrib.auth import get_user_model as User

from question.serializers import QuestionSerializer, CategorySerializer, AdminQuestionSerializer, \
    AdminQuestionListSerializer


class BasePagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'offset'
    max_page_size = 100


class QuestionListCreateView(ListCreateAPIView):
    queryset = Question.objects.all()
    pagination_class = BasePagination
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Question.objects.filter(assignee=user)
        else:
            return Question.objects.filter(user=user).prefetch_related(
                Prefetch('question_attachments', queryset=QuestionAttachment.objects.exclude(user=user),
                         to_attr='agent_attachments')
            )

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return AdminQuestionListSerializer
        return QuestionSerializer

    def perform_create(self, serializer):
        admin = User().objects.filter(is_staff=True).annotate(
            num_questions=Count('questions_assigned')
        ).order_by('num_questions').first()
        serializer.save(user=self.request.user, assignee=admin)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({"message": "Successfully Created"}, status=status.HTTP_201_CREATED)


class AnswerQuestionView(RetrieveUpdateAPIView):
    queryset = Question.objects.all()
    permission_classes = (IsAdminUser,)

    def get_object(self):
        user = self.request.user
        lookup_field = self.kwargs.get('pk')
        queryset = Question.objects.filter(assignee=user, pk=lookup_field).prefetch_related(
            Prefetch('question_attachments', queryset=QuestionAttachment.objects.filter(user=user),
                     to_attr='agent_attachments'),
            Prefetch('question_attachments', queryset=QuestionAttachment.objects.exclude(user=user),
                     to_attr='user_attachments'))
        obj = get_object_or_404(queryset)
        return obj

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return AdminQuestionSerializer
        return QuestionSerializer


class CategoryListCreateView(ListCreateAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated,)
        else:
            self.permission_classes = (AllowAny,)
        return super(CategoryListCreateView, self).get_permissions()
