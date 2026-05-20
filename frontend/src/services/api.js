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
  // response.data غاتكون فيها الـ access token والـ refresh token والـ user info
  if (response.data.access) {
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
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
  const response = await api.get('products/');
  return response.data; // كايرجع List ديال الـ Products اللي فيهم 'prix', 'categorie_name' ...
};

export const fetchCategoriesApi = async () => {
  const response = await api.get('categories/');
  return response.data;
};

export const fetchProductByIdApi = async (id) => {
  const response = await api.get(`products/${id}/`);
  return response.data;
};

export const createProductApi = async (productData) => {
  // productData كتصيفط فيها: nom, description, prix, stock, categorie, artisan
  // رد البال: إيلا كانت فيها صورة، خاص نخدمو بـ FormData ف الـ component (غانقادوها ف بلاصتها)
  const response = await api.post('products/', productData);
  return response.data;
};

export const updateProductApi = async (id, productData) => {
  const response = await api.put(`products/${id}/`, productData);
  return response.data;
};

export const deleteProductApi = async (id) => {
  await api.delete(`products/${id}/`);
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