from django.contrib import admin
from .models import Question, Category, QuestionAttachment

admin.site.register(Question)
admin.site.register(Category)
admin.site.register(QuestionAttachment)
