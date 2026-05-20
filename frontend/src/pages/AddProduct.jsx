import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({ nom: '', description: '', prix: '', stock: '', categorie: '' });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await axios.post('http://127.0.0.1:8000/api/products/', data, {
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data' 
        }
      });
      alert("تمت الإضافة بنجاح!");
      navigate('/catalog'); // يرجع للبوتيك يشوف منتجاته
    } catch (err) { alert("حدث خطأ!"); }
  };

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">إضافة منتج جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-3 border rounded" placeholder="الاسم" onChange={e => setFormData({...formData, nom: e.target.value})} />
        <textarea className="w-full p-3 border rounded" placeholder="الوصف" onChange={e => setFormData({...formData, description: e.target.value})} />
        <input type="number" className="w-full p-3 border rounded" placeholder="الثمن" onChange={e => setFormData({...formData, prix: e.target.value})} />
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <button type="submit" className="bg-blue-900 text-white px-6 py-3 rounded">نشر المنتج</button>
      </form>
    </div>
  );
};
export default AddProduct;