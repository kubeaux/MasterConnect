from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Import de tes vues (Note l'ajout de MyTokenObtainPairView)
from users.views import UserViewSet, MyTokenObtainPairView
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
    
    # Utilisation de la vue personnalisée pour le login
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]