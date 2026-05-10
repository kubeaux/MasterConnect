from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, MyTokenObtainPairView, register_supervisor
from users.admin_views import admin_stats
from projects.views import ProjectViewSet
from wishes.views import WishViewSet
from assignments.views import AssignmentViewSet
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'wishes', WishViewSet)
router.register(r'assignments', AssignmentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/register-supervisor/', register_supervisor, name='register_supervisor'),
    path('api/admin/stats/', admin_stats, name='admin_stats'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]