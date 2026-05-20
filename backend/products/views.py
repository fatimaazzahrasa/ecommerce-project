from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Categorie, Produit
from .serializers import CategorieSerializer, ProduitSerializer

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [permissions.AllowAny]  # كولشي يقدر يشوف الـ Categories


class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all().order_by('-date_creation')
    serializer_class = ProduitSerializer
    
    # 🖼️ هاد الـ Parsers ضروريين باش ديانغو يقبل يـستقبل الـتصاور (Files) من الـ Frontend
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        """
        - أي واحد (Client أو زائر) يقدر يشوف المنتجات (GET).
        - غير الـ Artisans لّي مسجلين لّي يقدروا يزيدو، يعدلو، أو يمسحو.
        """
        if self.request.method in permissions.SAFE_METHODS: # GET, HEAD, OPTIONS
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()] # خاصو يكون مسجل (Artisan)

    def perform_create(self, serializer):
        """
        ملي الـ Artisan يـكليكي على Ajouter:
        ديانغو غايمشي ياخد الـ Artisan لّي مرتبط بالـ User لّي مكونيكطي دابا ويسجلو تلقائياً.
        """
        # كايجيب الـ Artisan لّي تابع للـ User الحالي
        artisan_profile = self.request.user.artisan_profile # تأكدي من الـ related_name لّي عندك ف الـ User/Artisan model
        serializer.save(artisan=artisan_profile)

