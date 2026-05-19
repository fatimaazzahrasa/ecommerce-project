import axios from 'axios';

// 🌐 الرابط الرئيسي ديال Django Backend (بدلو إيلا كان عندك port آخر)
const API_BASE_URL = 'http://127.0.0.1:8000/api/'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔒 دالة سحرية باش تلصق الـ Token د الـ Login (JWT) ف كاع الـ Requests اللي جايين
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ==========================================
// 🔑 Auth API (Authentification)
// ==========================================

export const loginRequest = async (username, password) => {
  // Django غالباً كيحتاج username و password ف الـ JWT Token
  const response = await api.post('token/', { username, password });
  // response.data غاتكون فيها الـ access token والـ refresh token والـ user info
  if (response.data.access) {
    localStorage.setItem('token', response.data.access);
  }
  return response.data;
};

export const registerRequest = async (userData) => {
  // userData غاتمشي على حساب الـ UserSerializer (username, email, password, role...)
  const response = await api.post('users/register/', userData);
  return response.data;
};

// ==========================================
// 📦 Products API (على حساب ProduitSerializer)
// ==========================================

export const fetchProductsApi = async () => {
  const response = await api.get('product/');
  return response.data; // كايرجع List ديال الـ Products اللي فيهم 'prix', 'categorie_name' ...
};

export const fetchCategorieApi = async () => {
  const response = await api.get('categories/');
  return response.data;
};

export const fetchProductByIdApi = async (id) => {
  const response = await api.get(`product/${id}/`);
  return response.data;
};

export const createProductApi = async (productData) => {
  // productData كتصيفط فيها: nom, description, prix, stock, categorie, artisan
  // رد البال: إيلا كانت فيها صورة، خاص نخدمو بـ FormData ف الـ component (غانقادوها ف بلاصتها)
  const response = await api.post('product/', productData);
  return response.data;
};

export const updateProductApi = async (id, productData) => {
  const response = await api.put(`product/${id}/`, productData);
  return response.data;
};

export const deleteProductApi = async (id) => {
  await api.delete(`product/${id}/`);
  return true;
};

// ==========================================
// 🛒 Orders & Cart API (على حساب Commande & Panier Serializers)
// ==========================================

export const fetchOrdersApi = async () => {
  // الـ Backend كيعرف الـ User من الـ Token، غايرجع الـ Orders د الصانع أو د الكليان على حساب شكون مـكونكطي
  const response = await api.get('orders/');
  return response.data; // كيرجع البيانات مقادة فيها الـ lignes و الـ prix_total و الـ statut
};

export const createOrderApi = async (orderData) => {
  // orderData غاتمشي لـ Django باش تـكريي Commande حقيقية مورا ما يخلص بـ Stripe
  const response = await api.post('orders/', orderData);
  return response.data;
};

// ==========================================
// 💳 Stripe Payment API (على حساب PaiementSerializer)
// ==========================================

export const createPaymentIntentApi = async (commandeId, montant) => {
  // هادي غاتـعيط على الـ View د Django اللي كادير الـ Connection مع Stripe SDK
  const response = await api.post('payments/create-intent/', {
    commande: commandeId,
    montant: montant
  });
  return response.data; // غاترجع ليك الـ clientSecret اللي كيحتاجو الفرونتند باش يـشعل الفورم د Stripe
};

// ==========================================
// 👑 Admin API
// ==========================================

export const fetchUsersApi = async () => {
  const response = await api.get('admin/users/');
  return response.data;
};