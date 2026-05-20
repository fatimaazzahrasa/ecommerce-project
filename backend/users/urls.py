from django.urls import path
from .views import CustomTokenObtainPairView, RegisterView, UserProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Route pour l'inscription : /api/users/register/
    path('register/', RegisterView.as_view(), name='register'),
    
    # Route pour la connexion (Login) : /api/users/login/
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Route pour rafraîchir le token JWT : /api/users/token/refresh/
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Route pour le profil de l'utilisateur connecté : /api/users/profile/
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]