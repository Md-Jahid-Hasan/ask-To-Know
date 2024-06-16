from django.db import models
from django.contrib.auth import get_user_model as User


class Question(models.Model):
    user = models.ForeignKey(User(), on_delete=models.SET_NULL, null=True)
    question = models.TextField()
    answer = models.TextField(null=True, blank=True)
    assignee = models.ForeignKey(User(), on_delete=models.SET_NULL, null=True, related_name='questions_assigned')
    category = models.ForeignKey("Category", on_delete=models.SET_NULL, null=True, related_name='questions_category')
    created_at = models.DateTimeField(auto_now_add=True)
    answered_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    expected_answer_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']


class QuestionAttachment(models.Model):
    attachment = models.FileField(upload_to='media/questions/')
    user = models.ForeignKey(User(), on_delete=models.SET_NULL, null=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='question_attachments')


class Category(models.Model):
    name = models.CharField(max_length=80)

    def __str__(self):
        return self.name
