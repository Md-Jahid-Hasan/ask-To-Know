from django.contrib.auth import get_user_model as User
from django.db.models import Q

class UserRepository:

    @staticmethod
    def check_user_exists(user_id):
        """
        :param user_id: user id for lookup
        :return: bool
        """
        query = Q()
        for user in user_id:
            query |= Q(id=user)

        available_users = list(User().objects.filter(query).values_list('id', flat=True))
        return all([True if user in available_users else False for user in user_id])
