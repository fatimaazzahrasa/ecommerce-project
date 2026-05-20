import React, { useState } from 'react';
import { UserPlus, User, Mail, Lock, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api'; // 👈 تأكدي من مسار الـ axios instance ديالك

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'CLIENT', // الـ Role التلقائي
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 🚀 إرسال الطلب لـ Django Backend (تأكدي من الـ Endpoint عندك)
       await api.post('users/register/', formData);      
      setSuccess(true);
      // مسح الـ Form بعد النجاح
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        role: 'CLIENT',
        is_active: true
      });
      
      // الرجوع لصفحة إدارة المستخدمين بعد 2 ثواني
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.response?.data?.message || "Erreur lors de la création de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      
      {/* 🧭 Header & Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/users" className="p-2 bg-surface-container rounded-lg text-on-surface-variant hover:bg-surface-variant transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-['Manrope'] text-2xl font-extrabold text-primary">Créer un Utilisateur</h1>
            <p className="text-xs text-on-surface-variant font-['Inter']">Ajouter un nouveau membre, artisan ou administrateur</p>
          </div>
        </div>
      </div>

      {/* 📝 Form Card (Bento Style) */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant shadow-sm">
        
        {/* 🚨 Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error-container/20 border border-error text-error rounded-xl font-['Inter'] text-sm">
            {error}
          </div>
        )}

        {/* ✅ Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-primary-container text-on-primary-container border border-primary rounded-xl font-['Inter'] text-sm flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            Utilisateur créé avec succès ! Redirection en cours...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-['Inter']">
          
          {/* 👥 Section 1: Informations Personnelles */}
          <div>
            <h3 className="font-['Manrope'] font-bold text-sm text-secondary uppercase tracking-wider mb-4">Informations Personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Prénom */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/60" />
                  <input 
                    type="text" name="first_name" value={formData.first_name} onChange={handleChange} required
                    placeholder="Ex: Fatima-Zahra"
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Nom */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Nom</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/60" />
                  <input 
                    type="text" name="last_name" value={formData.last_name} onChange={handleChange} required
                    placeholder="Ex: El Idrissi"
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* 🔐 Section 2: Identifiants du Compte */}
          <div>
            <h3 className="font-['Manrope'] font-bold text-sm text-secondary uppercase tracking-wider mb-4">Identifiants du Compte</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Nom d'utilisateur (Username)</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/60" />
                  <input 
                    type="text" name="username" value={formData.username} onChange={handleChange} required
                    placeholder="Ex: fatimazahra6"
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/60" />
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    placeholder="Ex: admin@articent.com"
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-on-surface-variant">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/60" />
                  <input 
                    type="password" name="password" value={formData.password} onChange={handleChange} required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* 🛡️ Section 3: Rôle & Statut */}
          <div>
            <h3 className="font-['Manrope'] font-bold text-sm text-secondary uppercase tracking-wider mb-4">Rôle & Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              
              {/* Select Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Rôle du compte</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 w-4 h-4 text-on-surface-variant/60" />
                  <select 
                    name="role" value={formData.role} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="ARTISAN">Artisan</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
              </div>

              {/* Status Toggle (Is Active) */}
              <div className="flex items-center gap-3 pt-6 pl-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-semibold text-on-surface">Activer le compte immédiatement</span>
                </label>
              </div>

            </div>
          </div>

          {/* 🔘 Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-['Manrope'] font-bold rounded-xl shadow-sm hover:bg-primary/90 hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-5 h-5" />
              {loading ? 'Création en cours...' : "Créer l'utilisateur"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateUser;