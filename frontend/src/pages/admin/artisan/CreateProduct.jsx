import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  ChevronDown, 
  Lightbulb,
  ArrowLeft
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { createProductApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    categorie_id: '',
    prix: '',
    stock: '1',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      await createProductApi({
        ...formData,
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock),
        artisan_id: user.id,
        artisan_nom: user.nom,
        image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop', // صورة افتراضية مؤقتة
        statut: 'Actif'
      });
      navigate('/artisan/products');
    } catch (error) {
      console.error('Échec de la création du produit:', error);
      alert('Une erreur est survenue lors de la création du produit.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* ⬅️ الترويسة وزر العودة خلفاً */}
      <header className="mb-12 flex items-center justify-between border-b border-[#c2c6d3] pb-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-xl bg-white border border-[#c2c6d3] flex items-center justify-center text-[#424751] hover:text-[#003974] hover:border-[#003974] transition-all cursor-pointer active:scale-90 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#003974] tracking-tight">Ajouter une Nouvelle Création</h1>
            <p className="text-[#424751] font-['Inter'] text-sm mt-1">Présentez votre chef-d'œuvre et partagez son histoire unique avec le monde.</p>
          </div>
        </div>
      </header>

      {/* 🧱 بدء هيكلة النموذج ونظام شبكة العرض */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 📸 شق تحميل صورة المنتج الجانبي */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#c2c6d3] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 h-fit lg:sticky lg:top-24 shadow-sm">
            <div className="w-full aspect-square bg-[#f4f4f2]/60 border-2 border-dashed border-[#c2c6d3] rounded-xl flex flex-col items-center justify-center group hover:border-[#003974] transition-all cursor-pointer p-6">
              <div className="w-16 h-16 rounded-full bg-[#003974]/10 flex items-center justify-center text-[#003974] mb-4 group-hover:scale-105 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <p className="font-['Inter'] text-xs font-bold text-[#1a1c1b] uppercase tracking-wider group-hover:text-[#003974] transition-colors">Charger une Image</p>
              <p className="text-[9px] text-[#727782] mt-1 font-semibold uppercase tracking-wider">PNG, JPG ou WEBP (Max 5MB)</p>
            </div>
            <p className="text-[11px] text-[#424751] leading-relaxed font-medium italic">
              Privilégiez une image au format carré 1:1 sous une lumière naturelle pour une mise en valeur optimale.
            </p>
          </div>
        </div>

        {/* 📝 استمارة الحقول والبيانات التقنية */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white border border-[#c2c6d3] rounded-2xl p-8 shadow-sm space-y-6">
            
            {/* 1. اسم المنتج */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#695d46] uppercase tracking-widest block" htmlFor="nom">Nom de la Création</label>
              <input 
                required
                id="nom" 
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                placeholder="Ex: Tapis Zanafi tissé main" 
                className="w-full px-4 py-3.5 rounded-xl border border-[#c2c6d3] focus:border-[#003974] focus:ring-1 focus:ring-[#003974] transition-all bg-white font-semibold text-sm outline-none text-[#1a1c1b]" 
              />
            </div>

            {/* 2. تصنيف المنتج والسعر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#695d46] uppercase tracking-widest block" htmlFor="categorie_id">Catégorie</label>
                <div className="relative">
                  <select 
                    required
                    id="categorie_id"
                    value={formData.categorie_id}
                    onChange={(e) => setFormData({...formData, categorie_id: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#c2c6d3] focus:border-[#003974] focus:ring-1 focus:ring-[#003974] transition-all bg-white appearance-none font-semibold text-sm pr-10 outline-none cursor-pointer text-[#1a1c1b]" 
                  >
                    <option value="">Choisir une Catégorie</option>
                    <option value="Céramique">Céramiques</option>
                    <option value="Bois Travaillé">Travail du Bois</option>
                    <option value="Maroquinerie">Maroquinerie</option>
                    <option value="Tapis & Textiles">Textiles & Tissage</option>
                    <option value="Bijoux">Bijouterie</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#727782]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#695d46] uppercase tracking-widest block" htmlFor="prix">Prix de Vente (DH)</label>
                <div className="relative">
                  <input 
                    required
                    id="prix" 
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                    placeholder="0.00" 
                    className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-[#c2c6d3] focus:border-[#003974] focus:ring-1 focus:ring-[#003974] transition-all bg-white font-bold text-base outline-none text-[#1a1c1b]" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003974] text-xs font-bold">DH</span>
                </div>
              </div>
            </div>

            {/* 3. إدارة المخزون الحالي */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#695d46] uppercase tracking-widest block" htmlFor="stock">Quantité disponible en stock</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <input 
                  required
                  id="stock" 
                  type="number" 
                  min="1"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className={cn(
                    "w-full sm:w-32 px-4 py-3.5 rounded-xl border font-bold text-base text-center outline-none transition-all",
                    parseInt(formData.stock) <= 0 ? "border-rose-500 bg-rose-50 text-rose-600" : "border-[#c2c6d3] focus:border-[#003974] focus:ring-1 focus:ring-[#003974]"
                  )} 
                />
                <div className="flex-1 p-3.5 bg-[#f4f4f2]/60 rounded-xl border border-[#c2c6d3]/40 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-[11px] font-semibold tracking-wide text-[#424751]">
                    Votre stock sera automatiquement ajusté à chaque commande validée par l'acheteur.
                  </p>
                </div>
              </div>
              {parseInt(formData.stock) <= 0 && (
                <div className="flex items-center gap-1.5 text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">La quantité initiale doit être supérieure ou égale à 1.</span>
                </div>
              )}
            </div>

            {/* 4. قصة ووصف المنتج */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#695d46] uppercase tracking-widest block" htmlFor="description">Histoire & Description de la Pièce</label>
              <textarea 
                required
                id="description" 
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Racontez la magie derrière cette œuvre : les techniques séculaires appliquées, le temps passé, l'origine de la matière brute..." 
                className="w-full px-4 py-3.5 rounded-xl border border-[#c2c6d3] focus:border-[#003974] focus:ring-1 focus:ring-[#003974] transition-all bg-white font-medium text-sm leading-relaxed outline-none text-[#1a1c1b]" 
              />
            </div>
          </section>

          {/* 🏁 أزرار الإجراءات التفاعلية وحالة التحميل */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-[#424751] text-xs">
              {isLoading && (
                <div className="flex items-center gap-2 bg-[#f4f4f2] px-4 py-2 rounded-lg border border-[#c2c6d3]/60">
                  <div className="w-4 h-4 border-2 border-[#003974] border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium italic text-[#1a1c1b]">Publication de votre œuvre en cours...</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-[#727782] text-[#1a1c1b] font-bold uppercase text-xs tracking-wider hover:bg-[#f4f4f2] transition-all cursor-pointer text-center"
              >
                Annuler
              </button>
              <button 
                type="submit"
                disabled={isLoading || parseInt(formData.stock) <= 0}
                className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-[#003974] hover:bg-[#002851] text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Publier le Produit
              </button>
            </div>
          </div>

          {/* 💡 نصيحة تسويقية ذكية للصانع التقليدي */}
          <div className="bg-[#1a1c1b] text-white rounded-2xl p-6 flex items-start gap-4 shadow-md relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white/40">Conseil d'Artisan d'Élite</h4>
              <p className="text-sm font-medium leading-relaxed text-white/90 italic">
                "Les acheteurs de pièces d'art aiment l'authenticité. Décrire précisément vos <span className="text-amber-400 font-semibold">matières premières</span> locales augmente vos chances de vente de <span className="text-amber-400 font-semibold">40%</span>."
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CreateProduct;