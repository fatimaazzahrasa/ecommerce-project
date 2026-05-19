from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    ROLE_CHOICES = (
        ('CLIENT', 'Client'),
        ('ARTISAN', 'Artisan'),
        ('ADMIN', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CLIENT')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class Artisan(models.Model):
    STATUS_CHOICES = (
        ('EN_ATTENTE', 'En attente'),
        ('VALIDE', 'Validé'),
        ('REFUSE', 'Refusé'),
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='artisan_profile'
    )

    nom_boutique = models.CharField(max_length=255)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='EN_ATTENTE'
    )

    def __str__(self):
        return self.nom_boutique



