from django.contrib import admin
from chat.models import OneToOneMessage, GroupMessage, MessageGroup, GroupParticipate


admin.site.register(OneToOneMessage)
admin.site.register(GroupMessage)
admin.site.register(GroupParticipate)
