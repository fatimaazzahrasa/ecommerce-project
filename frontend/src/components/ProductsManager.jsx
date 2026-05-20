import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حقول الـ Form لإضافة منتج جديد
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('');
  const [categorie, setCategorie] = useState('');
  const [image, setImage] = useState(null);
  
  const token = localStorage.getItem('token'); // التوكن ديال الـ Artisan

  // 1. جلب منتجات الحرفي والـ Categories عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProducts = await axios.get('http://127.0.0.1:8000/api/products/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resCategories = await axios.get('http://127.0.0.1:8000/api/products/categories/');
        
        setProducts(resProducts.data);
        setCategories(resCategories.data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // 2. دالة إضافة المنتج الجديد (FormData لـ مـعالجة التصويرة)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('prix', prix);
    formData.append('stock', stock);
    formData.append('categorie', categorie);
    if (image) formData.append('image', image);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert("Produit ajouté avec succès !");
      setProducts([res.data, ...products]); // زيادة المنتج ف اللستة بلا ما نديرو F5
      // خاو الحقول مورا الإضافة
      setNom(''); setDescription(''); setPrix(''); setStock(''); setImage(null);
    } catch (error) {
      alert("Erreur lors de l'ajout du produit.");
      console.error(error.response?.data);
    }
  };

  if (loading) return <div className="p-6 text-center">Chargement...</div>;

  return (
    <div className="p-6 space-y-8">
      {/* ➕ الفورم ديال إضافة منتوج جديد */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Ajouter un Nouveau Produit</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nom du produit" value={nom} onChange={(e) => setNom(e.target.value)} className="p-2 border rounded-lg w-full" required />
          <input type="number" placeholder="Prix (DH)" value={prix} onChange={(e) => setPrix(e.target.value)} className="p-2 border rounded-lg w-full" required />
          <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="p-2 border rounded-lg w-full" required />
          
          <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className="p-2 border rounded-lg w-full" required>
            <option value="">Choisir une Catégorie</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
          </select>
          
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border rounded-lg w-full md:col-span-2" rows="3" required></textarea>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="p-1 border rounded-lg w-full" accept="image/*" required />
          </div>
          
          <button type="submit" className="md:col-span-2 bg-blue-900 text-white p-3 rounded-lg font-semibold hover:bg-blue-800 transition">
            Ajouter le Produit
          </button>
        </form>
      </div>

      {/* 📦 لستة المنتجات اللي ديجا كاينين */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Mes Produits ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">Aucun produit trouvé. Ajoutez votre premier produit !</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map(prod => (
              <div key={prod.id} className="border rounded-xl p-3 flex flex-col space-y-2">
                <img src={prod.image} alt={prod.nom} className="h-40 w-full object-cover rounded-lg bg-gray-50" />
                <h3 className="font-bold text-slate-700">{prod.nom}</h3>
                <p className="text-sm text-gray-500 flex-grow">{prod.description.substring(0, 60)}...</p>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold text-blue-900">{prod.prix} DH</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Stock: {prod.stock}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManager;