import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
// 🔌 استيراد الأيقونات مباشرة باش نعوضو السايدبار والنافبار الناقصين
import { Users, FolderPlus, CheckCircle, Menu, X, Shield, LogOut, BarChart3, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // 📦 الحالات (States) الخاصة بالبيانات
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalArtisansCount, setTotalArtisansCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 جلب البيانات عند تحميل المكون
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const artisansResponse = await axios.get('/api/admin/artisans/pending');
        const categoriesResponse = await axios.get('/api/categories');
        const totalCountResponse = await axios.get('/api/admin/artisans/count');

        setPendingArtisans(artisansResponse.data);
        setCategories(categoriesResponse.data);
        setTotalArtisansCount(totalCountResponse.data.total || 0);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        // بيانات تجريبية (Mock Data) باش المشروع يشتغل حتى لو الباكيند طافي
        setPendingArtisans([
          { id: 1, name: "Ahmed Amrani", specialty: "Tapis Traditionnel", city: "Fès", createdAt: new Date() },
          { id: 2, name: "Fatima Zahra", specialty: "Céramique & Poterie", city: "Safi", createdAt: new Date() }
        ]);
        setCategories([
          { id: 1, name: "Tapis", productsCount: 12 },
          { id: 2, name: "Poterie", productsCount: 8 }
        ]);
        setTotalArtisansCount(15);
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
      alert("L'artisan a été approuvé avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      // تحديث محلي في حالة غياب الباكيند لتسهيل الـ Demo ف الـ PFA
      setPendingArtisans(pendingArtisans.filter(artisan => artisan.id !== id));
      setTotalArtisansCount(prev => prev + 1);
    }
  };

  const handleAddCategory = async () => {
    const categoryName = prompt("Entrez le nom de la nouvelle catégorie :");
    if (!categoryName) return;

    try {
      const response = await axios.post('/api/categories', { name: categoryName });
      setCategories([...categories, response.data]);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setCategories([...categories, { id: Date.now(), name: categoryName, productsCount: 0 }]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#003974] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#424751]">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] min-h-screen flex w-full overflow-x-hidden relative">
      
      {/* 1️⃣ السايدبار المدمج المصلح */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-[#003974] text-white z-50 p-6 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#d5c5a8]" />
              <h1 className="text-xl font-bold tracking-wide">E-Artisan Admin</h1>
            </div>
            <button className="lg:hidden text-white" onClick={toggleSidebar}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <Link to="/admin" className="flex items-center gap-3 p-3 bg-white/10 text-[#d5c5a8] font-bold rounded-lg transition-all">
              <BarChart3 className="w-5 h-5" /> Dashboard
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 p-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-all">
              <Users className="w-5 h-5" /> Artisans & Clients
            </Link>
          </nav>
        </div>

        <button className="flex items-center gap-3 p-3 text-red-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all border-t border-white/10 pt-4">
          <LogOut className="w-5 h-5" /> Déconnexion
        </button>
      </aside>

      {/* المحتوى الرئيسي للـ Admin */}
      <main className="flex-grow ml-0 lg:ml-80 p-4 sm:p-8 lg:p-12 bg-[#f9f9f7] min-h-screen flex flex-col justify-between w-full max-w-full">
        
        <div>
          {/* 2️⃣ النافبار المدمج المصلح */}
          <header className="flex items-center justify-between bg-white border border-[#c2c6d3] p-4 rounded-xl shadow-xs mb-8">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 text-[#003974]" onClick={toggleSidebar}>
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold text-[#003974]">Tableau de Bord Modérateur</h1>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#424751]">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Mode Admin
            </div>
          </header>

          {/* الكروت الإحصائية الديناميكية */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 border border-[#c2c6d3] bg-white rounded-xl shadow-xs">
              <p className="font-semibold text-xs text-[#695d46] uppercase tracking-widest mb-2">En Attente</p>
              <h2 className="text-4xl font-bold text-[#003974]">{pendingArtisans.length}</h2>
              <p className="text-[#424751] text-sm mt-2">Nouveaux artisans à valider</p>
            </div>
            <div className="p-6 border border-[#c2c6d3] bg-white rounded-xl shadow-xs">
              <p className="font-semibold text-xs text-[#695d46] uppercase tracking-widest mb-2">Catégories</p>
              <h2 className="text-4xl font-bold text-[#003974]">{categories.length}</h2>
              <p className="text-[#424751] text-sm mt-2">Types de métiers enregistrés</p>
            </div>
            <div className="p-6 border border-[#c2c6d3] bg-white rounded-xl shadow-xs">
              <p className="font-semibold text-xs text-[#695d46] uppercase tracking-widest mb-2">Total Artisans</p>
              <h2 className="text-4xl font-bold text-[#003974]">{totalArtisansCount}</h2>
              <p className="text-[#424751] text-sm mt-2">Membres actifs</p>
            </div>
          </section>

          {/* محتوى الإدارة الفعلي */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* جدول طلبات التحقق الحية */}
            <div className="col-span-12 lg:col-span-8 bg-white p-6 border border-[#c2c6d3] rounded-xl">
              <div className="flex justify-between items-center mb-6 border-b border-[#c2c6d3] pb-4">
                <h2 className="text-xl font-bold text-[#1a1c1b]">Validation des Artisans</h2>
                <span className="text-xs text-[#003974] font-bold uppercase tracking-widest">Live</span>
              </div>
              
              <div className="overflow-x-auto w-full">
                {pendingArtisans.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-[#c2c6d3] rounded-xl">
                    <p className="text-[#424751] text-sm font-medium">Aucune demande d'inscription en attente.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-[#c2c6d3]">
                        <th className="py-3 text-xs font-bold uppercase tracking-widest text-[#695d46]">Artisan</th>
                        <th className="py-3 text-xs font-bold uppercase tracking-widest text-[#695d46]">Spécialité</th>
                        <th className="py-3 text-xs font-bold uppercase tracking-widest text-[#695d46]">Ville</th>
                        <th className="py-3 text-right text-xs font-bold uppercase tracking-widest text-[#695d46]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c2c6d3]">
                      {pendingArtisans.map((artisan) => (
                        <tr key={artisan.id} className="hover:bg-[#f9f9f7] transition-colors">
                          <td className="py-4 flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#d5c5a8] flex items-center justify-center text-[#231a08] font-bold text-xs rounded-lg">
                              {artisan.name ? artisan.name.split(' ').map(n => n[0]).join('') : 'A'}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-[#1a1c1b]">{artisan.name}</p>
                              <p className="text-[11px] text-[#424751]">Nouveau Dossier</p>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-[#424751]">{artisan.specialty}</td>
                          <td className="py-4 text-sm text-[#424751]">{artisan.city}</td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => handleApprove(artisan.id)}
                              className="bg-[#003974] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-[#002851] active:scale-95 transition-all rounded-lg flex items-center gap-1 ml-auto"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approuver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* قسم إدارة الفئات الحية */}
            <div className="col-span-12 lg:col-span-4 bg-white p-6 border border-[#c2c6d3] rounded-xl">
              <div className="flex justify-between items-center mb-6 border-b border-[#c2c6d3] pb-4">
                <h2 className="text-xl font-bold text-[#1a1c1b]">Catégories</h2>
                <button 
                  onClick={handleAddCategory}
                  className="bg-[#003974]/10 text-[#003974] p-2 rounded-lg hover:bg-[#003974]/20 transition-all"
                >
                  <FolderPlus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-[#f9f9f7] border border-[#c2c6d3] rounded-lg hover:bg-[#f4f4f2] transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-[#695d46]">📂</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#1a1c1b]">{category.name}</span>
                    </div>
                    <span className="text-[#424751] text-xs font-medium bg-white px-2 py-1 border border-[#c2c6d3] rounded-md">
                      {category.productsCount || 0} Prod
                    </span>
                  </div>
                ))}
              </div>

              {/* قسم الملاحظات الصورية */}
              <div className="mt-6 p-4 bg-[#eeeeec] rounded-lg border border-[#c2c6d3] flex gap-3">
                <HelpCircle className="w-5 h-5 text-[#003974] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#1a1c1b] mb-1">Normes & Directives</h4>
                  <p className="text-[11px] text-[#424751] leading-relaxed">
                    Vérifiez la conformité des ateliers selon les chartes de l'artisanat marocain avant validation.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3️⃣ الفوتر المدمج المصلح */}
        <footer className="mt-12 pt-4 border-t border-[#c2c6d3] text-center text-xs text-[#424751]">
          <p>&copy; {new Date().getFullYear()} E-Artisan PFA. Tous droits réservés.</p>
        </footer>
      </main>
    </div>
  );
}