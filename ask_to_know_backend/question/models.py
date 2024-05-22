from django.db import models
from django.contrib.auth import get_user_model as User


class Question(models.Model):
    user = models.ForeignKey(User(), on_delete=models.SET_NULL, null=True)
    question = models.TextField()
    answer = models.TextField(null=True, blank=True)
    assignee = models.ForeignKey(User(), on_delete=models.SET_NULL, null=True, related_name='questions_assigned')
    category = models.ForeignKey("Category", on_delete=models.SET_NULL, null=True, related_name='questions_category')


class Category(models.Model):
    name = models.CharField(max_length=80)

    def __str__(self):
        return self.name
