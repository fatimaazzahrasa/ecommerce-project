import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductByIdApi } from '../services/api';
import { Star, Heart, ArrowRight, Truck, ShieldCheck, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion'; // 🔄 تم التعديل للاستيراد القياسي والمتوافق لـ framer-motion

const ProductDetail = () => {
  const { id } = useParams();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ajoutEnCours, setAjoutEnCours] = useState(false);
  const [quantite, setQuantite] = useState(1);
  const [activeTab, setActiveTab] = useState('Description'); // إدارة التبويبات النشطة ديناميكياً
  const { ajouterAuPanier } = useCart();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductByIdApi(id)
        .then(data => {
          setProduit(data || null);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur de récupération du produit:", err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleAjouterAuPanier = () => {
    if (produit) {
      setAjoutEnCours(true);
      setTimeout(() => {
        ajouterAuPanier(produit, quantite);
        setAjoutEnCours(false);
      }, 500);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
      <div className="animate-pulse flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 aspect-square bg-surface-container rounded-3xl" />
        <div className="flex-1 space-y-6 pt-10">
          <div className="h-10 bg-surface-container rounded-lg w-2/3" />
          <div className="h-6 bg-surface-container rounded-lg w-1/4" />
          <div className="h-40 bg-surface-container rounded-lg" />
        </div>
      </div>
    </div>
  );

  if (!produit) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold font-manrope text-on-surface">Produit non trouvé</h2>
      <Link to="/catalog" className="text-primary hover:underline mt-4 inline-block font-bold">Retour au catalogue</Link>
    </div>
  );

  // حماية المعطيات الحسابية والافتراضية
  const productPrice = produit.prix ? Number(produit.prix) : 0;
  const productStock = produit.stock ? Number(produit.stock) : 0;
  const isOutOfStock = productStock <= 0 || produit.statut === 'Rupture';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 bg-surface">
      
      {/* 🧭 Fil d'Ariane / مسار التصفح */}
      <nav className="flex items-center gap-2 mb-10 text-on-surface-variant font-bold text-[10px] uppercase tracking-widest bg-surface-container/30 w-fit px-4 py-2 rounded-full border border-outline-variant">
        <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3 text-outline" />
        <Link to="/catalog" className="hover:text-primary transition-colors">Catalogue</Link>
        <ChevronRight className="w-3 h-3 text-outline" />
        <span className="text-primary truncate max-w-[150px]">{produit.nom}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
        
        {/* 📸 Galerie / معرض الصور */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-[2rem] overflow-hidden border border-outline-variant bg-white p-2 shadow-sm"
          >
            <img 
              src={produit.image || `https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600`} 
              alt={produit.nom} 
              className="w-full h-full object-cover rounded-[1.5rem]" 
            />
          </motion.div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-outline-variant hover:border-primary transition-all cursor-pointer p-1 bg-white">
                <img src={produit.image || `https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover rounded-xl" alt={`vue ${i}`} />
              </div>
            ))}
            <div className="aspect-square rounded-2xl bg-surface-container-high hover:bg-surface-variant transition-colors flex items-center justify-center border border-outline-variant cursor-pointer text-xs font-black text-on-surface-variant uppercase tracking-widest">
              +4
            </div>
          </div>
        </div>

        {/* ℹ️ Informations / تفاصيل المنتج الأساسية */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[10px] font-black text-secondary uppercase tracking-[0.25em] bg-secondary/10 px-3 py-1 rounded-full">Édition Limitée</span>
              <span className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.25em] bg-primary/10 px-3 py-1 rounded-full">Fait Main</span>
            </div>
            
            <div className="flex justify-between items-start gap-4">
              <h1 className="font-manrope text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight">
                {produit.nom}
              </h1>
              <button className="p-4 border border-outline-variant rounded-[1.25rem] text-on-surface-variant hover:text-red-500 hover:border-red-200 transition-all active:scale-90 hover:bg-red-50/50 shadow-sm cursor-pointer">
                <Heart className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-on-surface-variant">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60 font-manrope">({produit.nombre_avis || 0} Avis récoltés)</span>
            </div>

            <div className="py-4">
              <div className="font-manrope text-5xl font-black text-primary tracking-tighter">
                {productPrice.toLocaleString('fr-MA')} <span className="text-xl font-bold ml-1">DH</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* 🔨 Carte de l'Artisan / كارت الحرفي المالك للمنتج */}
            <div className="group p-5 bg-surface-container-low rounded-3xl border border-outline-variant shadow-sm transition-all hover:bg-surface-container hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 p-1">
                    <img src={`https://i.pravatar.cc/150?u=${produit.artisan_id || 'artisan'}`} className="w-full h-full rounded-xl object-cover shadow-sm" alt={produit.artisan_nom || 'Artisan'} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest">Atelier de l'artisan</p>
                    <p className="font-sans font-extrabold text-on-surface text-lg group-hover:text-primary transition-colors">{produit.artisan_nom || 'Artisan Local'}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-outline group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* 📊 Stock / المخزون الحالي */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface">
                <span className="text-on-surface-variant">Disponibilité</span>
                <span className={cn(isOutOfStock ? "text-red-500 font-bold" : productStock < 5 ? "text-secondary font-bold" : "text-primary font-bold")}>
                  {isOutOfStock ? "Rupture de stock" : `Plus que ${productStock} exemplaires`}
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: isOutOfStock ? '0%' : productStock < 5 ? '25%' : '80%' }}
                   className={cn("h-full rounded-full", isOutOfStock ? "bg-red-500" : productStock < 5 ? "bg-secondary" : "bg-primary")}
                />
              </div>
            </div>

            {/* 🛒 Actions / أزرار الكمية والإضافة للسلة */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center border border-outline-variant rounded-2xl p-1 bg-white shadow-sm h-16 shrink-0 justify-between">
                <button 
                  onClick={() => setQuantite(Math.max(1, quantite - 1))}
                  disabled={isOutOfStock}
                  className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={quantite} 
                  readOnly 
                  className="w-12 text-center border-none focus:ring-0 font-sans font-black text-lg text-on-surface bg-transparent"
                />
                <button 
                  onClick={() => setQuantite(productStock ? Math.min(productStock, quantite + 1) : quantite + 1)}
                  disabled={isOutOfStock || quantite >= productStock}
                  className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={handleAjouterAuPanier}
                disabled={ajoutEnCours || isOutOfStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 bg-primary text-white font-manrope font-black rounded-2xl text-lg shadow-2xl shadow-primary/20 h-16 transition-all hover:opacity-95 active:scale-95 cursor-pointer disabled:bg-surface-container-highest disabled:text-outline disabled:shadow-none disabled:cursor-not-allowed",
                  ajoutEnCours && "cursor-wait opacity-80"
                )}
              >
                {ajoutEnCours ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>En cours d'ajout...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    <span>{isOutOfStock ? 'Rupture de stock' : 'Ajouter au Panier'}</span>
                  </>
                )}
              </button>
            </div>

            {/* 🛡️ Garanties / الضمانات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-4 p-5 bg-surface-container-low rounded-3xl border border-outline-variant/30">
                <Truck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Livraison Rapide</p>
                  <p className="text-[10px] font-medium text-on-surface-variant mt-0.5">48h à 72h partout au Maroc</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-surface-container-low rounded-3xl border border-outline-variant/30">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Paiement Sécurisé</p>
                  <p className="text-[10px] font-medium text-on-surface-variant mt-0.5">Protégé par SSL et Stripe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📄 التبويبات والمواصفات السفلية للمنتج */}
      <section className="mt-24 border-t border-outline-variant pt-20">
        <div className="flex flex-wrap gap-10 mb-12 border-b border-outline-variant/30 pb-1">
          {['Description', 'Authenticité', "Conseils d'entretien"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative cursor-pointer",
                activeTab === tab ? "text-primary" : "text-outline hover:text-on-surface-variant"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            <h2 className="font-manrope text-3xl font-black text-on-surface tracking-tight">L'âme de l'artisanat pure</h2>
            <p className="text-on-surface-variant leading-relaxed text-xl font-medium opacity-90">
              {produit.description || "Aucune description fournie pour ce chef d'œuvre artisanal."}
            </p>
            <p className="text-on-surface-variant leading-relaxed text-xl font-medium opacity-90">
              Conçu pour être à la fois une pièce maîtresse fonctionnelle et un élément sculptural autonome, cet objet porte le poids et la permanence de l'histoire locale de nos ateliers Marocains.
            </p>
          </div>
          
          <div className="lg:col-span-4 bg-white border border-outline-variant rounded-[2.5rem] p-10 h-fit shadow-sm">
            <h3 className="font-manrope text-2xl font-black text-on-surface mb-8">Spécificités</h3>
            <ul className="space-y-6">
              {[
                { label: 'Matériaux', value: produit.categorie || 'Argile Naturelle / Cuir' },
                { label: 'Technique', value: 'Tournage main original' },
                { label: 'Origine', value: 'Artisanat du Maroc' },
                { label: 'Entretien', value: 'Lavage délicat à la main' }
              ].map(item => (
                <li key={item.label} className="flex flex-col gap-1 py-1 border-b border-surface-variant/30 last:border-0 pb-4">
                  <span className="text-[10px] font-black text-outline uppercase tracking-widest">{item.label}</span>
                  <span className="font-extrabold text-on-surface text-lg">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;