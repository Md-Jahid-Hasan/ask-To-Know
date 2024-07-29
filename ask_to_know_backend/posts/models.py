from django.db import models
from django.contrib.auth import get_user_model as User
from django.db.models import Avg
from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver


class PostVote(models.Model):
    user = models.ForeignKey(User(), on_delete=models.CASCADE)
    post = models.ForeignKey("Posts", on_delete=models.CASCADE)
    voted_at = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default=0)

    class Meta:
        ordering = ('-voted_at',)


class PostComments(models.Model):
    user = models.ForeignKey(User(), on_delete=models.CASCADE)
    post = models.ForeignKey("Posts", on_delete=models.CASCADE, related_name="all_post_comments")
    comment_at = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    reply_to = models.ForeignKey("self", null=True, on_delete=models.CASCADE, related_name='replies', blank=True)

    class Meta:
        ordering = ('-comment_at',)


class Posts(models.Model):
    user = models.ForeignKey(User(), on_delete=models.CASCADE)
    content = models.TextField()
    votes = models.ManyToManyField(User(), related_name='voted_user', blank=True, through=PostVote)
    created_at = models.DateTimeField(auto_now_add=True)
    average_votes = models.IntegerField(default=0)
    total_comments = models.IntegerField(default=0)


@receiver(m2m_changed, sender=Posts.votes.through)
def update_total_likes(sender, instance, **kwargs):
    average_votes = instance.votes.all().aggregate(Avg('postvote__rating'))
    if average_votes['postvote__rating__avg'] is not None:
        instance.average_votes = average_votes['postvote__rating__avg']
        instance.save()


@receiver(post_save, sender=PostComments)
def update_total_comments(sender, instance, **kwargs):
    post = instance.post
    post.total_comments += 1
    post.save()
