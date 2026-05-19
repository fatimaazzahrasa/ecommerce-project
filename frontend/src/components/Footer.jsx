import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Globe, Share2, MessageCircle } from 'lucide-react'; // 👈 استيراد الأيقونات المستقرة والآمنة

const Footer = () => {
  return (
    <footer className="bg-surface-container-highest text-on-surface py-20 border-t border-outline-variant/30 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Store className="w-6 h-6 text-on-primary" />
              </div>
              <span className="font-black text-2xl tracking-tighter">MarocArtisan</span>
            </Link>
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed max-w-xs">
              Curation d'objets uniques faits main par nos artisans locaux. Qualité, héritage et durabilité dans chaque pièce.
            </p>
          </div>

          {/* Shop Links */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Boutique</h4>
            <ul className="space-y-4">
              <li><Link to="/catalog" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Tous les Produits</Link></li>
              <li><Link to="/catalog" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Céramique</Link></li>
              <li><Link to="/catalog" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Tapis & Textiles</Link></li>
              <li><Link to="/catalog" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Maroquinerie</Link></li>
            </ul>
          </div>

          {/* Artisans Links */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Artisans</h4>
            <ul className="space-y-4">
              <li><Link to="/Register?role=artisan" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Devenir Vendeur</Link></li>
              <li><Link to="/login" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Portail Artisan</Link></li>
              <li><Link to="#" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Guide de Vente</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Contact</h4>
            <ul className="space-y-4">
               <li className="text-sm font-bold text-on-surface-variant">contact@marocartisan.ma</li>
               <li className="text-sm font-bold text-on-surface-variant">+212 5XX XX XX XX</li>
            </ul>
            {/* الأيقونات المعدلة لوسائل التواصل */}
            <div className="flex gap-4 pt-2">
               {[Globe, Share2, MessageCircle, Mail].map((Icon, i) => (
                 <div key={i} className="p-3 bg-surface rounded-xl border border-outline-variant/30 hover:text-primary hover:border-primary/50 cursor-pointer transition-all active:scale-90">
                    <Icon className="w-5 h-5" />
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black uppercase tracking-widest text-outline">
          <p>© 2026 MarocArtisan. Tous droits réservés.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-primary transition-colors">Confidentialité</Link>
            <Link to="#" className="hover:text-primary transition-colors">Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🚀 التصدير الإفتراضي لضمان التوافق التام مع الـ Layouts
export default Footer;