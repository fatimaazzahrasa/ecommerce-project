import React, { useState, useEffect } from 'react';
import { fetchProductsApi, fetchCategoriesApi } from '../services/api';
import  ProductCard  from '../components/ProductCard';
import { ShoppingBag as ShoppingBagIcon, Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CatalogPage = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [categorieSelectionnee, setCategorieSelectionnee] = useState(null);
  const [triOption, setTriOption] = useState('Nouveautés'); // 🔄 حالة الترتيب الجديدة
  const { nombreTotalArticles } = useCart();

  useEffect(() => {
    Promise.all([fetchProductsApi(), fetchCategoriesApi()])
      .then(([prodData, catData]) => {
        setProduits(Array.isArray(prodData) ? prodData : []);
        setCategories(Array.isArray(catData) ? catData : []);

        console.log("Les produits reçus de Django:", prodData);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de chargement du catalogue:", error);
        setLoading(false);
      });
  }, []);

  // 🔍 تصفية وترتيب المنتجات ديناميكياً
  const produitsTraites = produits
    .filter(p => {
      const pNom = p?.nom || p?.name || '';
      const pCatId = p?.categorie_id || p?.category || p?.categoryId;
      
      const correspondRecherche = pNom.toLowerCase().includes(recherche.toLowerCase());
      const correspondCategorie = !categorieSelectionnee || pCatId === categorieSelectionnee;
      
      return correspondRecherche && correspondCategorie;
    })
    .sort((a, b) => {
      // 📊 منطق الترتيب الفعلي
      if (triOption === 'Prix: Croissant') {
        return (a.prix || 0) - (b.prix || 0);
      }
      if (triOption === 'Prix: Décroissant') {
        return (b.prix || 0) - (a.prix || 0);
      }
      // افتراضياً: الترتيب حسب الأحدث (Nouveautés) بناءً على المعرف أو تاريخ الإنشاء
      const dateA = a.createdAt || a.id || '';
      const dateB = b.createdAt || b.id || '';
      return dateB > dateA ? 1 : -1;
    });

  return (
    <div className="bg-surface min-h-screen">
      {/* Header Section */}
      <div className="bg-surface-container-low border-b border-outline-variant/30 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-4"
          >
            Le Catalogue Local
          </motion.h1>
          <p className="text-on-surface-variant font-medium max-w-2xl mx-auto text-lg">
            Découvrez une sélection rigoureuse d'objets faits main par nos artisans partenaires.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Floating Cart Button for Mobile */}
        <div className="fixed bottom-8 right-6 md:hidden z-50">
           <Link to="/panier" className="flex items-center justify-center w-16 h-16 bg-primary text-on-primary rounded-2xl shadow-2xl shadow-primary/40 relative">
              <ShoppingBagIcon className="w-6 h-6" />
              {nombreTotalArticles > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-on-secondary text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-surface shadow-xl">
                  {nombreTotalArticles}
                </span>
              )}
           </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-10 lg:sticky lg:top-24 h-fit">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-on-surface">Catégories</h3>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setCategorieSelectionnee(null)}
                  className={cn(
                    "block w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer",
                    !categorieSelectionnee 
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  )}
                >
                  Toutes les pièces
                </button>
                {categories.map(cat => {
                  const catId = cat.id || cat._id;
                  return (
                    <button
                      key={catId}
                      onClick={() => setCategorieSelectionnee(catId)}
                      className={cn(
                        "block w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer",
                        categorieSelectionnee === catId 
                          ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      )}
                    >
                      {cat.nom || cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Search className="w-4 h-4 text-primary" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-on-surface">Recherche</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input 
                  type="text" 
                  placeholder="Chercher un objet..." 
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium transition-all"
                />
              </div>
            </div>

            <div className="p-6 bg-surface-container-high rounded-2xl border border-outline-variant/30 hidden md:block">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Besoin d'aide ?</p>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Contactez nos ateliers pour des commandes personnalisées.</p>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                 <p className="text-sm font-bold text-on-surface">
                  <span className="text-primary font-black mr-1">{produitsTraites.length}</span> créations trouvées
                </p>
              </div>
              <div className="flex items-center gap-4 bg-surface-container px-4 py-2 rounded-xl border border-outline-variant/30">
                <span className="text-[10px] font-black text-outline uppercase tracking-widest">Trier:</span>
                <select 
                  value={triOption}
                  onChange={(e) => setTriOption(e.target.value)}
                  className="text-xs font-bold text-on-surface bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="Nouveautés">Nouveautés</option>
                  <option value="Prix: Croissant">Prix: Croissant</option>
                  <option value="Prix: Décroissant">Prix: Décroissant</option>
                </select>
              </div>
            </header>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-surface-container-highest animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : produitsTraites.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {produitsTraites.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </motion.div>
            ) : (
              <div className="py-32 text-center">
                <div className="w-20 h-20 bg-surface-container-high rounded-3xl flex items-center justify-center mx-auto text-outline mb-6">
                  <Search className="w-10 h-10 opacity-20" />
                </div>
                <h3 className="text-2xl font-black text-on-surface tracking-tight mb-2">Aucun résultat</h3>
                <p className="text-on-surface-variant font-medium mb-8">Essayez de modifier vos filtres ou vos termes de recherche.</p>
                <button 
                  onClick={() => { setCategorieSelectionnee(null); setRecherche(''); setTriOption('Nouveautés'); }} 
                  className="px-6 py-3 bg-secondary text-on-secondary font-bold text-sm rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;