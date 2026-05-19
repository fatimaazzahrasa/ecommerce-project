from django.db import models
from users.models import User # Importation du modèle User depuis l'application users
from products.models import Produit  # Importation du modèle Produit depuis l'application products

# ==================== PANIER ====================

class Panier(models.Model):
    # Chaque utilisateur a un seul panier, d'où l'utilisation de OneToOneField
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='panier'
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Panier {self.id} - {self.user.username}"


class LignePanier(models.Model):  
    panier = models.ForeignKey(
        Panier,
        on_delete=models.CASCADE,
        related_name='lignes'  # Renvoyé les lignes du panier par le panier (ex: mon_panier.lignes.all() pour avoir toutes les lignes de mon panier)
    )
    produit = models.ForeignKey(
        Produit,
        on_delete=models.CASCADE
    )
    quantite = models.PositiveIntegerField(default=1)  # Quantité par défaut à 1

    def __str__(self):
        return f"{self.produit.nom} ({self.quantite})"


# ==================== COMMANDE ====================

class Commande(models.Model):
    # Les statuts possibles pour une commande
    STATUT_CHOICES = (
        ('EN_ATTENTE', 'En attente de paiement'),
        ('PAYEE', 'Payée / En préparation'),
        ('EXPEDIEE', 'Expédiée / En livraison'),
        ('LIVREE', 'Livrée'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='commandes'
    )
    
    # Le prix total de la commande (calculé au moment de la validation de la commande)
    prix_total = models.DecimalField(
        max_digits=12,       
        decimal_places=2
    )
    
    statut = models.CharField(
        max_length=20,    
        choices=STATUT_CHOICES,
        default='EN_ATTENTE'
    )
    
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Commande {self.id} - {self.user.username} - {self.statut}"


class LigneCommande(models.Model):  # Chaque ligne de commande correspond à un produit commandé avec une quantité et un prix unitaire
    commande = models.ForeignKey(
        Commande,
        on_delete=models.CASCADE,
        related_name='lignes'
    )
    produit = models.ForeignKey(
        Produit,
        on_delete=models.CASCADE
    )
    quantite = models.PositiveIntegerField(default=1)
    
    # Le prix unitaire du produit au moment de la commande (pour garder une trace même si le prix du produit change par la suite)
    prix_unitaire = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    def __str__(self):
        return f"{self.produit.nom} ({self.quantite}) - {self.prix_unitaire} DH"