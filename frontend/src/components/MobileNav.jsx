import React from 'react';
import { Home, Store, Receipt, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils'; // 👈 هاد المسار صحيح حيت كاين وسط src/components/

const MobileNav = () => {
  const iconClass = "w-5 h-5 transition-all duration-200";
  const labelClass = "text-[10px] font-bold mt-1 tracking-wide";

  const items = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/catalog', icon: Store, label: 'Boutique' },
    { to: '/orders', icon: Receipt, label: 'Commandes' },
    { to: '/login', icon: User, label: 'Profil' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-2xl">
      {items.map((item) => (
        <NavLink 
          key={item.label}
          to={item.to}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[64px]",
            isActive 
              ? "text-primary scale-105 font-black" 
              : "text-slate-500 hover:text-slate-800 active:scale-95"
          )}
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn(iconClass, isActive && "stroke-[2.5px]")} />
              <span className={labelClass}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav; // 👈 درنا الـ export الافتراضي عشان يقرأه ملف MainLayout بلا مشاكل