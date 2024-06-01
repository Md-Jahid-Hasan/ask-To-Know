from django.urls import path
from .views import QuestionListCreateView, AnswerQuestionView, CategoryListCreateView

app_name = 'question'

urlpatterns = [
    path('list/', QuestionListCreateView.as_view(), name='question-list'),
    path('client-answer/<int:pk>/', AnswerQuestionView.as_view(), name='question-answer'),
    path('category/', CategoryListCreateView.as_view(), name='question-category')
]
