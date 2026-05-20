from rest_framework import serializers
from .models import Panier, LignePanier, Commande, LigneCommande
from products.serializers import ProduitSerializer

# ==========================================
# Serializers de Panier
# ==========================================        
class LignePanierSerializer(serializers.ModelSerializer):
    produit_details = ProduitSerializer(source='produit', read_only=True)   
    total_ligne = serializers.SerializerMethodField()

    class Meta:
        model = LignePanier
        fields = ['id', 'panier', 'produit', 'produit_details', 'quantite', 'total_ligne']

    def get_total_ligne(self, obj):
        return obj.produit.prix * obj.quantite


class PanierSerializer(serializers.ModelSerializer):
    lignes = LignePanierSerializer(many=True, read_only=True, source='lignes')  
    total_panier = serializers.SerializerMethodField()

    class Meta:
        model = Panier
        fields = ['id', 'user', 'lignes', 'total_panier']

    def get_total_panier(self, obj):
        return sum(ligne.produit.prix * ligne.quantite for ligne in obj.lignes.all())


# ==========================================
# Serializers de Commande
# ==========================================

class LigneCommandeSerializer(serializers.ModelSerializer):
    produit_details = ProduitSerializer(source='produit', read_only=True)

    class Meta:
        model = LigneCommande
        fields = ['id', 'commande', 'produit', 'produit_details', 'quantite', 'prix_unitaire']
        extra_kwargs = {'prix_unitaire': {'read_only': True}}

class CommandeSerializer(serializers.ModelSerializer):
    lignes = LigneCommandeSerializer(many=True, read_only=True, source='lignes')

    class Meta:
        model = Commande
        fields = ['id', 'user', 'lignes', 'prix_total', 'statut', 'date_creation']
        read_only_fields = ['user', 'prix_total', 'statut', 'date_creation']