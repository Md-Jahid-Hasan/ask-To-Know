from django.urls import path
from .views import LoginView, CreateUserView, CurrentUser, UpdateUserView, check_username

app_name = 'users'

urlpatterns = [
    path('', CurrentUser.as_view(), name='me'),
    path('login/', LoginView.as_view(), name='login'),
    path('create/', CreateUserView.as_view(), name='create'),
    path('update/<int:pk>/', UpdateUserView.as_view(), name='update'),
    path('username/', check_username, name='username_check')
]