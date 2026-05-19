import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Store, Eye, EyeOff, ArrowRight } from 'lucide-react';
// 🚀 تصحيح الـ Import ديال Motion
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      // 🔍 جلب المستخدمين المسجلين في الـ LocalStorage بحال كودك القديم
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

      // البحث عن المستخدم والمطابقة
      const userFound = existingUsers.find(u => u.email === email && u.password === password);

      if (!userFound) {
        setError('Émail ou mot de passe incorrect. Veuillez d\'abord vous inscrire.');
        return;
      }

      // 🔐 تمرير التوكن والبيانات للـ AuthContext ديالك
      const fakeToken = "abc123xyz_token_real_auth";
      await login(fakeToken, {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
        role: userFound.role
      });

      // 🔀 التوجيه الذكي على حساب الـ Role
      if (userFound.role === 'artisan') {
        navigate('/artisan/dashboard', { replace: true });
      } else if (userFound.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (err) {
      setError(err.message || 'L\'authentification a échoué.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f7] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-[#c2c6d3]"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-[#003974] rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg shadow-[#003974]/20">
              <Store className="w-7 h-7" />
            </div>
            <span className="font-['Playfair_Display'] font-bold text-2xl tracking-tighter text-[#003974]">Moroccan Artisans</span>
          </Link>
          <h2 className="text-3xl font-bold text-[#003974] tracking-tight font-['Playfair_Display']">Bon retour</h2>
          <p className="mt-2 text-xs uppercase tracking-widest text-[#695d46] font-medium">
            Ou{' '}
            <Link to="/register" className="font-bold text-[#003974] hover:underline underline-offset-4">
              créez un nouveau compte
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-[#ba1a1a]/10 border-l-4 border-[#ba1a1a] p-4 rounded-r-md">
            <p className="text-xs text-[#ba1a1a] font-bold text-center">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-[11px] font-bold text-[#424751] uppercase tracking-[0.2em] mb-2 px-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c6d3]" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f9f9f7] border border-[#c2c6d3] rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#003974] transition-colors"
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label htmlFor="password" className="block text-[11px] font-bold text-[#424751] uppercase tracking-[0.2em]">
                  Mot de Passe
                </label>
                <button type="button" className="text-[11px] font-bold text-[#003974] hover:underline uppercase tracking-widest">
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c6d3]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f9f9f7] border border-[#c2c6d3] rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-[#003974] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c2c6d3] hover:text-[#003974] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#003974] focus:ring-[#003974]/20 border-[#c2c6d3] rounded"
            />
            <label htmlFor="remember-me" className="ml-3 block text-xs text-[#424751] font-medium uppercase tracking-wider">
              Se souvenir de moi
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#003974] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#003974]/10 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Se connecter
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-[#f4f4f2] text-center">
           <p className="text-[10px] text-[#695d46] font-bold uppercase tracking-[0.3em] mb-4">Ou continuer avec</p>
           <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-3 p-3 border border-[#c2c6d3] rounded-xl hover:bg-[#f9f9f7] transition-colors active:scale-95 cursor-pointer">
                <img src="https://www.svgrepo.com/show/475656/google.svg" className="w-4 h-4" alt="Google" />
                <span className="text-[10px] font-bold text-[#424751] uppercase tracking-widest">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-3 p-3 border border-[#c2c6d3] rounded-xl hover:bg-[#f9f9f7] transition-colors active:scale-95 cursor-pointer">
                <img src="https://www.svgrepo.com/show/475647/facebook.svg" className="w-4 h-4" alt="Facebook" />
                <span className="text-[10px] font-bold text-[#424751] uppercase tracking-widest">Facebook</span>
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;