from rest_framework import serializers
from .models import Paiement

class PaiementSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='commande.user.id', read_only=True)

    class Meta:
        model = Paiement
        fields = ['id', 'commande', 'user_id', 'stripe_payment_id', 'montant', 'statut', 'date_creation']
        read_only_fields = ['id', 'stripe_payment_id', 'user_id', 'date_creation']