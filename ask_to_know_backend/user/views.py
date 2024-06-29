from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view

from .serializers import MyTokenObtainPairSerializer, UserCreateSerializer, UserDetailsSerializer
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
            print(e)
            return Response({"success": False}, status=status.HTTP_400_BAD_REQUEST)


class CurrentUser(generics.RetrieveAPIView):
    """Return authenticated user."""
    serializer_class = UserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


@api_view(['GET'])
def check_username(request):
    username = request.query_params.get('username', None)
    try:
        User().objects.get(username=username)
    except ObjectDoesNotExist:
        return Response({"is_unique": True}, status=status.HTTP_200_OK)
    return Response({"is_unique": False}, status=status.HTTP_200_OK)
