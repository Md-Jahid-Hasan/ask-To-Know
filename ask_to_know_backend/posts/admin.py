from django.contrib import admin
from .models import Posts, PostComments, PostVote


class CommentsAdmin(admin.ModelAdmin):
    list_display = ('user', 'post')


admin.site.register(Posts)
admin.site.register(PostVote)
admin.site.register(PostComments, CommentsAdmin)
