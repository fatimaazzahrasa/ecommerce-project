import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Store, LogOut, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
// 🚀 تصحيح الـ Import ديال Motion
import { motion, AnimatePresence } from 'framer-motion';
const Navbar = () => {
  const { nombreTotalArticles } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🗺️ توحيد المسارات على حساب الـ PFA والـ Router ديالك
  const navigations = [
    { label: 'Accueil', path: '/' },
    { label: 'Boutique', path: '/catalog' },
    
    ...(isAuthenticated && user?.role === 'client' ? [{ label: 'Mes Commandes', path: '/client/orders' }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 📝 استخراج الاسم المتوافق مع Django
  const displayName = user?.first_name ? `${user.first_name}` : (user?.username || user?.name || 'Artisan');

  return (
    <nav className={cn(
      "sticky top-0 z-[100] transition-all duration-300",
      isScrolled 
        ? "bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 h-16" 
        : "bg-surface h-20 border-b border-outline-variant/10"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center text-on-surface">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-12 h-full">
            <RouterLink to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary transition-transform group-hover:scale-105 shadow-lg shadow-primary/20">
                <Store className="w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-on-surface">MarocArtisan</span>
            </RouterLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 h-full">
              {navigations.map((nav) => (
                <RouterLink 
                  key={nav.path} 
                  to={nav.path} 
                  className={cn(
                    "relative text-[13px] font-black uppercase tracking-[0.2em] transition-colors h-full flex items-center group",
                    pathname === nav.path ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {nav.label}
                  {pathname === nav.path && (
                    <motion.div 
                       layoutId="nav-underline"
                       className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
                    />
                  )}
                </RouterLink>
              ))}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-6 h-full">
             <div className="relative group mr-2">
                <Search className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors cursor-pointer" />
             </div>

             <div className="h-6 w-px bg-outline-variant/30" />

             {/* 🛒 زِر الـ Panier متوافق مع كود السلة */}
             <RouterLink to="/panier" className="relative p-2.5 bg-surface-container rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all active:scale-95 border border-outline-variant/20">
              <ShoppingCart className="w-5 h-5" />
              {nombreTotalArticles > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#003974] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface shadow-lg">
                  {nombreTotalArticles}
                </span>
              )}
            </RouterLink>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <RouterLink 
                  to={user?.role === 'artisan' ? '/artisan/dashboard' : '/client/orders'}
                  className="flex items-center gap-3 p-1.5 pr-5 bg-primary/5 rounded-full border border-primary/20 hover:bg-primary hover:text-on-primary transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-black text-sm group-hover:bg-on-primary group-hover:text-primary transition-colors">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{displayName}</span>
                </RouterLink>
                
                <button 
                  onClick={handleLogout}
                  className="p-2.5 bg-surface-container rounded-xl text-on-surface-variant hover:text-error hover:bg-error/5 transition-all active:scale-95 border border-outline-variant/20"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <RouterLink to="/login" className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">
                  Connexion
                </RouterLink>
                <RouterLink to="/Register" className="btn-primary py-2.5 px-6 text-[11px] uppercase tracking-[0.2em] font-black shadow-lg shadow-primary/10">
                  S'inscrire
                </RouterLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button 
            className="md:hidden p-3 bg-surface-container rounded-xl" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-outline-variant/30 shadow-2xl p-6 overflow-hidden z-50"
          >
            <div className="space-y-4">
               {navigations.map((nav) => (
                <RouterLink 
                  key={nav.path} 
                  to={nav.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 text-lg font-black text-on-surface bg-surface-container rounded-2xl active:scale-95 transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  {nav.label}
                </RouterLink>
              ))}
              
              <div className="pt-6 border-t border-outline-variant/30 grid grid-cols-2 gap-4">
                <RouterLink 
                  to="/panier" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex flex-col items-center gap-2 p-5 bg-primary/5 rounded-2xl text-primary font-black"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Panier ({nombreTotalArticles})
                </RouterLink>

                {isAuthenticated ? (
                   <button 
                    onClick={handleLogout} 
                    className="flex flex-col items-center gap-2 p-5 bg-error/5 rounded-2xl text-error font-black"
                   >
                    <LogOut className="w-6 h-6" />
                    Quitter
                   </button>
                ) : (
                  <RouterLink 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex flex-col items-center gap-2 p-5 bg-surface-container-high rounded-2xl text-on-surface font-black"
                  >
                    <User className="w-6 h-6" />
                    Connexion
                  </RouterLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// 🚀 التصدير الافتراضي باش يقراه الـ MainLayout
export default Navbar;