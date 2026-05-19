import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Truck, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  CheckCircle,
  Clock,
  Package,
  Receipt,
  HelpCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { fetchOrdersApi } from '../../services/api';

const ArtisanOrders = () => {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('TOUTES');

  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const fetched = await fetchOrdersApi(user.id, user.role);
          setCommandes(fetched || []);
        } catch (error) {
          console.error("Erreur lors du chargement des commandes:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadOrders();
  }, [user]);

  // 🏷️ خريطة الحالات المتوافقة تماماً مع الـ API والألوان الملكية والترابية
  const STATUT_MAP = {
    'EN PRÉPARATION': { label: 'En préparation', styles: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    'EXPÉDIÉE': { label: 'Expédiée', styles: 'bg-sky-50 text-sky-700 border-sky-200', icon: Truck },
    'LIVRÉE': { label: 'Livrée', styles: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
    'ANNULÉE': { label: 'Annulée', styles: 'bg-rose-50 text-rose-700 border-rose-200', icon: Package }
  };

  const getStatusInfo = (status) => {
    const s = (status || '').toUpperCase();
    return STATUT_MAP[s] || { label: status || 'Inconnu', styles: 'bg-gray-50 text-gray-700 border-gray-200', icon: HelpCircle };
  };

  // 🔍 تصفية الطلبات حسب التبويب والبحث المتقدم (الرقم أو اسم العميل)
  const filteredCommandes = commandes.filter(order => {
    const orderStatus = (order.statut || '').toUpperCase();
    const matchesTab = activeTab === 'TOUTES' || orderStatus === activeTab;
    
    const clientName = (order.client_nom || '').toLowerCase();
    const orderId = (order.id || '').toLowerCase();
    const search = searchQuery.toLowerCase();
    const matchesSearch = orderId.includes(search) || clientName.includes(search);
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-12 px-2">
      
      {/* 👑 ترويسة الصفحة والبحث */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-[#c2c6d3] pb-8">
        <div>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#003974] font-bold tracking-tight mb-2">
            Gestion des Commandes
          </h2>
          <p className="text-[#424751] font-['Inter'] text-sm">
            Suivez, préparez et expédiez vos créations artisanales uniques.
          </p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap w-full xl:w-auto">
          {/* شريط البحث */}
          <div className="relative flex-1 min-w-[280px] xl:max-w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#727782] w-4 h-4 pointer-events-none" />
            <input 
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#c2c6d3] rounded-xl focus:border-[#003974] focus:ring-1 focus:ring-[#003974] outline-none font-medium transition-all text-xs shadow-sm text-[#1a1c1b]" 
              placeholder="Numéro de commande ou client..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* أزرار التصفية السريعة Tabs */}
          <div className="flex bg-[#f4f4f2] p-1 rounded-xl border border-[#c2c6d3]/60">
            {[
              { id: 'TOUTES', label: 'Toutes' },
              { id: 'EN PRÉPARATION', label: 'En préparation' },
              { id: 'EXPÉDIÉE', label: 'Expédiées' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer",
                  activeTab === tab.id 
                    ? "bg-white text-[#003974] shadow-sm" 
                    : "text-[#424751] hover:bg-white/40"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 bg-white border border-[#727782] text-[#1a1c1b] px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#f4f4f2] transition-all cursor-pointer">
            <Filter className="w-4 h-4 text-[#695d46]" />
            Filtres
          </button>
        </div>
      </div>

      {/* 📊 جدول عرض البيانات */}
      <div className="bg-white rounded-2xl border border-[#c2c6d3] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f2]/50 border-b border-[#c2c6d3]/60 text-[9px] font-bold text-[#695d46] uppercase tracking-widest">
                <th className="px-8 py-5">Commande / Date</th>
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5 text-center">Statut</th>
                <th className="px-8 py-5">Total</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c2c6d3]/40 font-['Inter']">
              
              {/* ⏳ حالة التحميل */}
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 rounded-full border-2 border-[#c2c6d3] border-t-[#003974] animate-spin" />
                      <p className="font-bold text-[#695d46] uppercase tracking-widest text-[9px]">Chargement des données artisanales...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCommandes.length === 0 ? (
                /* 📭 حالة عدم وجود بيانات */
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 max-w-md mx-auto opacity-60">
                      <Package className="w-12 h-12 text-[#695d46]" />
                      <div>
                        <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1c1b]">Aucune commande trouvée</p>
                        <p className="text-xs text-[#424751] mt-1">Dès qu'un collectionneur commande une pièce, elle apparaîtra instantanément ici.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                /* 📑 عرض الطلبات */
                filteredCommandes.map((order) => (
                  <tr key={order.id} className="hover:bg-[#f9f9f7] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#003974] text-sm tracking-wide">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-[#424751] font-medium">
                          {order.date_creation ? new Date(order.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-[#003974]/5 text-[#003974] flex items-center justify-center font-bold text-xs border border-[#003974]/10 shadow-inner">
                          {order.client_nom ? order.client_nom.substring(0, 2).toUpperCase() : 'MA'}
                        </div>
                        <span className="font-bold text-[#1a1c1b] text-xs">{order.client_nom || 'Client MarocArtisan'}</span>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border shadow-sm",
                          getStatusInfo(order.statut).styles
                        )}>
                          {React.createElement(getStatusInfo(order.statut).icon, { className: "w-3.5 h-3.5" })}
                          {getStatusInfo(order.statut).label}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6 font-bold text-sm text-[#1a1c1b] tracking-tight">
                      {(order.prix_total || 0).toLocaleString('fr-MA')} DH
                    </td>
                    
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="w-9 h-9 flex items-center justify-center text-[#424751] hover:text-[#003974] hover:bg-[#003974]/5 rounded-xl border border-[#c2c6d3]/60 transition-all cursor-pointer" 
                          title={order.statut === 'En préparation' ? "Expédier la commande" : "Voir les détails"}
                        >
                          {order.statut === 'En préparation' ? <Truck className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center text-[#424751] hover:bg-[#f4f4f2] rounded-xl border border-[#c2c6d3]/60 transition-all cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 📑 الترقيم السفلي (Pagination) */}
        <div className="px-8 py-5 flex flex-col sm:flex-row items-center justify-between bg-[#f4f4f2]/30 border-t border-[#c2c6d3]/60 gap-4">
          <span className="text-[10px] font-bold text-[#695d46] uppercase tracking-wider">
            Affichage de {filteredCommandes.length} sur {commandes.length} commandes
          </span>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center text-[#727782] hover:text-[#003974] border border-[#c2c6d3]/60 rounded-lg disabled:opacity-30 transition-all" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {[1].map(p => (
                <button 
                  key={p} 
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all border",
                    p === 1 ? "bg-[#003974] text-white border-[#003974] shadow-sm" : "hover:bg-white text-[#424751] border-[#c2c6d3]/60"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="w-8 h-8 flex items-center justify-center text-[#727782] hover:text-[#003974] border border-[#c2c6d3]/60 rounded-lg transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 💡 نصيحة الأداء في تذييل الصفحة */}
      <div className="bg-[#003974] text-white rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm relative overflow-hidden group border border-white/5">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shrink-0 border border-white/10 shadow-md">
          <Receipt className="w-5 h-5 text-[#f2e0c3]" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2e0c3] mb-1">Conseil de Performance</p>
          <p className="font-['Playfair_Display'] text-base font-medium opacity-95 leading-relaxed italic">
            "Les ateliers qui préparent leurs commandes sous <span className="text-[#f2e0c3] font-bold">48 heures</span> obtiennent des retours positifs plus élevés de la part des acheteurs."
          </p>
        </div>
        <div className="absolute top-[-50%] right-[-20%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default ArtisanOrders;