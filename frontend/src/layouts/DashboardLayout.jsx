import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  Bell, 
  Users,
  LogOut,
  Store,
  LineChart,
  HelpCircle,
  Menu,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
// 🚀 تـصحيح الـ Import ديال Motion باش يخدم مع الـ package الحقيقي
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // قادينا الـ السميات ديال الـ Routes على حساب بروجيك
  const artisanMenuItems = [
    { to: '/artisan/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/artisan/products', icon: Package, label: 'Mes Produits' },
    { to: '/artisan/orders', icon: ShoppingBag, label: 'Commandes' },
    { to: '/artisan/analytics', icon: LineChart, label: 'Statistiques' },
    { to: '/artisan/settings', icon: Settings, label: 'Paramètres' },
  ];

  const adminMenuItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
    { to: '/admin/users', icon: Users, label: 'Artisans & Clients' },
    { to: '/admin/verification', icon: HelpCircle, label: 'Vérifications' },
    { to: '/admin/settings', icon: Settings, label: 'Système' },
  ];

  const menuItems = isAdmin ? adminMenuItems : artisanMenuItems;

  // 📝 استخراج الإسم المتوافق مع Django Serializer
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}` : (user?.username || 'Artisan');

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-surface-container-low border-r border-outline-variant/30 h-screen sticky top-0">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 text-primary group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Store className="w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tighter text-on-surface">Artisan Portal</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-5 text-[10px] font-black uppercase tracking-[0.3em] text-outline mb-4">Menu Principal</p>
          {menuItems.map((item) => (
            <NavLink 
              key={item.label}
              to={item.to} 
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all group",
                isActive 
                  ? "bg-primary text-on-primary shadow-xl shadow-primary/10" 
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-outline-variant/30 bg-surface-container-low/50">
          <div className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-outline-variant/20 mb-6">
             <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black border-2 border-primary/20 shrink-0">
                {displayName.charAt(0).toUpperCase()}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-black text-on-surface truncate">{displayName}</p>
                <p className="text-[10px] text-outline font-bold uppercase tracking-[0.1em] truncate">{user?.role || 'artisan'}</p>
             </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black text-outline hover:bg-error/10 hover:text-error transition-all group active:scale-95"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Desktop */}
        <header className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-3 bg-surface-container rounded-xl text-on-surface"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black text-on-surface tracking-tight">
                {isAdmin ? 'Administration Centralisée' : 'Atelier Numérique'}
              </h1>
              <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">MarocArtisan Hub • 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-3 bg-surface-container text-on-surface-variant hover:text-primary rounded-xl transition-all border border-outline-variant/20">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full ring-4 ring-surface"></span>
            </button>
            <div className="h-10 w-[1px] bg-outline-variant/30 mx-2 hidden sm:block"></div>
            <Link to="/" className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-surface-container-high rounded-full text-xs font-black text-on-surface hover:bg-primary hover:text-on-primary transition-all group border border-outline-variant/30">
               <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
               Voir la Boutique
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 bg-surface">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsMobileMenuOpen(false)}
               className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-80 bg-surface z-[70] p-8 shadow-2xl md:hidden"
            >
               <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                    <Store className="w-8 h-8 text-primary" />
                    <span className="font-black text-xl tracking-tighter">ArtisanHub</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-surface-container rounded-lg">
                    <LogOut className="w-5 h-5 rotate-180" />
                  </button>
               </div>

               <nav className="space-y-4">
                  {menuItems.map((item) => (
                    <Link 
                      key={item.label}
                      to={item.to} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl font-bold text-on-surface"
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
               </nav>

               <div className="absolute bottom-8 left-8 right-8">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-4 py-4 bg-error text-on-error rounded-2xl font-black text-sm uppercase tracking-widest"
                  >
                    Déconnexion
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;