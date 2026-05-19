import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  Lock, 
  HelpCircle,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate, Link } from 'react-router-dom';
import { createPaymentIntentApi } from '../services/api';

// 💳 استيراد مكونات Stripe الحقيقية
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutPage = () => {
  const { articles, sousTotal, passerCommande, estEnCoursDeTraitement: isCartProcessing } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const stripe = useStripe();
  const elements = useElements();
  
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 🪙 الحسابات المالية (الشحن مجاني متوافق مع المجموع بالأسفل)
  const tva = sousTotal * 0.20;
  const fraisLivraison = 0; // تم تعديلها إلى 0 لتتوافق مع كلمة "Gratuite" بالأسفل
  const total = sousTotal + tva + fraisLivraison;

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    
    if (!user) {
      setError('Veuillez vous connecter pour passer une commande.');
      navigate('/login');
      return;
    }

    if (!stripe || !elements) {
      setError('Stripe n\'est pas encore chargé. Veuillez patienter.');
      return;
    }
    
    setIsProcessing(true);
    setError('');

    try {
      // 1. إنشاء Intention de paiement عبر Django API
      const response = await createPaymentIntentApi(total);
      const clientSecret = response.clientSecret;

      if (!clientSecret) {
        throw new Error('Impossible de récupérer le jeton de paiement sécurisé.');
      }
      
      // 获取 CardElement المكون الحقيقي للبطاقة
      const cardElement = elements.getElement(CardElement);

      // 2. تأكيد الدفع الحقيقي والمباشر مع خوادم Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.nom || user.username || 'Client Local',
            email: user.email,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Le paiement a échoué');
      }

      // 3. عند نجاح الدفع، نرسل البيانات لـ Django لحفظ الطلب وتفريغ السلة
      if (result.paymentIntent.status === 'succeeded') {
        await passerCommande({
          user: user,
          paymentIntentId: result.paymentIntent.id,
          total: total
        });
        navigate('/orders');
      }
      
    } catch (err) {
      setError(err.message || 'Échec du placement de la commande. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
      {error && (
        <div className="max-w-3xl mx-auto mb-8 p-5 bg-red-50 border border-red-200 rounded-3xl text-red-700 text-sm font-bold flex items-center gap-4">
          <HelpCircle className="w-6 h-6 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Étapes de progression */}
      <div className="max-w-3xl mx-auto mb-20 px-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-surface-container-highest -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-0 w-2/3 h-[3px] bg-primary -translate-y-1/2 z-0" />
          
          {[
            { icon: Truck, label: 'Livraison', active: true },
            { icon: CreditCard, label: 'Paiement', active: true },
            { icon: CheckCircle2, label: 'Confirmation', active: false }
          ].map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                step.active ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-110" : "bg-white text-outline border-2 border-outline-variant"
              )}>
                <step.icon className="w-7 h-7" />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em]",
                step.active ? "text-primary" : "text-outline"
              )}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-8 space-y-12">
          {/* Section Livraison */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-outline-variant shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-manrope text-2xl font-black text-on-surface flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                Adresse de Livraison
              </h2>
              <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full transition-all cursor-pointer">Modifier</button>
            </div>
            
            <div className="p-8 rounded-3xl bg-surface-container-low/50 border border-outline-variant/50 relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
               <div className="space-y-2">
                 <p className="text-xl font-black text-on-surface">{user?.nom || user?.username || 'Client Local'}</p>
                 <p className="text-on-surface-variant font-medium text-lg">482 Rue des Artisans, Studio 12</p>
                 <p className="text-on-surface-variant font-medium">Casablanca, 20250</p>
                 <p className="text-on-surface-variant font-black uppercase tracking-widest text-xs pt-2">Maroc</p>
               </div>
            </div>
          </section>

          {/* Section Paiement Stripe */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-outline-variant shadow-sm">
            <h2 className="font-manrope text-2xl font-black text-on-surface mb-10 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="w-5 h-5" />
              </div>
              Paiement Sécurisé
            </h2>

            <div className="space-y-8">
              <div className="p-8 bg-surface border-2 border-primary rounded-[2rem] shadow-inner shadow-primary/5">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-black text-on-surface uppercase tracking-[0.2em] opacity-60">CARTE BANCAIRE (STRIPE)</span>
                  <div className="flex gap-3">
                    <div className="w-10 h-6 bg-white rounded-md border border-outline-variant flex items-center justify-center text-[8px] font-black tracking-tighter">VISA</div>
                    <div className="w-10 h-6 bg-white rounded-md border border-outline-variant flex items-center justify-center text-[8px] font-black tracking-tighter">MASTERCARD</div>
                  </div>
                </div>
                
                {/* 💳 حقل إدخال البطاقة الحقيقي من Stripe */}
                <div className="min-h-[80px] bg-white p-5 rounded-2xl border border-outline-variant focus-within:border-primary transition-all flex flex-col justify-center">
                  <CardElement 
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#1C1B1F',
                          '::placeholder': { color: '#79747E' },
                          fontFamily: 'Manrope, sans-serif',
                        },
                        invalid: { color: '#B3261E' },
                      },
                    }} 
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-secondary/5 border border-secondary/20 rounded-3xl">
                <Info className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-on-surface-variant font-bold leading-relaxed">
                  Vos informations bancaires sont cryptées et ne transitent jamais par nos serveurs. Toutes les transactions sont traitées par l'infrastructure sécurisée de Stripe Inc.
                </p>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-5 p-8 bg-surface-container-low rounded-3xl border border-outline-variant/30">
              <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
              <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant leading-relaxed">
                Transaction protégée par un cryptage SSL 256 bits conforme aux normes bancaires internationales.
              </p>
            </div>
          </section>
        </div>

        {/* Sommaire Latéral */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-outline-variant sticky top-28 shadow-2xl shadow-surface-container-highest">
            <h2 className="font-manrope text-2xl font-black text-on-surface mb-8 tracking-tighter text-center">Votre Commande</h2>
            
            <div className="space-y-4 mb-10 overflow-y-auto max-h-[350px] px-2">
              {articles.map(item => {
                const itemId = item.id || item._id;
                return (
                  <div key={itemId} className="flex gap-5 group items-center">
                    <div className="w-20 h-20 bg-surface-container rounded-2xl overflow-hidden flex-shrink-0 border border-outline-variant p-0.5 group-hover:scale-105 transition-transform">
                      <img src={item.image} className="w-full h-full object-cover rounded-xl" alt={item.nom} />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <p className="font-black text-sm text-on-surface line-clamp-1 leading-tight mb-1">{item.nom}</p>
                      <p className="text-[10px] font-black text-outline uppercase tracking-wider">Quantité: {item.quantite}</p>
                      <p className="font-manrope font-black text-primary mt-1">{(item.prix * item.quantite).toLocaleString('fr-MA')} DH</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 border-t-2 border-outline-variant/30 pt-8 mb-8 font-manrope">
              <div className="flex justify-between text-sm font-bold text-on-surface-variant">
                <span className="uppercase tracking-widest opacity-60">Sous-total</span>
                <span className="font-black text-on-surface">{sousTotal.toLocaleString('fr-MA')} DH</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-on-surface-variant">
                <span className="uppercase tracking-widest opacity-60">Livraison</span>
                <span className="text-secondary font-black uppercase tracking-widest">Gratuite</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-on-surface-variant">
                <span className="uppercase tracking-widest opacity-60">TVA (20%)</span>
                <span className="font-black text-on-surface">{tva.toLocaleString('fr-MA')} DH</span>
              </div>
            </div>

            <div className="flex justify-between items-center font-manrope text-3xl font-black text-on-surface py-8 border-y-2 border-outline-variant/30 mb-8 tracking-tighter">
              <span>TOTAL</span>
              <span className="text-primary">{total.toLocaleString('fr-MA')} DH</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing || isCartProcessing || articles.length === 0}
              className="w-full py-6 bg-primary text-white rounded-[1.5rem] font-manrope font-black text-xl shadow-2xl shadow-primary/30 hover:translate-y-[-4px] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isProcessing || isCartProcessing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  Payer {total.toLocaleString('fr-MA')} DH
                  <Lock className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
            <p className="text-[10px] font-bold text-center text-on-surface-variant mt-8 uppercase tracking-widest leading-relaxed opacity-60">
              En confirmant, vous acceptez nos <br/><Link to="#" className="underline hover:text-primary transition-colors">Conditions Générales de Vente</Link>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;