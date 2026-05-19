import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
// 🚀 تصحيح الـ Import ديال Motion
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { ajouterAuPanier } = useCart();

  // 📦 التأكد من الـ Stock: كيدعم 'Rupture' أو إيلا كانت الكمية ف Django كتساوي 0
  const estEnRupture = product.statut === 'Rupture' || product.quantite === 0 || product.stock === 0;

  // 🖼️ معالجة رابط الصورة باش يخدم مع Django Media Server
  const getImageUrl = (imgTrack) => {
    if (!imgTrack) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600'; // صورة احتياطية
    if (imgTrack.startsWith('http')) return imgTrack;
    // إيلا كان السيرفر محلي د Django زيد المسار د الـ Backend
    return `http://127.0.0.1:8000${imgTrack}`;
  };

  // 📝 استخراج اسم الحرفي بأمان
  const artisanName = product.artisan_nom || product.artisan?.username || 'Artisan';

  return (
    <div className="group card-basic hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-white border border-outline-variant/20 rounded-3xl overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        {/* توحيد المسار د التفاصيل على حساب الـ routing د البروجي */}
        <Link to={`/catalog/${product.id}`}>
          <img 
            src={getImageUrl(product.image)} 
            alt={product.nom}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
              estEnRupture && "grayscale brightness-75"
            )}
          />
        </Link>
        
        {estEnRupture && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="bg-white text-on-surface px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
              Rupture de Stock
            </span>
          </div>
        )}

        <button className="absolute top-4 right-4 p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary active:scale-90 border border-white/20">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex flex-col h-56 justify-between">
        <div>
          <div className="mb-2">
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">
               Atelier: {artisanName.split(' ')[0]}
            </span>
          </div>
          
          <Link to={`/catalog/${product.id}`} className="hover:text-primary transition-colors">
            <h3 className="text-lg font-bold text-on-surface line-clamp-1 mb-1 tracking-tight">
              {product.nom}
            </h3>
          </Link>
          <p className="text-xs text-on-surface-variant font-medium line-clamp-3 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
          <span className="text-xl font-black text-on-surface tracking-tighter">
            {product.prix ? product.prix.toLocaleString('fr-MA') : '0'} DH
          </span>
          <button 
            disabled={estEnRupture}
            onClick={() => ajouterAuPanier(product)}
            className={cn(
              "p-3 rounded-xl transition-all shadow-lg active:scale-90 cursor-pointer",
              estEnRupture 
                ? "bg-surface-container-high text-outline cursor-not-allowed" 
                : "bg-primary text-on-primary hover:shadow-primary/30 shadow-primary/10"
            )}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 🚀 تصدير افتراضي متوافق
export default ProductCard;