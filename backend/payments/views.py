import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse

from orders.models import Commande
from .models import Paiement
from .serializers import PaiementSerializer

# 🔑 حطي المفتاح السري ديال Stripe ف ملف settings.py أو ديريه هنا ديريكت
stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', 'sk_test_your_secret_key_here')
endpoint_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', 'whsec_your_webhook_secret_here')

class CreateCheckoutSessionView(APIView):
    """
    هاد الـ View كاتـاخد الـ Commande ID وتـكريي رابط الأداء ديال Stripe
    """
    def post(self, request, *args, **kwargs):
        commande_id = request.data.get('commande_id')
        
        if not commande_id:
            return Response({"error": "commande_id est obligatoire"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 1. جلب الطلب
            commande = Commande.objects.get(id=commande_id)
            
            # 2. حساب المبلغ (Stripe كيتسنى السنتيمات، داكشي علاش كنضربو ف 100)
            amount_in_cents = int(commande.total * 100)  # أو commande.montant على حسب شنو سميتو ف الطلب
            
            # 3. إنشاء Session ف Stripe
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'mad',  # بالدرهم المغربي
                        'product_data': {
                            'name': f"Commande N° {commande.id}",
                        },
                        'unit_amount': amount_in_cents,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                # الروابط فين يرجع المستخدم ملي ينجح أو يفشل الأداء ف الـ Frontend
                success_url='http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:5173/payment-cancel',
                metadata={
                    'commande_id': commande.id
                }
            )
            
            # 4. تسجيل عملية الأداء ف الـ Database بـ حالة "EN_ATTENTE"
            Paiement.objects.update_or_create(
                commande=commande,
                defaults={
                    'montant': commande.total, # أو commande.montant
                    'stripe_payment_id': checkout_session.id,
                    'statut': 'EN_ATTENTE'
                }
            )
            
            # 5. صيفط رابط الأداء للـ Frontend باش يدوز لصفحة Stripe
            return Response({"url": checkout_session.url}, status=status.HTTP_200_OK)
            
        except Commande.DoesNotExist:
            return Response({"error": "Commande introuvable"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StripeWebhookView(APIView):
    """
    هاد الـ View كايـعيط ليها Stripe تلقائياً ملي كايتخلص الطلب بنجاح ف السيرفر ديالهم
    """
    permission_classes = [] # ضروري خاوي حيت Stripe هو لّي كايـهضر مع هاد الـ URL
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            return HttpResponse(status=400)

        # 🔄 ملي ينجح الأداء ف Stripe
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            commande_id = session['metadata'].get('commande_id')
            
            if commande_id:
                try:
                    paiement = Paiement.objects.get(commande_id=commande_id)
                    paiement.statut = 'REUSSI'
                    paiement.stripe_payment_id = session.get('payment_intent')
                    paiement.save()
                    
                    # هنا تقدري تبدلي حتى الـ statut ديال الـ Commande لـ "Payée" إيلا بغيتي
                    # commande = paiement.commande
                    # commande.statut = 'PAYEE'
                    # commande.save()
                    
                except Paiement.DoesNotExist:
                    pass

        return HttpResponse(status=200)
