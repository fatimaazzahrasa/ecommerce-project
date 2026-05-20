from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommandeViewSet # تأكدي أن الـ ViewSet كاين ف views.py

router = DefaultRouter()
# هاد الرابط هو اللي غاتعيط ليه صاحبتك ف الفرونتند: /api/orders/
router.register(r'orders', CommandeViewSet, basename='commande')

urlpatterns = [
    path('', include(router.urls)),
]