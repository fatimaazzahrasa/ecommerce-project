import React, { useState, useEffect } from 'react';
// 🚀 تصحيح الـ Import ديال Motion
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ArrowRight, ShieldCheck, ShoppingBag, Truck, Store } from 'lucide-react';
import { fetchProductsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ بيانات الأصناف الثابتة (Categories) من كودك القديم
  const categories = [
    { id: 1, name: 'Tapis Marocains', desc: 'L’art du tissage berbère ancestral.', img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=600&auto=format&fit=crop' },
    { id: 2, name: 'Céramique & Zellige', desc: 'La précision de la géométrie de Fès.', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop' },
    { id: 3, name: 'Maroquinerie & Cuir', desc: 'Le raffinement des tanneries de Marrakech.', img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600&auto=format&fit=crop' },
  ];

  // 🔄 جلب المنتجات الحقيقية من الـ API د Django
  useEffect(() => {
    fetchProductsApi()
      .then(data => {
        if (data && Array.isArray(data)) {
          setProduits(data.slice(0, 4)); // جلب أول 4 منتجات فقط للـ Featured
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur fetch products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface min-h-screen">
      
      {/* ================= HERO SECTION (Modern Design) ================= */}
      <section className="relative bg-[#003974] py-32 overflow-hidden flex items-center min-h-[550px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl bg-black/10 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.1] font-['Playfair_Display']"
            >
              L'Artisanat Authentique <br/>
              <span className="text-[#695d46]">Fait avec Cœur</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/90 mb-10 leading-relaxed font-medium"
            >
              Découvrez l'authenticité de l'artisanat marocain d'exception, revisité pour les intérieurs contemporains. Trouvez l'objet qui raconte une histoire.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/catalog" className="bg-white text-[#003974] hover:bg-white/90 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95">
                Explorer la Boutique
              </Link>
              <Link to="/Register" className="bg-white/10 text-white hover:bg-white/20 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border border-white/20 backdrop-blur-sm active:scale-95">
                Devenir Vendeur
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background Photo */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-60">
           <img 
            src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover"
            alt="Heritage Hero Background"
           />
           <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#003974]" />
        </div>
      </section>

      {/* ================= UNIVERS / CATEGORIES GRID ================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#003974] font-bold mb-3">
            Nos Univers Artisanaux
          </h3>
          <p className="text-xs uppercase tracking-widest text-[#695d46] font-semibold">
            Chaque pièce raconte une histoire unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group bg-white border border-outline-variant/30 rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-[300px] overflow-hidden relative">
                <img 
                  src={category.img} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow bg-white justify-between">
                <div>
                  <h4 className="font-['Playfair_Display'] text-xl font-bold text-[#003974] mb-2">
                    {category.name}
                  </h4>
                  <p className="text-sm text-[#424751] mb-6 leading-relaxed">
                    {category.desc}
                  </p>
                </div>
                <Link to="/catalog" className="text-xs uppercase tracking-widest font-bold text-[#695d46] hover:text-[#003974] transition-colors border-b border-[#695d46] w-fit pb-1">
                  Découvrir
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DYNAMIC FEATURED PRODUCTS ================= */}
      <section className="py-24 bg-surface-container-low border-t border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#003974] tracking-tight mb-2 font-['Playfair_Display']">Collections Vedettes</h2>
              <p className="text-on-surface-variant font-medium">Les nouveautés de nos maîtres artisans authentifiés.</p>
            </div>
            <Link to="/catalog" className="text-primary font-bold flex items-center gap-2 group text-sm uppercase tracking-wider">
              Voir Toute la Boutique <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-surface-container-high animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {produits.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= ARTISAN À LA UNE (Story Section) ================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Photo frame */}
          <div className="h-[450px] md:h-[550px] border border-outline-variant/30 p-4 bg-white rounded-3xl shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1595475242265-23a5578a5bf2?q=80&w=600" 
              alt="Maître Artisan" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Text block */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#695d46] font-bold block">
              Artisan à la une
            </span>
            <h3 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#003974] font-bold leading-tight">
              Maâlem Mustapha : <br />Le Maître du Zellige de Fès
            </h3>
            <p className="text-base text-[#424751] italic leading-relaxed bg-[#695d46]/5 p-4 border-l-4 border-[#695d46] rounded-r-xl">
              "Le zellige n'est pas qu'un assemblage de terre cuite, c'est une poésie géométrique où chaque coup de marteau doit être guidé par le cœur." 
            </p>
            <p className="text-sm text-[#424751] leading-relaxed opacity-90">
              Depuis plus de 35 ans, Mustapha perpétue le savoir-faire hérité de son grand-père dans son atelier au cœur de la médina de Fès. Chaque argile est extraite localement, façonnée à la main et cuite dans des fours traditionnels pour donner ces nuances de bleu royal uniques au monde.
            </p>
            <div className="pt-4">
              <Link to="/artisans" className="inline-block border border-[#003974] text-[#003974] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#003974] hover:text-white transition-all rounded-xl">
                Rencontrer nos Maîtres Artisans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST BADGES ================= */}
      <section className="bg-surface-container-low py-20 border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-[#003974] rounded-xl flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#003974]">Artisans Vérifiés</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Chaque vendeur est rigoureusement sélectionné pour garantir un artisanat authentique.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-[#003974] rounded-xl flex items-center justify-center">
                 <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#003974]">Soutien Direct</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Vos achats soutiennent directement les familles d'artisans et préservent nos traditions.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-[#003974] rounded-xl flex items-center justify-center">
                 <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#003974]">Livraison Sécurisée</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Nos objets précieux sont emballés avec soin et livrés en toute sécurité chez vous.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003974] mb-4 tracking-tight font-['Playfair_Display']">Restez Connectés</h2>
          <p className="text-on-surface-variant text-sm mb-10 font-medium">Découvrez les coulisses de nos ateliers et accédez aux nouvelles collections en avant-première.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input type="email" placeholder="Votre adresse email" className="input-field flex-grow py-4 px-5 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:border-primary" />
            <button className="bg-[#003974] text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all">S'inscrire</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;