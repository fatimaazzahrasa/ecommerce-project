import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/'; 

// هنا كنصدرو الـ instance باش نقدروا نستعملوه بـ الأقواس
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==========================================
// 🔑 Auth API (Authentification)
// ==========================================

export const loginRequest = async (username, password) => {
  const response = await api.post('users/login/', { username, password });
  if (response.data.access) {
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data;
};

export const registerRequest = async (userData) => {
  const response = await api.post('users/register/', userData);
  return response.data;
};

// ==========================================
// 📦 Products API (على حساب الـ ViewSet د ديانغو)
// ==========================================

export const fetchProductsApi = async () => {
  // 🚨 تصحيح: رجعناها products/ باش تطابق الباكند
  const response = await api.get('products/');
  return response.data; 
};

// 🚨 تصحيح: رجعنا سميتها fetchCategoriesApi (بالـ s) باش يقراها الكتالوج ديريكت
export const fetchCategoriesApi = async () => {
  const response = await api.get('categories/');
  return response.data;
};

export const fetchProductByIdApi = async (id) => {
  // 🚨 تصحيح: رجعناها products/
  const response = await api.get(`products/${id}/`);
  return response.data;
};

export const createProductApi = async (productData) => {
  // 🚨 تصحيح: رجعناها products/
  // ملاحظة: إيلا كانت فيها صورة، خاص نصيفطو الـ FormData ديريكت ف الـ Component
  const response = await api.post('products/', productData);
  return response.data;
};

export const updateProductApi = async (id, productData) => {
  // 🚨 تصحيح: رجعناها products/
  const response = await api.put(`products/${id}/`, productData);
  return response.data;
};

export const deleteProductApi = async (id) => {
  // 🚨 تصحيح: رجعناها products/
  await api.delete(`products/${id}/`);
  return true;
};

// ==========================================
// 🛒 Orders & Cart API
// ==========================================

export const fetchOrdersApi = async () => {
  const response = await api.get('orders/');
  return response.data;
};

export const createOrderApi = async (orderData) => {
  const response = await api.post('orders/', orderData);
  return response.data;
};

// ==========================================
// 💳 Stripe Payment API
// ==========================================

export const createPaymentIntentApi = async (commandeId, montant) => {
  const response = await api.post('payments/create-intent/', {
    commande: commandeId,
    montant: montant
  });
  return response.data;
};

// ==========================================
// 👑 Admin API
// ==========================================

export const fetchUsersApi = async () => {
  const response = await api.get('admin/users/');
  return response.data;
};