import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  UserCircle,
  Briefcase,
  AlertCircle,
  Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
// 🚀 تصحيح الـ Import ديال Motion
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuth(); // تقدر تستعملو إيلا زدتي Loading لاحقاً
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' // الافتراضي هو كليان (Acheteur)
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 🔍 التحقق من ملء الحقول الأساسية
    if (!formData.name || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    // 🔍 التحقق من تطابق كلمات المرور من كود الـ AI
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      // 🔄 جلب الحسابات لّي ديجا مسجلين ف الـ LocalStorage من كودك القديم
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

      // نتحققوا واش هاد الإيميل ديجا مستعمل
      const userExists = existingUsers.find(u => u.email === formData.email);
      if (userExists) {
        setError('Cet émail est déjà utilisé.');
        return;
      }

      // نكريو المستخدم الجديد بالهيكلة الصحيحة للبروجي
      const newUser = { 
        id: Date.now(),
        name: formData.name, 
        email: formData.email, 
        password: formData.password, 
        role: formData.role 
      };
      
      // نزيدوه على القائمة ونسيفيو ف الـ localStorage
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // توجيه لصفحة الـ Login بنجاح
      navigate('/login');
    } catch (err) {
      setError('L\'inscription a échoué. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f7] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-[#c2c6d3]"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group text-primary">
            <div className="w-12 h-12 bg-[#003974] rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg shadow-[#003974]/20">
              <Store className="w-7 h-7" />
            </div>
            <span className="font-['Playfair_Display'] font-bold text-2xl tracking-tighter text-[#003974]">Moroccan Artisans</span>
          </Link>
          <h2 className="text-3xl font-bold text-[#003974] tracking-tight font-['Playfair_Display']">Créer un compte</h2>
          <p className="mt-2 text-xs uppercase tracking-widest text-[#695d46] font-medium">
            Rejoignez notre communauté d'artisans et d'amateurs d'art
          </p>
        </div>

        {error && (
          <div className="bg-[#ba1a1a]/10 border-l-4 border-[#ba1a1a] p-4 rounded-r-md flex gap-3">
             <AlertCircle className="w-5 h-5 text-[#ba1a1a] shrink-0" />
             <p className="text-xs text-[#ba1a1a] font-bold">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* 👥 اختيار نوع الحساب بستايل الـ AI الإحترافي */}
          <div className="col-span-full">
            <label className="block text-[11px] font-bold text-[#424751] uppercase tracking-[0.2em] mb-3 px-1">Je m'inscris en tant que</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'client'})}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer",
                  formData.role === 'client' 
                    ? "bg-[#003974]/5 border-[#003974] text-[#003974]" 
                    : "bg-[#f9f9f7] border-[#c2c6d3] text-[#424751] hover:border-[#003974]/30"
                )}
              >
                <UserCircle className="w-8 h-8" />
                <span className="font-bold text-xs uppercase tracking-widest">Acheteur / Client</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'artisan'})}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer",
                  formData.role === 'artisan' 
                    ? "bg-[#003974]/5 border-[#003974] text-[#003974]" 
                    : "bg-[#f9f9f7] border-[#c2c6d3] text-[#424751] hover:border-[#003974]/30"
                )}
              >
                <Briefcase className="w-8 h-8" />
                <span className="font-bold text-xs uppercase tracking-widest">Maâlem / Artisan</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-[11px] font-bold text-[#424751] uppercase tracking-[0.2em] mb-2 px-1">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c6d3]" />
                <input
                  required
                  type="text"
                  className="w-full bg-[#f9f9f7] border border-[#c2c6d3] rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#003974] transition-colors"
                  placeholder="Ahmed Alami"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-[11px] font-bold text-[#424751] uppercase tracking-[0.2em] mb-2 px-1">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c6d3]" />
                <input
                  required
                  type="email"
                  className="w-full bg-[#f9f9f7] border border-[#c2c6d3] rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#003974] transition-colors"
                  placeholder="exemple@domaine.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#424751] uppercase tracking-[0.2em] mb-2 px-1">Mot de Passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c6d3]" />
                <input
                  required
                  type="password"
                  className="w-full bg-[#f9f9f7] border border-[#c2c6d3] rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#003974] transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#424751] uppercase tracking-[0.2em] mb-2 px-1">Confirmation</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c6d3]" />
                <input
                  required
                  type="password"
                  className="w-full bg-[#f9f9f7] border border-[#c2c6d3] rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#003974] transition-colors"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 mt-1 text-[#003974] focus:ring-[#003974]/20 border-[#c2c6d3] rounded"
            />
            <label htmlFor="terms" className="ml-3 block text-xs text-[#424751] font-medium leading-relaxed uppercase tracking-wider">
              J'accepte les <a href="#" className="font-bold text-[#003974] underline">Conditions d'Utilisation</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#003974] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#003974]/10 group"
          >
            Créer mon compte
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-[#424751] uppercase tracking-wider pt-4 border-t border-[#f4f4f2]">
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-bold text-[#003974] underline underline-offset-4">
            Connectez-vous
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;