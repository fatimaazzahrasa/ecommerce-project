import React from 'react';
import { Outlet } from 'react-router-dom';
// 🚀 استدعاء مرن للـ Components (تأكد من وجود هاد الملفات ف مجلد components)
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* الـ Navbar الرئيسي د الموقع */}
      <Navbar />
      
      {/* البلاصة فين كيتشارجاو الصفحات (Home, Products, Shop...) */}
      <main className="flex-grow pb-24 md:pb-0">
        <Outlet />
      </main>
      
      {/* الـ Footer التحتاني */}
      <Footer />
      
      {/* المنيو السفلي الخاص بالهواتف */}
      <MobileNav />
    </div>
  );
};

export default MainLayout;