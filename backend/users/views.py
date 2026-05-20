from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, MyTokenObtainPairSerializer

User = get_user_model()

# 1`pour la connexion (Login) utilizando JWT
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer   


# 2️⃣ inscription à un nouveau compte (Register)
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]  # permer pour tout le monde de s'inscrire, même les non-authentifiés

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # token pour le nouvel utilisateur créé
            refresh = RefreshToken.for_user(user)
            
            # 🎯 هنا تـصلح السطر: صيفطنا الـ context وسط الـ Serializer نيشان بطريقة صحيحة
            user_data = UserSerializer(user, context={'request': request}).data
            
            return Response({
                "user": user_data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "detail": "Compte créé avec succès !"
            }, status=status.HTTP_201_CREATED)
        print(serializer.errors)   
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 3️⃣ le profil utilisateur (UserProfile)
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # obligatoire d'être connecté pour accéder à cette vue

    # GET:permet de récupérer les informations de l'utilisateur connecté
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # PUT: permet de mettre à jour les informations de l'utilisateur connecté
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)