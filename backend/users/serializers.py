from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import Artisan



User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'password']
        extra_kwargs = {
            'password': {'write_only': True}  # le mot de passe est seulement écrit, pas lu
        }

    # la méthode create est appelée quand on fait serializer.save() dans la view de Register
    def create(self, validated_data):

        allowed_roles = ['client', 'artisan']

        role = validated_data.get('role', 'client')

        if role not in allowed_roles:
            raise serializers.ValidationError({
                'role': 'Role invalide'
            })

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=role,
            password=validated_data['password']
        )

        return user

# Serializer pour la connexion (Login)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'name': self.user.username,
            'email': self.user.email,
            'role': self.user.role,  # on ajoute le rôle de l'utilisateur dans la réponse du token
        }
        return data

class ArtisanSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Artisan
        fields = ['id', 'user', 'user_details', 'nom_boutique', 'description', 'adresse', 'telephone']