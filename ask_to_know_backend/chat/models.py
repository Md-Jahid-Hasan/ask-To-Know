from django.db import models
from django.contrib.auth import get_user_model as User


class MessageBaseModel(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class OneToOneMessage(MessageBaseModel):
    message_from = models.ForeignKey(User(), on_delete=models.SET_NULL, null=True, related_name='user_personal_message')
    message_to = models.ForeignKey(User(), on_delete=models.SET_NULL, null=True, related_name='receiver_message')
    # content, created_at

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.message_from} - {self.content[:20]}"


class GroupMessage(MessageBaseModel):
    message_from = models.ForeignKey(User(), on_delete=models.SET_NULL, null=True, related_name='user_group_message')
    message_to = models.ForeignKey("MessageGroup", on_delete=models.SET_NULL, null=True, related_name='all_group_message')
    # content, created_at

    def __str__(self):
        return f"{self.message_from} - {self.content[:20]}"


class MessageGroup(models.Model):
    name = models.CharField(max_length=50)
    users = models.ManyToManyField(User(), related_name='user_group', through="GroupParticipate")
    created_ata = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class GroupParticipate(models.Model):
    group = models.ForeignKey(MessageGroup, on_delete=models.CASCADE)
    user = models.ForeignKey(User(), on_delete=models.CASCADE)

    # class Meta:
    #     unique_together = ('group', 'user')
