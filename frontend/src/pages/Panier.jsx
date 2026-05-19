import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBasket, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  // 🔄 جلب البيانات والدوال الحقيقية من الـ Context ديالك
  const { articles, retirerDuPanier, modifierQuantite, sousTotal, nombreTotalArticles } = useCart();
  const navigate = useNavigate();

  // 🪙 حساب المصاريف الإضافية بالدرهم المغربي
  const fraisLivraison = articles.length > 0 ? 50 : 0; // 50 درهم للشحن
  const tva = sousTotal * 0.20; // 20% TVA
  const total = sousTotal + fraisLivraison + tva;

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f7]">
      

      <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 md:px-16 py-12">
        
        <AnimatePresence mode="wait">
          {articles.length === 0 ? (
            /* ================= 🫙 السلة فارغة (Empty State) ================= */
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-[500px] flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 border border-[#c2c6d3] shadow-sm text-[#c2c6d3]">
                <ShoppingBasket className="w-14 h-14" />
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1c1b] mb-3">
                Votre panier est vide
              </h2>
              <p className="text-sm text-[#424751] font-['Inter'] max-w-md mx-auto mb-8">
                Il semble que vous n'ayez pas encore ajouté de trésors artisanaux à votre collection.
              </p>
              <Link 
                to="/catalog" 
                className="bg-[#003974] text-white font-bold text-xs uppercase px-10 py-4 tracking-[0.2em] hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#003974]/10"
              >
                Explorer la boutique
              </Link>
            </motion.section>
          ) : (
            /* ================= 🛍️ السلة عامرة (Cart Content) ================= */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* عنوان الصفحة وعدد العناصر */}
              <div className="mb-12 border-b border-[#c2c6d3] pb-6">
                <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#003974] font-bold mb-2">
                  Mon Panier
                </h2>
                <p className="text-xs uppercase tracking-widest text-[#695d46] font-semibold">
                  {nombreTotalArticles} {nombreTotalArticles === 1 ? 'Article Sélectionné' : 'Articles Sélectionnés'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* 📋 قائمة المنتجات الحقيقية */}
                <div className="lg:col-span-8 space-y-6">
                  <AnimatePresence mode="popLayout">
                    {articles.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group flex flex-col md:flex-row gap-6 pb-6 border-b border-[#c2c6d3] items-center md:items-start"
                      >
                        
                        {/* صورة المنتج */}
                        <div className="w-full md:w-44 h-44 overflow-hidden bg-white border border-[#c2c6d3] rounded-2xl flex-shrink-0 p-1">
                          <img 
                            src={item.image} 
                            alt={item.nom} 
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>

                        {/* تفاصيل المنتج */}
                        <div className="flex-1 flex flex-col justify-between h-44 w-full py-1">
                          <div className="flex justify-between items-start w-full">
                            <div>
                              <span className="text-[9px] uppercase tracking-widest font-black px-2 py-1 bg-[#f2e0c3] text-[#504530] rounded-sm mb-2 inline-block">
                                {item.categorie_id || 'Artisanat'}
                              </span>
                              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#003974] mb-1">
                                {item.nom}
                              </h3>
                              <p className="text-xs text-[#695d46] font-medium italic">
                                Par {item.artisan_nom || 'Maâlem Expert'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-['Inter'] text-base font-bold text-[#1a1c1b]">
                                {item.prix.toLocaleString('fr-MA')} DH
                              </p>
                            </div>
                          </div>

                          {/* أزرار التحكم في الكمية والحذف */}
                          <div className="flex items-center justify-between mt-auto w-full">
                            <div className="flex items-center border border-[#727782] px-1.5 py-0.5 rounded-full bg-white shadow-sm">
                              <button 
                                onClick={() => modifierQuantite(item.id, item.quantite - 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#424751] hover:text-[#ba1a1a] transition-colors font-bold cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 font-['Inter'] text-sm font-black text-[#1a1c1b]">
                                {item.quantite}
                              </span>
                              <button 
                                onClick={() => modifierQuantite(item.id, item.quantite + 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#424751] hover:text-[#003974] transition-colors font-bold cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* زر حذف المنتج */}
                            <button 
                              onClick={() => retirerDuPanier(item.id)}
                              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#424751] hover:text-[#ba1a1a] transition-colors cursor-pointer p-2 rounded-xl hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* 🧾 ملخص الطلب الفخم (Résumé) */}
                <div className="lg:col-span-4">
                  <div className="bg-white p-8 border border-[#c2c6d3] rounded-3xl sticky top-32 shadow-sm">
                    <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1c1b] mb-6 border-b border-[#c2c6d3] pb-4">
                      Résumé de la Commande
                    </h3>
                    
                    <div className="space-y-4 mb-6 font-['Inter'] text-sm">
                      <div className="flex justify-between text-[#424751]">
                        <span className="font-medium">Sous-total</span>
                        <span className="font-semibold">{sousTotal.toLocaleString('fr-MA')} DH</span>
                      </div>
                      <div className="flex justify-between text-[#424751]">
                        <span className="font-medium">Livraison (Maroc)</span>
                        <span className="font-semibold">{fraisLivraison} DH</span>
                      </div>
                      <div className="flex justify-between text-[#424751]">
                        <span className="font-medium">TVA (20%)</span>
                        <span className="font-semibold">{tva.toLocaleString('fr-MA')} DH</span>
                      </div>
                      
                      <div className="pt-4 border-t border-[#c2c6d3] flex justify-between items-end">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#1a1c1b]">Total TTC</span>
                        <div className="text-right">
                          <span className="font-['Playfair_Display'] text-2xl font-black text-[#003974] block">
                            {total.toLocaleString('fr-MA')} DH
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* أزرار التوجيه */}
                    <div className="space-y-3">
                      <button 
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-[#003974] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer group shadow-md shadow-[#003974]/10"
                      >
                        Passer à la caisse
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => navigate('/catalog')}
                        className="w-full border border-[#695d46] text-[#695d46] py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#f2e0c3]/20 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Continuer vos achats
                      </button>
                    </div>

                    {/* ضمانات الأمان الإضافية لـ PFA */}
                    <div className="mt-6 space-y-4 border-t border-[#f4f4f2] pt-4">
                      <div className="flex items-start gap-3 text-[#424751]">
                        <ShieldCheck className="w-5 h-5 text-[#695d46] shrink-0 mt-0.5" />
                        <p className="text-[10px] uppercase font-bold tracking-wider leading-relaxed">
                          Paiement 100% sécurisé et protection de vos données
                        </p>
                      </div>
                      <div className="flex items-start gap-3 text-[#424751]">
                        <Truck className="w-5 h-5 text-[#695d46] shrink-0 mt-0.5" />
                        <p className="text-[10px] uppercase font-bold tracking-wider leading-relaxed">
                          Livraison assurée par nos partenaires partout au Maroc
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 🗺️ الـ Footer الموحدة د البروجي */}
      <Footer />
    </div>
  );
};

export default Cart;