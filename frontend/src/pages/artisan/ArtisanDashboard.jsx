import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Package, 
  ShoppingBasket, 
  Plus, 
  Brush, 
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchProductsApi, fetchOrdersApi } from '../../services/api';

const MotionLink = motion(Link);

const ArtisanDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [allProducts, artisanOrders] = await Promise.all([
          fetchProductsApi(),
          fetchOrdersApi(user.id, user.role)
        ]);
        
        setProducts(allProducts.filter(p => p.artisan_id === user.id));
        setOrders(artisanOrders);
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.prix_total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.statut !== 'Livrée' && o.statut !== 'Annulée').length;
  const productsCount = products.length;

  const stats = [
    { label: 'Revenu Total', value: `${totalRevenue.toLocaleString('fr-MA')} DH`, growth: '+12.5%', icon: CreditCard, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Commandes Actives', value: activeOrdersCount.toString(), growth: orders.length > 0 ? `+${orders.length}` : '0', icon: ShoppingBasket, color: 'text-[#003974]', bgColor: 'bg-[#003974]/5' },
    { label: 'Total Produits', value: productsCount.toString(), icon: Package, color: 'text-[#695d46]', bgColor: 'bg-[#f2e0c3]/40' },
  ];

  const STATUT_MAP = {
    'EN PRÉPARATION': { label: 'En préparation', styles: 'border-amber-200 bg-amber-50 text-amber-700' },
    'EXPÉDIÉE': { label: 'Expédiée', styles: 'border-sky-200 bg-sky-50 text-sky-700' },
    'LIVRÉE': { label: 'Livrée', styles: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
    'ANNULÉE': { label: 'Annulée', styles: 'border-rose-200 bg-rose-50 text-rose-700' }
  };

  const getStatusStyles = (status) => {
    if (!status) return 'border-gray-200 bg-gray-50 text-gray-600';
    const s = status.toUpperCase();
    return STATUT_MAP[s]?.styles || 'border-gray-200 bg-gray-50 text-gray-600';
  };

  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order.id,
    customer: order.client_nom || 'Client MarocArtisan',
    date: order.date_creation ? new Date(order.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Date inconnue',
    amount: `${(order.prix_total || 0).toLocaleString('fr-MA')} DH`,
    status: STATUT_MAP[order.statut?.toUpperCase()]?.label || order.statut || 'Inconnu',
    statusColor: getStatusStyles(order.statut)
  }));

  // ⏳ حالة التحميل الأنيقة أثناء جلب البيانات
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[#003974]">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#695d46]">Chargement de l'atelier...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 px-2">
      
      {/* 👤 ترويسة الترحيب والأزرار */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-[#c2c6d3] pb-8">
        <div>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#003974] font-bold tracking-tight">
            Heureux de vous revoir, {user?.nom?.split(' ')[0] || 'Artisan'} !
          </h2>
          <p className="text-[#424751] font-['Inter'] text-sm mt-1">
            Voici l'activité et le statut de votre atelier aujourd'hui.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none border border-[#727782] text-[#1a1c1b] px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white bg-white/40 transition-all cursor-pointer">
            Rapport Mensuel
          </button>
          <Link 
            to="/artisan/products/new" 
            className="flex-1 lg:flex-none bg-[#003974] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md shadow-[#003974]/10"
          >
            <Plus className="w-4 h-4" />
            Ajouter un Article
          </Link>
        </div>
      </div>

      {/* 📊 بطاقات الإحصائيات (Stats Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <MotionLink 
            to={stat.label === 'Total Produits' ? "/artisan/products" : "/artisan/orders"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={stat.label} 
            className="bg-white p-6 rounded-2xl border border-[#c2c6d3] group hover:border-[#003974] transition-all shadow-sm block relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {stat.growth && orders.length > 0 && (
                <span className="flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full tracking-wider uppercase">
                  <TrendingUp className="w-3 h-3" />
                  {stat.growth}
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-[#695d46] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="font-['Playfair_Display'] text-2xl font-black text-[#1a1c1b] tracking-tight group-hover:text-[#003974] transition-colors">
              {stat.value}
            </p>
          </MotionLink>
        ))}
      </div>

      {/* 📦 الطلبات الأخيرة والنصائح */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* جدول الطلبات الأخيرة */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#c2c6d3] overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-[#c2c6d3] flex justify-between items-center bg-[#f4f4f2]/40">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1c1b]">Commandes Récentes</h3>
              <Link to="/artisan/orders" className="text-[10px] font-bold text-[#003974] hover:underline uppercase tracking-widest flex items-center gap-1 group">
                Tout voir <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c2c6d3]/60 bg-[#f4f4f2]/20 text-[9px] font-bold text-[#695d46] uppercase tracking-widest">
                    <th className="px-6 py-4">Référence</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Montant</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c2c6d3]/40 font-['Inter']">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-sm text-[#424751] italic">
                        Aucune commande enregistrée pour le moment.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f9f9f7] transition-colors group">
                        <td className="px-6 py-5 text-xs font-bold text-[#003974] uppercase tracking-wider">#{order.id.slice(-6)}</td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-[#1a1c1b] tracking-tight">{order.customer}</p>
                          <p className="text-[10px] text-[#424751] mt-0.5">{order.date}</p>
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-[#1a1c1b]">{order.amount}</td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link 
                            to={`/artisan/orders/${order.id}`}
                            className="inline-flex p-2 bg-[#f4f4f2] rounded-lg text-[#424751] group-hover:text-white group-hover:bg-[#003974] transition-all"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 💡 النصائح الذكية ونشاط الورشة */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* صندوق النصيحة الذكية الفخم */}
          <div className="bg-[#003974] p-6 rounded-2xl text-white relative overflow-hidden group shadow-lg shadow-[#003974]/10">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2e0c3]">Conseil de Tendances</span>
                </div>
                <p className="font-['Playfair_Display'] text-base font-medium leading-relaxed mb-6">
                  "La poterie et le tissage artisanal connaissent une forte demande ce mois-ci. Mettez en avant vos créations authentiques."
                </p>
              </div>
              <button className="self-start text-[9px] font-bold uppercase tracking-widest bg-white text-[#003974] px-4 py-2.5 rounded-lg hover:bg-[#f2e0c3] transition-all cursor-pointer">
                Découvrir l'analyse
              </button>
            </div>
            <Brush className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12 group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* حالة مخزون الورشة والنشاط */}
          <div className="bg-white p-6 rounded-2xl border border-[#c2c6d3] shadow-sm">
            <h3 className="text-[10px] font-bold text-[#1a1c1b] uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#695d46] rounded-full"></span>
              État de l'Atelier
            </h3>
            <div className="space-y-4">
              
              {/* إشعار حالة المخزون */}
              {products.some(p => p.stock < 5) ? (
                <div className="flex gap-3 p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-rose-800 leading-tight">Stock Critique</p>
                    <p className="text-[10px] text-rose-700 font-['Inter'] mt-1 leading-relaxed">
                      Certains de vos articles artisanaux ont moins de 5 unités disponibles.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <Package className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 leading-tight">Stock Optimal</p>
                    <p className="text-[10px] text-emerald-700 font-['Inter'] mt-1 leading-relaxed">
                      Toutes vos pièces artisanales disposent d'un approvisionnement idéal.
                    </p>
                  </div>
                </div>
              )}
              
              {/* إشعار المبيعات الأخيرة */}
              {orders.length > 0 ? (
                <div className="flex gap-3 p-3.5 bg-sky-50/50 border border-sky-100 rounded-xl">
                  <ShoppingBasket className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-sky-800 leading-tight">Activité Récente</p>
                    <p className="text-[10px] text-sky-700 font-['Inter'] mt-1 leading-relaxed">
                      Dernière transaction enregistrée d'un montant de {orders[0].prix_total?.toLocaleString('fr-MA')} DH.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
                  <ShoppingBasket className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-700 leading-tight">Aucune Commande</p>
                    <p className="text-[10px] text-gray-600 font-['Inter'] mt-1 leading-relaxed">
                      En attente de vos premières ventes sur la plateforme.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard;