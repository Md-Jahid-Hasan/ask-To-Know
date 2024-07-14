import string, random

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view

from .serializers import (MyTokenObtainPairSerializer, UserCreateSerializer, UserDetailsSerializerForAdmin,
                          UserDetailsSerializerForUser, AgentCreateSerializer)
from django.contrib.auth import get_user_model as User


class LoginView(TokenObtainPairView):
    """Return access and refresh tokens for authorization."""
    serializer_class = MyTokenObtainPairSerializer


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system"""
    serializer_class = UserCreateSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({"success": True}, status=status.HTTP_201_CREATED)


class UpdateUserView(generics.UpdateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = User().objects.all()


class UpdateAdminStatus(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, *args, **kwargs):
        try:
            query_params = request.query_params.get("status")
            user = request.user
            user.admin_status = bool(int(query_params))
            user.save()
            return Response({"success": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        serializer = AgentCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)

        # error_message = {}
        # email = request.data.get("email")
        # if not email:
        #     error_message["email"] = "Email is required"
        # name = request.data.get("name")
        # if not name:
        #     error_message["name"] = "Name is required"
        # username = request.data.get("username")
        # if not username:
        #     error_message["username"] = "Username is required"
        # if email and name and username:
        #     generate_password = ''.join(random.choices(string.digits + string.ascii_letters, k=8))
        #     user = User().objects.create_user(name=name, email=email, password=generate_password, username=username)
        #
        # else:
        #     return Response(error_message, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUser(generics.RetrieveAPIView):
    """Return authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return UserDetailsSerializerForAdmin
        else:
            return UserDetailsSerializerForUser


@api_view(['GET'])
def check_username(request):
    username = request.query_params.get('username', None)
    try:
        User().objects.get(username=username)
    except ObjectDoesNotExist:
        return Response({"is_unique": True}, status=status.HTTP_200_OK)
    return Response({"is_unique": False}, status=status.HTTP_200_OK)
