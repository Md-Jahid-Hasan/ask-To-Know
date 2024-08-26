import string, random
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import get_user_model as User
from .tasks import send_agent_create_mail


class UserDetailsSerializerForUser(serializers.ModelSerializer):
    """Serializer for user details. Returns fields with username, email and is_staff."""
    class Meta:
        model = User()
        fields = ['name', 'email', 'is_staff', 'phone_number', 'role', 'id', 'username']


class UserDetailsSerializerForAdmin(serializers.ModelSerializer):
    """Serializer for user details. Returns fields with username, email and is_staff."""
    class Meta:
        model = User()
        fields = ['name', 'email', 'is_staff', 'phone_number', 'role', 'id', 'username', 'admin_status']


class UserNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User()
        fields = ['name']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer for the user token/login. As a login user will get a new token and user details by using
    UserDetailsSerializer."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['admin'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_staff:
            serializer = UserDetailsSerializerForAdmin(self.user).data
        else:
            serializer = UserDetailsSerializerForUser(self.user).data
        data['user'] = serializer
        # for k, v in serializer.items():
        #     data[k] = v

        return data


class UserCreateSerializer(serializers.ModelSerializer):
    """User create serializer use for both update and create. Receive data email, name, password and
    password1(same as password). Override validate method to check if both password are same."""
    confirm_password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User()
        fields = ['pk', 'name', 'email', 'password', 'confirm_password', 'phone_number', 'username']
        extra_kwargs = {
            'password': {'write_only': True},
            'pk': {'read_only': True}
        }

    def validate(self, attrs):
        if self.context['request'].method == "POST":
            if attrs['confirm_password'] != attrs['password']:
                raise serializers.ValidationError({'password': "Password Don't match"})
        else:
            if attrs.get('username'):
                attrs.pop('username')
        return attrs

    def create(self, validated_data):
        """Remove password1 field because this is not part of model"""
        validated_data.pop('confirm_password')
        return User().objects.create_user(**validated_data)


class AgentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User()
        fields = ('email', 'username', 'name')

    def create(self, validated_data):
        # TODO send email when agent created
        generate_password = ''.join(random.choices(string.digits + string.ascii_letters, k=8))
        user = User().objects.create_user(**validated_data, password=generate_password, is_staff=True, role="agent",
                                          admin_status=False)
        send_agent_create_mail.delay(user.username, user.email, generate_password)
        return user
