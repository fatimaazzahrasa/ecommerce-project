from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Panier, LignePanier, Commande, LigneCommande
from .serializers import PanierSerializer, CommandeSerializer

class CommandeViewSet(viewsets.ModelViewSet):
    queryset = Commande.objects.all()
    serializer_class = CommandeSerializer
    permission_classes = [IsAuthenticated] # 🚨 ضروري يكون مسجل الدخول بـ JWT

    # كايجيب فقط الطلبيات ديال المستخدم اللي صيفط الطلب
    def get_queryset(self):
        return Commande.objects.filter(user=self.request.user)

    # 🚀 هادي هي الدالة السحرية لي غاتربط ليكم الفرونتند ف دقيقة
    def create(self, request, *args, **kwargs):
        user = request.user
        
        # 1. جيب الكروسة (Panier) ديال هاد الكليان
        try:
            panier = Panier.objects.get(user=user)
        except Panier.DoesNotExist:
            return Response({"error": "Panier introuvable"}, status=status.HTTP_404_NOT_FOUND)
            
        lignes_panier = panier.lignes.all()
        if not lignes_panier:
            return Response({"error": "Le panier est vide"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. حساب المجموع الكلي
        total = sum(ligne.produit.prix * ligne.quantite for ligne in lignes_panier)

        # 3. صاوب الطلبية (Commande)
        commande = Commande.objects.create(
            user=user,
            prix_total=total,
            statut='EN_ATTENTE'
        )

        # 4. حول السلعة من الكروسة لـ تفاصيل الطلب (LigneCommande)
        for ligne in lignes_panier:
            LigneCommande.objects.create(
                commande=commande,
                produit=ligne.produit,
                quantite=ligne.quantite,
                prix_unitaire=ligne.produit.prix # كايحفظ الثمن د دابا
            )
            
        # 5. خوي الكروسة حيت صافي تشرات السلعة
        lignes_panier.delete()

        serializer = self.get_serializer(commande)
        return Response(serializer.data, status=status.HTTP_201_CREATED)