import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// 💳 إعداد وتجهيز Stripe الحقيقي لحماية الـ Checkout
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// 🔑 ضع هنا مفتاح الـ Public Key الخاص بـ Stripe (مثال للمفتاح التجريبي)
const stripePromise = loadStripe('pk_test_51P...ضع_مفتاحك_هنا');

// 📐 Layouts المتطورة
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// 📁 الصفحات العامة والخاصة بالـ Client (تأكد من مطابقة أسماء الملفات في مجلد pages)
import Home from "./pages/Home";     // أو Home حسب مشروعك الحالي
import CatalogPage from './pages/CatalogPage';
import ProductDetail from './pages/ProductDetail';
import Panier from './pages/Panier';       // أو Panier حسب مشروعك الحالي
import Login from './pages/Login';     // أو Login
import Register from './pages/Register'; // أو Register
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

// 📁 صفحات الـ Artisan والـ Admin المنظمة داخل مجلداتها
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import ArtisanProducts from './pages/artisan/ArtisanProducts';
import ArtisanOrders from './pages/artisan/ArtisanOrders';
import CreateProduct from './pages/artisan/CreateProduct';

// 🛡️ الـ ProtectedRoute الذكي والآمن من الكراش
const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center font-manrope font-bold text-primary bg-surface gap-6">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-on-surface uppercase tracking-[0.3em] text-xs font-black">Chargement de l'Atelier...</p>
    </div>
  );
  
  if (!user && role) return <Navigate to="/login" replace />;
  
  if (role && user && user.role !== role && user.role !== 'admin') {
    // توجيه ذكي وسريع في حالة الدخول لرابط غير مسموح به
    if (user.role === 'artisan') return <Navigate to="/artisan/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            
            {/* 🌐 المسارات العامة (تظهر لجميع الزوار مع الـ Navbar والـ Footer داخل MainLayout) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/panier" element={<Panier />} />
              
              {/* 🛒 مسارات محمية خاصة بالـ Client العادي */}
              <Route path="/orders" element={<ProtectedRoute role="client"><OrdersPage /></ProtectedRoute>} />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute role="client">
                    {/* 🔐 تغليف صفحة الدفع بـ عناصر Stripe الحقيقية */}
                    <Elements stripe={stripePromise}>
                      <CheckoutPage />
                    </Elements>
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* 🔑 صفحات التسجيل والدخول بدون Layout عام */}
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />

            {/* 🔨 لوحة تحكم الحرفي (Artisan Dashboard) مع الـ DashboardLayout والـ Sidebar */}
            <Route 
              element={
                <ProtectedRoute role="artisan">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
              <Route path="/artisan/products" element={<ArtisanProducts />} />
              <Route path="/artisan/products/new" element={<CreateProduct />} />
              <Route path="/artisan/orders" element={<ArtisanOrders />} />
              <Route path="/artisan/settings" element={<div className="p-10 font-bold bg-surface-container rounded-3xl border border-outline-variant/30 text-on-surface">Paramètres de l'Atelier</div>} />
            </Route>

            {/* 👑 لوحة تحكم المدير (Admin Dashboard) */}
            <Route 
              element={
                <ProtectedRoute role="admin">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/verification" element={<div className="p-10 font-bold bg-surface-container rounded-3xl border border-outline-variant/30 text-on-surface">Validation des Artisans</div>} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* 🔄 إرجاع الزائر للصفحة الرئيسية إذا أخطأ في كتابة أي مسار */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;