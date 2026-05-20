import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51P...ضع_مفتاحك_هنا');

// 📐 Layouts المتطورة
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// 🌐 Public & Client Pages
import Home from "./pages/Home";     
import CatalogPage from './pages/CatalogPage';
import ProductDetail from './pages/ProductDetail';
import Panier from './pages/Panier';       
import Login from './pages/Login';    
import Register from './pages/Register'; 
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

// 👑 Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import CreateUser from './pages/admin/CreateUser';

// 🔨 Artisan Pages
import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import ArtisanProducts from './pages/artisan/ArtisanProducts';
import ArtisanOrders from './pages/artisan/ArtisanOrders';
import CreateProduct from './pages/artisan/CreateProduct';

// 🔐 الـ Guard لّي كيحمي المسارات على حساب الـ Role
const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center font-manrope font-bold text-primary bg-surface gap-6">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-on-surface uppercase tracking-[0.3em] text-xs font-black">Chargement de l'Atelier...</p>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  const userRole = user?.role?.toUpperCase();
  const requiredRole = role?.toUpperCase();

  // إذا كان المستخدم ماشي أدمن وماشي هو الـ Role المطلوب، كنصيفطوه لبلايصتو
  if (userRole !== 'ADMIN' && userRole !== requiredRole) {
    if (userRole === 'ARTISAN') return <Navigate to="/artisan/dashboard" replace />;
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
            
            {/* =========================================================
                1️⃣ الـ المسارات العامة والـ Clients (MainLayout)
               ========================================================= */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/panier" element={<Panier />} />
              
              {/* مسارات محمية خاصة بالـ Client العادي */}
              <Route path="/orders" element={<ProtectedRoute role="client"><OrdersPage /></ProtectedRoute>} />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute role="client">
                    <Elements stripe={stripePromise}>
                      <CheckoutPage />
                    </Elements>
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* =========================================================
                2️⃣ صفحات الدخول والتسجيل (بدون أي Layout)
               ========================================================= */}
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />

            {/* =========================================================
                3️⃣ لوحة تحكم الـ Artisan (DashboardLayout المحمي)
               ========================================================= */}
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

            {/* =========================================================
                4️⃣ لوحة تحكم الـ Admin (نفس الـ DashboardLayout المحمي للأدمن)
               ========================================================= */}
            <Route 
              element={
                <ProtectedRoute role="admin">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users/create" element={<CreateUser />} />
              <Route path="/admin/verification" element={<div className="p-10 font-bold bg-surface-container rounded-3xl border border-outline-variant/30 text-on-surface">Validation des Artisans</div>} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/categories" element={<div className="p-10 font-bold bg-surface-container rounded-3xl border border-outline-variant/30 text-on-surface">Gestion des Catégories</div>} />
              <Route path="/admin/approvals" element={<div className="p-10 font-bold bg-surface-container rounded-3xl border border-outline-variant/30 text-on-surface">Approbations</div>} />
              <Route path="/admin/settings" element={<div className="p-10 font-bold bg-surface-container rounded-3xl border border-outline-variant/30 text-on-surface">Paramètres Généraux</div>} />
            </Route>

            {/* =========================================================
                5️⃣ الـ Redirection ف حالة خطأ ف الـ Path
               ========================================================= */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;