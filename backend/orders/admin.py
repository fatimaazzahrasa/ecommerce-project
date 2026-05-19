from django.contrib import admin
from .models import Panier, LignePanier, Commande, LigneCommande

admin.site.register(Panier)
admin.site.register(LignePanier)
admin.site.register(Commande)
admin.site.register(LigneCommande)
