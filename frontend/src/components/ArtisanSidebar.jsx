import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ArtisanSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: 'Catalog', path: '/artisan/catalog', icon: '🏬' },
    { name: 'My Workshop', path: '/artisan/workshop', icon: '🛠️' },
    { name: 'Dashboard', path: '/artisan/dashboard', icon: '📊' },
    { name: 'Analytics', path: '/artisan/analytics', icon: '📈' },
    { name: 'Orders', path: '/artisan/orders', icon: '📦' },
  ];

  return (
    <>
      {/* 1️⃣ هاد الـ Overlay كيبان غي ف التلفون باش فاش يبرك الصانع برا السايدبار يتسد */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* 2️⃣ الـ Sidebar تسترخي بـ classes ديال Responsive (-translate-x-full lg:translate-x-0) */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#f9f9f7] h-full w-80 border-r border-[#c2c6d3] px-8 py-10 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* زر إغلاق السايدبار - كيبان غي ف التلفون */}
        <div className="flex justify-between items-center mb-12 lg:block">
          <span className="font-['Playfair_Display'] text-2xl font-bold text-[#003974]">
            Articent Pro
          </span>
          <button onClick={toggleSidebar} className="text-2xl lg:hidden cursor-pointer">
            ✕
          </button>
        </div>
        
        {/* Profile */}
        <div className="flex items-center gap-4 mb-10 w-full">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#e2e3e1] border border-[#c2c6d3]">
            <img 
              alt="Ahmed Al-Fassi" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1a1c1b]">Ahmed Al-Fassi</h3>
            <p className="text-xs text-[#424751] uppercase tracking-wider">Master Weaver</p>
          </div>
        </div>

        {/* Links */}
        <nav className="w-full space-y-2 flex-grow">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={toggleSidebar} // يتسد السايدبار فاش يختار صفحة ف التلفون
              className={`flex items-center gap-4 rounded-full px-4 py-3 transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-[#efdec0] text-[#6d614a] font-bold'
                  : 'text-[#424751] hover:bg-[#e2e3e1]'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#c2c6d3] pt-6">
          <button className="flex items-center gap-4 text-[#424751] hover:text-[#003974] transition-colors w-full text-left font-bold text-xs uppercase tracking-widest cursor-pointer">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}