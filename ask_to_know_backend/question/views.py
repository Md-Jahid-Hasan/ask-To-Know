from django.db.models import Count
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, UpdateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from question.models import Question, Category
from django.contrib.auth import get_user_model as User

from question.serializers import QuestionSerializer, CategorySerializer


class BasePagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'offset'
    max_page_size = 100


class QuestionListCreateView(ListCreateAPIView):
    queryset = Question.objects.all()
    pagination_class = BasePagination
    permission_classes = (IsAuthenticated,)
    serializer_class = QuestionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Question.objects.filter(assignee=user)
        else:
            return Question.objects.filter(user=user)

    def perform_create(self, serializer):
        admin = User().objects.filter(is_staff=True).annotate(
            num_questions=Count('questions_assigned')
        ).order_by('num_questions').first()
        serializer.save(user=self.request.user, assignee=admin)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({"message": "Successfully Created"}, status=status.HTTP_201_CREATED)


class AnswerQuestionView(UpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = (IsAuthenticated,)


class CategoryListCreateView(ListCreateAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated,)
        else:
            self.permission_classes = (AllowAny, )
        return super(CategoryListCreateView, self).get_permissions()
