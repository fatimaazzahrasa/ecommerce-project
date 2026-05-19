from rest_framework import serializers
from .models import Categorie, Produit



class CategorieSerializer(serializers.ModelSerializer):

    class Meta:
        model = Categorie
        fields = '__all__'


class ProduitSerializer(serializers.ModelSerializer):
    # Nous voulons afficher le nom de la catégorie au lieu de son ID
    categorie_name = serializers.CharField(source='categorie.nom', read_only=True)       
    
    # Nous voulons aussi afficher le nom de l'artisan (le nom d'utilisateur de l'utilisateur lié à l'artisan)
    artisan_name = serializers.CharField(source='artisan.user.username', read_only=True)

    class Meta:
        model = Produit
        fields = [
            'id', 'categorie', 'categorie_name', 'artisan', 'artisan_name', 
            'nom', 'description', 'prix', 'stock', 'image', 'date_creation'
        ]