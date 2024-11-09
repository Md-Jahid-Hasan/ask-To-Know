import string
import random
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Posts
from posts.serializers import PostCommentSerializer
from tests.test_user import create_user, PAYLOAD

# import all reverse url from urls.py file
POST_FEED_URL = reverse('posts:post-feed')
POST_VOTE_URL = reverse('posts:post-vote', kwargs={'pk': 1})
POST_COMMENT_URL = reverse('posts:post-comment', kwargs={'pk': 1})
POST_DELETE_URL = reverse('posts:post-delete', kwargs={'pk': 1})


class PostAPITests(TestCase):
    def setUp(self):
        self.user = create_user(**PAYLOAD)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def create_post(self):
        content = ''.join(random.choice(string.ascii_letters) for i in range(10))
        return Posts.objects.create(user=self.user, content=content)

    def test_post_feed(self):
        for _ in range(7):
            self.create_post()

        res = self.client.get(POST_FEED_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('count', res.data)
        self.assertIn('next', res.data)
        self.assertIn('previous', res.data)
        self.assertTrue(res.data['results'], isinstance(res.data['results'], list))

    def test_create_post(self):
        res = self.client.post(POST_FEED_URL, {'content': 'Hello World'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['content'], 'Hello World')

    def test_post_vote(self):
        post = self.create_post()
        # TODO: need to handle post does not exist case in view
        res = self.client.post(POST_VOTE_URL, {'rating': 5})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        post = Posts.objects.get(pk=1)
        self.assertEqual(post.average_votes, 5)

    def test_post_comment(self):
        self.create_post()
        res = self.client.post(POST_COMMENT_URL, {'content': 'Hello World'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['content'], 'Hello World')
        self.assertEqual(res.data['user']['name'], 'jahidhadiu')

    def test_delete_comment(self):
        post = self.create_post()
        comment = PostCommentSerializer(data={'content': 'Hello World'})
        comment.is_valid()
        comment.save(post=post, user=self.user)
        res = self.client.delete(POST_COMMENT_URL)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        # TODO: need to handle total_comments when comment deleted. It should be decreased by 1 but it's not happening
        self.assertEqual(post.all_post_comments.count(), 0)

    def test_delete_post(self):
        self.create_post()
        res = self.client.delete(POST_DELETE_URL)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Posts.objects.count(), 0)




