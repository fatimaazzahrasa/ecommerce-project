from django.db import models
from users.models import Artisan  # Importation du modèle Artisan depuis l'application users


class Categorie(models.Model):
    nom = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True) # description optionnelle pour la catégorie

    def __str__(self):
        return self.nom


class Produit(models.Model):
    artisan = models.ForeignKey(
        Artisan,
        on_delete=models.CASCADE,
        related_name='produit'  # Renvoyé les produits par l'artisan
    )
    
    # 🚨 هنا كان الغلط رجعناها 'categorie' بالمفرد باش طابق الكلاس الفوق
    categorie = models.ForeignKey(
        Categorie,
        on_delete=models.CASCADE,
        related_name='produit'
    )
    
    nom = models.CharField(max_length=255)
    description = models.TextField()
    
    # le prix en dirhams (par exemple 9999.99)
    prix = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    
    stock = models.PositiveIntegerField(default=0)
    
    # ici nous utilisons le système de médias de Django: les fichiers seront stockés dans le répertoire media/produits/
    image = models.ImageField(
        upload_to='produit/',
        blank=True,
        null=True
    )
    
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom