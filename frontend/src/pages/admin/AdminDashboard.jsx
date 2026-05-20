import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { 
  TrendingUp, 
  UsersRound, 
  Brush, 
  CreditCard, 
  Check, 
  Ban,
  Armchair,
  Shirt,
  Gem,
  Palette,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  // 📦 الحالات (States) الخاصة بالبيانات الحية
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalArtisansCount, setTotalArtisansCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 جلب البيانات (كنخليو الـ useEffect ديالك كيفما هو ناضي)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const artisansResponse = await axios.get('/api/admin/artisans/pending');
        const categoriesResponse = await axios.get('/api/categories');
        const totalCountResponse = await axios.get('/api/admin/artisans/count');

        if (Array.isArray(artisansResponse.data)) {
          setPendingArtisans(artisansResponse.data);
        } else if (artisansResponse.data && Array.isArray(artisansResponse.data.results)) {
          setPendingArtisans(artisansResponse.data.results);
        } else {
          setPendingArtisans([]);
        }

        if (Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else if (categoriesResponse.data && Array.isArray(categoriesResponse.data.results)) {
          setCategories(categoriesResponse.data.results);
        } else {
          setCategories([]);
        }

        setTotalArtisansCount(totalCountResponse.data?.total || 1240);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        
        // الـ Mock Data ديالك
        setPendingArtisans([
          { id: 1, name: "Earth & Fire Ceramics", specialty: "Handcrafted stoneware and vessels", city: "Safi", timeAgo: "Il y a 2 heures", initials: "EF" },
          { id: 2, name: "Oak & Thread Leather", specialty: "Full-grain bespoke accessories", city: "Fès", timeAgo: "Il y a 5 heures", initials: "OT" }
        ]);
        
        setCategories([
          { id: 1, name: "Furniture", icon: <Armchair className="w-5 h-5" />, count: 42 },
          { id: 2, name: "Textiles", icon: <Shirt className="w-5 h-5" />, count: 88 },
          { id: 3, name: "Jewelry", icon: <Gem className="w-5 h-5" />, count: 112 },
          { id: 4, name: "Fine Art", icon: <Palette className="w-5 h-5" />, count: 56 }
        ]);
        setTotalArtisansCount(1240);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/artisans/${id}/approve`, { statut: 'Approuvé' });
      setPendingArtisans(pendingArtisans.filter(artisan => artisan.id !== id));
      setTotalArtisansCount(prev => prev + 1);
    } catch (error) {
      setPendingArtisans(pendingArtisans.filter(artisan => artisan.id !== id));
      setTotalArtisansCount(prev => prev + 1);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/admin/artisans/${id}/reject`, { statut: 'Refusé' });
      setPendingArtisans(pendingArtisans.filter(artisan => artisan.id !== id));
    } catch (error) {
      setPendingArtisans(pendingArtisans.filter(artisan => artisan.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-outline">Chargement des données en cours...</p>
      </div>
    );
  }

  // 🎯 الرّبح كامل هنا: رجعنا كـنـرجعو فقط الـ Content المحض لّي غايبان وسط الـ Outlet
  return (
    <div className="space-y-8 w-full">
      
      {/* 📊 كروت الإحصائيات (مـقادين بـ Grid ديناميكي ريسپونسيف) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* الكرت 1 */}
        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3.5 bg-primary/10 text-primary rounded-2xl">
              <UsersRound className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-on-surface-variant">Total Users</h3>
          </div>
          <p className="text-4xl font-black text-on-surface tracking-tight">12,482</p>
          <p className="text-xs text-primary flex items-center gap-1 mt-3 font-bold">
            <TrendingUp className="w-4 h-4" /> +14% depuis le mois dernier
          </p>
        </div>

        {/* الكرت 2 */}
        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3.5 bg-secondary/10 text-secondary rounded-2xl">
              <Brush className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-on-surface-variant">Total Artisans</h3>
          </div>
          <p className="text-4xl font-black text-secondary tracking-tight">{totalArtisansCount}</p>
          <p className="text-xs text-secondary flex items-center gap-1 mt-3 font-bold">
            <TrendingUp className="w-4 h-4" /> +5% depuis le mois dernier
          </p>
        </div>

        {/* الكرت 3 */}
        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3.5 bg-tertiary/10 text-tertiary rounded-2xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-on-surface-variant">Monthly Revenue</h3>
          </div>
          <p className="text-4xl font-black text-on-surface tracking-tight">$84,200</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-3 font-bold">
            <TrendingUp className="w-4 h-4" /> +21% depuis le mois dernier
          </p>
        </div>
      </section>

      {/* 📑 الهيكل الرئيسي المتوازن (طابور الحرفيين الجدد + جدول المستخدمين النشطين) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* طابور الحرفيين في انتظار التفعيل */}
        <section className="lg:col-span-7 bg-surface-container-low rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
            <h2 className="font-black text-md text-on-surface">Demandes d'approbation</h2>
            <span className="bg-error text-on-error text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {pendingArtisans.length} En attente
            </span>
          </div>
          
          <div className="divide-y divide-outline-variant/20">
            {pendingArtisans.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant text-sm font-bold">
                Aucune demande d'inscription en attente.
              </div>
            ) : (
              pendingArtisans.map((artisan) => (
                <div key={artisan.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-surface-container-high/40 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-lg text-primary shrink-0">
                    {artisan.initials || artisan.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-on-surface truncate">{artisan.name}</p>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">{artisan.specialty}</p>
                    <p className="text-[11px] text-outline mt-1.5 font-medium">Ville: {artisan.city} • {artisan.timeAgo}</p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center mt-2 sm:mt-0">
                    <button 
                      onClick={() => handleApprove(artisan.id)}
                      className="px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-black hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-primary/10"
                    >
                      <Check className="w-4 h-4" /> Approuver
                    </button>
                    <button 
                      onClick={() => handleReject(artisan.id)}
                      className="px-4 py-2.5 bg-surface border border-outline-variant/50 text-error rounded-xl text-xs font-black hover:bg-error/5 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Ban className="w-4 h-4" /> Rejeter
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* جدول المستخدمين النشطين مؤخراً */}
        <section className="lg:col-span-5 bg-surface-container-low rounded-3xl border border-outline-variant/30 flex flex-col overflow-hidden shadow-sm">
          <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low/50">
            <h2 className="font-black text-md text-on-surface">Utilisateurs actifs</h2>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-high/50 text-[10px] font-black text-outline uppercase tracking-widest border-b border-outline-variant/20">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-xs">
                {[
                  { name: 'Jane Smith', email: 'jane@example.com', role: 'Client', initials: 'JS' },
                  { name: 'Marcus Kane', email: 'm.kane@studio.co', role: 'Artisan', initials: 'MK' },
                  { name: 'Rosa Luna', email: 'rosa.l@web.me', role: 'Client', initials: 'RL' }
                ].map((u, i) => (
                  <tr key={i} className="hover:bg-surface-container-high/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary">{u.initials}</div>
                      <div>
                        <p className="font-bold text-on-surface">{u.name}</p>
                        <p className="text-[10px] text-outline font-medium">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-bold text-xs">{u.role}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* 📂 الفئات الأكثر أداءً + حالة النظام */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-black text-md text-on-surface mb-4">Catégories performantes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-surface rounded-2xl text-center flex flex-col items-center border border-outline-variant/20">
              <div className="text-primary mb-2"><Armchair className="w-5 h-5" /></div>
              <p className="text-xs font-black text-on-surface">Furniture</p>
              <p className="text-[10px] text-outline font-bold mt-1">42 Ateliers</p>
            </div>
            <div className="p-4 bg-surface rounded-2xl text-center flex flex-col items-center border border-outline-variant/20">
              <div className="text-secondary mb-2"><Shirt className="w-5 h-5" /></div>
              <p className="text-xs font-black text-on-surface">Textiles</p>
              <p className="text-[10px] text-outline font-bold mt-1">88 Ateliers</p>
            </div>
            <div className="p-4 bg-surface rounded-2xl text-center flex flex-col items-center border border-outline-variant/20">
              <div className="text-tertiary mb-2"><Gem className="w-5 h-5" /></div>
              <p className="text-xs font-black text-on-surface">Jewelry</p>
              <p className="text-[10px] text-outline font-bold mt-1">112 Ateliers</p>
            </div>
            <div className="p-4 bg-surface rounded-2xl text-center flex flex-col items-center border border-outline-variant/20">
              <div className="text-primary mb-2"><Palette className="w-5 h-5" /></div>
              <p className="text-xs font-black text-on-surface">Fine Art</p>
              <p className="text-[10px] text-outline font-bold mt-1">56 Ateliers</p>
            </div>
          </div>
        </div>

        {/* حالة النظام المدمجة */}
        <div className="bg-primary text-on-primary p-6 rounded-3xl flex flex-col justify-between shadow-lg shadow-primary/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-on-primary" />
              <h3 className="font-black text-sm">État du Système</h3>
            </div>
            <p className="text-xs text-on-primary/80 leading-relaxed font-medium">Tous les services de la plateforme fonctionnent normalement.</p>
          </div>
          <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-on-primary rounded-xl text-xs font-black border border-white/10 transition-colors uppercase tracking-wider">
            Diagnostics
          </button>
        </div>
      </section>

    </div>
  );
}