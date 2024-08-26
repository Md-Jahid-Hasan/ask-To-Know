from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    message = 'You are not allowed to perform this action'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.user == request.user


class IsRoleAdmin(permissions.BasePermission):
    message = 'Your role need to be Admin to perform this action'

    def has_permission(self, request, view):
        return request.user.role == "admin"
