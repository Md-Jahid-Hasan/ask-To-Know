from django.contrib import admin
from .models import Posts, PostComments, PostVote

admin.site.register(Posts)
admin.site.register(PostComments)
admin.site.register(PostVote)
