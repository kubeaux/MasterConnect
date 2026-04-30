from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import UserSerializer
from .permissions import IsAdminUserType
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_supervisor(request):
    data = request.data
    required = ['username', 'email', 'password', 'first_name', 'last_name']
    missing = [f for f in required if not data.get(f)]
    if missing:
        return Response(
            {'error': f"Champs manquants: {', '.join(missing)}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(data['password']) < 8:
        return Response(
            {'error': 'Le mot de passe doit contenir au moins 8 caractères.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=data['username']).exists():
        return Response(
            {'error': "Un compte existe déjà avec cet email"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=data['email']).exists():
        return Response(
            {'error': "Un compte existe déjà avec cet email"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects.create_user(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        user_type='encadrant',
        departement=data.get('departement', ''),
        statut_validation='EN_ATTENTE',
        is_active=False
    )

    return Response({
        'message': 'Compte crée avec succès. En attente de validation.',
        'id': user.id
    }, status=status.HTTP_201_CREATED)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'name': self.user.first_name,  
            'role': self.user.user_type,
            'user_type': self.user.user_type,
        }
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUserType]

    @action(detail=False, methods=['get'])
    def pending_supervisors(self, request):
        pending = User.objects.filter(
            user_type='encadrant',
            statut_validation='EN_ATTENTE'
        ).order_by('-date_joined')
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        user = self.get_object()
        user.statut_validation = 'APPROUVE'
        user.is_active = True
        user.save(update_fields=['statut_validation', 'is_active'])
        return Response({'status': 'approved', 'id': user.id})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        user = self.get_object()
        user.statut_validation = 'REFUSE'
        user.is_active = False
        user.save(update_fields=['statut_validation', 'is_active'])
        return Response({'status': 'rejected', 'id': user.id})