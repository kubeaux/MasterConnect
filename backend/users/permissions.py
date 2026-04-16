from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminUserType(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == "admin"


class IsTeacherOrAdminReadOnlyOtherwise(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated
            and request.user.user_type in ["teacher", "admin"]
        )


class IsStudentForOwnWishes(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated

        return request.user.is_authenticated and request.user.user_type == "student"

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated and (
                request.user.user_type == "admin" or obj.student == request.user
            )

        return (
            request.user.is_authenticated
            and request.user.user_type == "student"
            and obj.student == request.user
        )