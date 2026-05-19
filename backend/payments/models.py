from django.db import models
from orders.models import Commande


class Paiement(models.Model):

    STATUT_CHOICES = (
        ('EN_ATTENTE', 'En attente'),
        ('REUSSI', 'Réussi'),
        ('ECHOUE', 'Échoué'),
    )

    commande = models.OneToOneField(
        Commande,
        on_delete=models.CASCADE,
        related_name='paiement'
    )

    stripe_payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    montant = models.DecimalField(
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
        return f"Paiement {self.id} - {self.statut}"   
