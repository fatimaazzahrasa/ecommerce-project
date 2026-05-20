from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # هاد السطر كيجمع اللوڭين والرجستر والبروفايل تحت طريق وحدة
    path('api/users/', include('users.urls')),

    path('api/products/', include('products.urls')), 

    path('api/payments/', include('payments.urls')),

    
]