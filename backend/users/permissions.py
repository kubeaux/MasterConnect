from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminUserType(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == "administrateur"


class IsTeacherOrAdminReadOnlyOtherwise(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated
            and request.user.user_type in ["encadrant", "administrateur"]
        )


class IsStudentForOwnWishes(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.user_type == "etudiant"

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated and (
                request.user.user_type == "administrateur" or obj.student == request.user
            )
        return (
            request.user.is_authenticated
            and request.user.user_type == "etudiant"
            and obj.student == request.user
        )