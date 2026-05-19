import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Clock,
  CheckCircle2,
  Truck,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchOrdersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('TOUTES');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // جلب الطلبات بناءً على معرف المستخدم ودوره من الـ API
          const fetched = await fetchOrdersApi(user.id || user._id, user.role);
          setOrders(Array.isArray(fetched) ? fetched : []);
        } catch (error) {
          console.error("Erreur lors du chargement des commandes:", error);
          setOrders([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadOrders();
  }, [user]);

  // خريطة الحالات المتوافقة مع الباكيند
  const STATUT_MAP = {
    'EN PRÉPARATION': { label: 'En préparation', styles: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    'EXPÉDIÉE': { label: 'Expédiée', styles: 'bg-blue-50 text-blue-700 border-blue-200', icon: Truck },
    'LIVRÉE': { label: 'Livrée', styles: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
    'ANNULÉE': { label: 'Annulée', styles: 'bg-red-50 text-red-700 border-red-200', icon: ShoppingBag }
  };

  const getStatusInfo = (status) => {
    const s = (status || '').toUpperCase();
    return STATUT_MAP[s] || { label: status || 'En cours', styles: 'bg-surface-container text-on-surface-variant border-outline-variant', icon: Clock };
  };

  // تصفية الطلبات بناءً على الـ Tab المختار ونظام البحث الذكي
  const filteredOrders = orders.filter(order => {
    const orderId = String(order?.id || '').toLowerCase();
    const matchesTab = activeTab === 'TOUTES' || (order?.statut && order.statut.toUpperCase() === activeTab);
    
    // البحث برقم الطلب أو اسم المنتج الأول المتوفر في الطلبية لمرونة أكبر
    const firstItemName = String(order?.lignes?.[0]?.produit_details?.nom || '').toLowerCase();
    const matchesSearch = orderId.includes(searchQuery.toLowerCase()) || firstItemName.includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        
        {/* En-tête / الهيدر */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="w-12 h-12 rounded-2xl bg-white border border-outline-variant flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-all active:scale-90 cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-manrope text-3xl md:text-5xl font-black text-on-surface tracking-tighter">Mes Commandes</h1>
              <p className="text-on-surface-variant font-medium text-lg mt-1">Suivez l'état de vos acquisitions artisanales en temps réel.</p>
            </div>
          </div>
          
          <div className="bg-primary/5 px-6 py-3 rounded-full border border-primary/10 flex items-center gap-4 shadow-sm高级">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-container overflow-hidden p-0.5">
                  <img src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-full h-full rounded-full" alt="Avatar Client" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Rejoignez 5k+ Clients</span>
          </div>
        </header>

        {/* Filtres & Recherche / البحث والفلاتر */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
            <input 
              className="w-full pl-16 pr-6 py-5 border-2 border-outline-variant rounded-[1.5rem] bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-lg placeholder:opacity-50" 
              placeholder="Rechercher par numéro ou produit..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 scrollbar-hide px-2">
            {['TOUTES', 'EN PRÉPARATION', 'EXPÉDIÉE', 'LIVRÉE'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all shadow-sm cursor-pointer",
                  activeTab === tab 
                    ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-105" 
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant border border-outline-variant/30"
                )}
              >
                {tab === 'TOUTES' ? 'Toutes' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* قائمة الطلبيات الفعليّة */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-outline-variant rounded-[3rem] bg-surface-container-low/30 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full border-4 border-outline-variant border-t-primary animate-spin" />
              <p className="font-black text-on-surface-variant uppercase tracking-widest text-[10px]">Actualisation de l'historique...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center gap-8 bg-white border border-outline-variant rounded-[3rem] shadow-sm">
              <div className="w-32 h-32 bg-surface-container rounded-full flex items-center justify-center border border-outline-variant shadow-inner">
                <ShoppingBag className="w-12 h-12 text-outline" />
              </div>
              <div className="max-w-sm">
                <h3 className="font-manrope text-3xl font-black text-on-surface tracking-tight">Aucune commande</h3>
                <p className="text-on-surface-variant mt-4 font-medium text-lg leading-relaxed">
                  Vous n'avez pas encore passé de commande. Explorez notre catalogue pour découvrir des pièces uniques.
                </p>
              </div>
              <button 
                onClick={() => navigate('/catalog')}
                className="px-12 py-5 bg-primary text-white rounded-2xl font-black font-manrope text-lg shadow-2xl shadow-primary/30 hover:translate-y-[-4px] active:scale-95 transition-all cursor-pointer"
              >
                Commencer mes achats
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const totalAmount = order?.prix_total ? Number(order.prix_total) : 0;
              return (
                <div 
                  key={order.id} 
                  className="bg-white border border-outline-variant rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-surface-container transition-all group flex flex-col lg:flex-row lg:items-center justify-between gap-10 shadow-sm overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform" />

                  <div className="flex items-start sm:items-center gap-8">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-surface-container rounded-[2rem] overflow-hidden flex-shrink-0 border-2 border-outline-variant shadow-sm p-1 group-hover:rotate-2 transition-transform">
                      <img 
                        className="w-full h-full object-cover rounded-[1.5rem]" 
                        src={order?.lignes?.[0]?.produit_details?.image || `https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200`}
                        alt={`Commande ${order.id}`}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-manrope text-xl sm:text-2xl font-black text-on-surface tracking-tighter">N° {order.id}</span>
                        <span className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border", 
                          getStatusInfo(order.statut).styles
                        )}>
                          {React.createElement(getStatusInfo(order.statut).icon, { className: "w-3 h-3" })}
                          {getStatusInfo(order.statut).label}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                         <p className="text-xs font-bold text-on-surface-variant flex items-center gap-2">
                           <Clock className="w-4 h-4 opacity-50" />
                           Commandée le <span className="text-on-surface">{order.date_creation ? new Date(order.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récente'}</span>
                         </p>
                         <p className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                           Artisan local certifié
                         </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:items-end gap-5 border-t lg:border-t-0 border-outline-variant pt-8 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] font-black text-outline uppercase tracking-widest block mb-1">Montant Total</span>
                      <p className="font-manrope text-4xl font-black text-on-surface tracking-tighter">
                        {totalAmount.toLocaleString('fr-MA')} <span className="text-sm">DH</span>
                      </p>
                    </div>
                    <button className="bg-surface border-2 border-outline text-on-surface px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 cursor-pointer">
                      Voir les Détails
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default OrdersPage;