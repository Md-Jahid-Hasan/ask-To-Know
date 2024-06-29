from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_field):
        if not email:
            raise ValueError("User must have a email")
        user = self.model(email=self.normalize_email(email), **extra_field)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email instead of username.
    Use custom user manager instead of default manager to overwrite default behaviour"""

    USER_ROLE = (("user", "User"), ("agent", "Agent"), ("admin", "Admin"), ("content", "Content"))

    email = models.EmailField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=10, choices=USER_ROLE, default="user")
    phone_number = models.CharField(max_length=15)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return str(self.email)
