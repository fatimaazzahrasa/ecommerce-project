import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// allowedRoles: هي قائمة الأدوار لّي مسموح ليها تشوف الصفحة (مثلا: ['artisan'] أو ['admin'])
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  // 1️⃣ إلا كان الـ Context مازال تيقرا البيانات من الـ localStorage، نتسناوه وما نديرو والو
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm uppercase tracking-widest text-[#695d46]">Chargement...</div>;
  }

  // 2️⃣ إلا كان المستخدم ما مسجلش كاع، نصيفطوه لـ Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ إلا كان مسجل ولكن الـ Role ديالو ما كاينش فـ القائمة المسموح ليها (مثلا Client باغي يدخل لـ Artisan)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />; // نرجعوه لصفحة الاستقبال
  }

  // 4️⃣ إلا داز من هاد الشروط كاملين بسلام، نخلّيوه يشوف الصفحة (الـ Dashboard)
  return children;
}