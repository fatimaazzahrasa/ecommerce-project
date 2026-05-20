import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  LayoutGrid, 
  UserCheck, 
  Settings, 
  Bell, 
  Menu, 
  LogOut,
  Package,
  ShoppingBag,
  LineChart,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // 👈 تأكدي أن المسار راجع خطوة واحدة للوراء من مجلد layouts
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  // 🎯 توحيد الـ Role لتفادي صراعات الحروف الكبيرة والصغيرة مع Django
  const userRole = user?.role?.toUpperCase();
  const isAdmin = userRole === 'ADMIN';

  // 📝 استخراج إسم المستخدم المتوافق مع Django Serializer
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}` : (user?.username || 'Artisan');

  // 🔗 1️⃣ الـ Routes والـ Labels الخاصة بالـ Admin (نفس الـ Template ديالك)
  const adminMenuItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/categories', icon: LayoutGrid, label: 'Categories' },
    { to: '/admin/approvals', icon: UserCheck, label: 'Artisan Approval' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  // 🔗 2️⃣ الـ Routes والـ Labels الخاصة بالـ Artisan 
  const artisanMenuItems = [
    { to: '/artisan/dashboard', icon: LayoutDashboard, label: 'Tableau de Bord', mobileLabel: 'Dashboard' },
    { to: '/artisan/products', icon: Package, label: 'Mes Produits', mobileLabel: 'Produits' },
    { to: '/artisan/orders', icon: ShoppingBag, label: 'Commandes', mobileLabel: 'Commandes' },
    { to: '/artisan/analytics', icon: LineChart, label: 'Statistiques', mobileLabel: 'Stats' },
    { to: '/artisan/settings', icon: Settings, label: 'Paramètres', mobileLabel: 'Settings' },
  ];

  // الكود كيشوف الـ Role وكيختار الـ Menu المناسب تلقائياً
  const menuItems = isAdmin ? adminMenuItems : artisanMenuItems;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row font-['Inter']">
      
      {/* =========================================================
          1️⃣ DESKTOP SIDEBAR (NavigationDrawer Shell)
         ========================================================= */}
      <aside className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant z-50 py-6">
        
        {/* Profile Section ديناميكية */}
        <div className="px-6 pb-6 mb-6 border-b border-outline-variant flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant bg-surface-container-highest flex-shrink-0 flex items-center justify-center font-bold text-primary text-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-['Manrope'] font-bold text-md text-secondary truncate">
              {isAdmin ? 'Artisan Portal' : displayName}
            </p>
            <p className="font-['Inter'] text-xs text-on-surface-variant truncate">
              {isAdmin ? 'Shop Manager' : 'Artisan / Boutique'}
            </p>
            <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-[10px] bg-primary text-on-primary font-bold">
              {isAdmin ? 'Admin Active' : 'Atelier Active'}
            </span>
          </div>
        </div>

        {/* Nav Links كيتشارجاو على حساب الـ Role */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-transform hover:translate-x-1 font-['Manrope'] font-semibold",
                isActive
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-variant"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* زر تسجيل الخروج موحد */}
        <div className="px-2 mt-auto">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 text-error hover:bg-error-container/20 rounded-lg transition-all font-['Manrope'] font-semibold border-t border-outline-variant pt-4"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* =========================================================
          2️⃣ MAIN CONTENT CANVAS (Header + View Page)
         ========================================================= */}
      <div className="flex-1 md:ml-72 min-h-screen flex flex-col w-full max-w-full pb-16 md:pb-0">
        
        {/* TopAppBar (Header ديناميكي) */}
        <header className="flex justify-between items-center w-full px-4 md:px-10 h-16 bg-surface border-b border-outline-variant sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-on-surface-variant"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* إسم الهيدر كيتبدل تلقائياً */}
            <h1 className="font-['Manrope'] text-xl md:text-2xl font-extrabold text-primary">
              {isAdmin ? 'Artisan Marketplace' : 'Mon Atelier Numérique'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            
            <div className="h-6 w-[1px] bg-outline-variant hidden sm:block"></div>
            
            {/* زر رؤية المتجر كيبان عند الحرفي والأدمن للرجوع للرئيسية */}
            <Link 
              to="/" 
              className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full text-xs font-bold text-primary hover:bg-primary hover:text-on-primary transition-all border border-outline-variant"
            >
              <Home className="w-3.5 h-3.5" />
              Voir la Boutique
            </Link>

            <div className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container-highest flex items-center justify-center font-bold text-xs text-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Body: فين كيتشارجاو الصفحات الداخليين */}
        <main className="p-4 md:p-10 max-w-[1440px] mx-auto w-full flex-1">
          <Outlet /> 
        </main>
      </div>

      {/* =========================================================
          3️⃣ MOBILE BOTTOM NAVIGATION (ديناميكي للموبايل)
         ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl text-[10px] font-medium text-on-surface-variant">
        {menuItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center rounded-full px-3 py-1 active:scale-90 transition-all duration-200",
              isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant"
            )}
          >
            <item.icon className="w-5 h-5 mb-0.5" />
            <span className="font-['Inter'] text-[10px]">
              {isAdmin ? item.label : (item.mobileLabel || item.label)}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* 📱 Mobile Drawer Sidebar (القائمة الجانبية ف التيليفون) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-72 bg-surface-container-low z-[70] p-6 shadow-xl flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant">
                <span className="font-['Manrope'] font-black text-lg text-primary">
                  {isAdmin ? 'ArtisanHub Admin' : 'Atelier Portal'}
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-surface-container rounded-lg text-on-surface-variant">
                  <Menu className="w-5 h-5 rotate-90" />
                </button>
              </div>
              <nav className="space-y-2 flex-1">
                {menuItems.map((item) => (
                  <NavLink 
                    key={item.label}
                    to={item.to} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 p-3 rounded-lg font-['Manrope'] font-semibold transition-all",
                      isActive ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant hover:bg-surface-variant"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-error text-white rounded-xl font-['Manrope'] font-bold text-sm"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;