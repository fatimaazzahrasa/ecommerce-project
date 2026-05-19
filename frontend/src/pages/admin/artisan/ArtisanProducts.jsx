import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Package, 
  Tag, 
  LayoutGrid,
  List as ListIcon,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { fetchProductsApi, createProductApi, updateProductApi, deleteProductApi } from '../../services/api';
import { cn } from '../../lib/utils';

const ArtisanProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // State لإدارة بيانات النموذج (إضافة / تعديل)
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    categorie_id: 'Céramique',
    stock: '',
    image: '',
    description: ''
  });

  const loadProducts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await fetchProductsApi();
      // تصفية المنتجات لتظهر فقط ما ينتمي للصانع الحالي
      const artisanProducts = data.filter(p => p.artisan_id === user.id);
      setProducts(artisanProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      nom: '',
      prix: '',
      categorie_id: 'Céramique',
      stock: '',
      image: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      nom: product.nom,
      prix: product.prix.toString(),
      categorie_id: product.categorie_id,
      stock: product.stock.toString(),
      image: product.image,
      description: product.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette création ?')) {
      try {
        await deleteProductApi(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        alert('Erreur lors de la suppression du produit');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const productPayload = {
        ...formData,
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock),
        artisan_id: user.id,
        artisan_nom: user.nom,
        statut: 'Actif' // حالة افتراضية للمنتج الجديد
      };
      
      if (editingProduct) {
        const updated = await updateProductApi(editingProduct.id, productPayload);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        const created = await createProductApi(productPayload);
        setProducts(prev => [created, ...prev]);
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      alert(editingProduct ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création');
    }
  };

  const filteredProducts = products.filter(p => 
    (p.nom || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.categorie_id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12 px-2">
      
      {/* 👑 ترويسة الصفحة وزر الإضافة الاستراتيجي */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-[#c2c6d3] pb-8">
        <div>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#003974] font-bold tracking-tight mb-2">
            Mes Produits & Créations
          </h2>
          <p className="text-[#424751] font-['Inter'] text-sm">
            Gérez votre catalogue d'art d'exception et contrôlez vos stocks en temps réel.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#003974] text-white hover:bg-[#002851] px-6 py-3.5 rounded-xl shadow-md font-bold text-xs uppercase tracking-widest flex items-center gap-2 group transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Ajouter une Création
        </button>
      </div>

      {/* 🔍 أدوات التحكم والبحث والتصفية */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-[#f4f4f2]/60 p-4 rounded-2xl border border-[#c2c6d3]/60">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727782]" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou catégorie..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#c2c6d3] rounded-xl text-xs font-medium focus:border-[#003974] focus:ring-1 focus:ring-[#003974] outline-none transition-all shadow-sm text-[#1a1c1b]"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
          {/* محدد نمط العرض Grid / List */}
          <div className="flex bg-[#e4e4e2] rounded-xl p-1 border border-[#c2c6d3]/40">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-all cursor-pointer",
                viewMode === 'grid' ? "bg-white text-[#003974] shadow-sm" : "text-[#727782] hover:text-[#1a1c1b]"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all cursor-pointer",
                viewMode === 'list' ? "bg-white text-[#003974] shadow-sm" : "text-[#727782] hover:text-[#1a1c1b]"
              )}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-[#727782] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#1a1c1b] hover:bg-[#f4f4f2] transition-all cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-[#695d46]" />
            Filtres
          </button>
        </div>
      </div>

      {/* 🖼️ منقطة عرض المنتجات */}
      {isLoading ? (
        /* ⏳ شاشات الهيكل المؤقتة أثناء التحميل */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="border border-[#c2c6d3]/40 rounded-2xl h-80 animate-pulse bg-white" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        viewMode === 'grid' ? (
          /* 🎴 نمط عرض شبكة البطاقات (Grid View) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={product.id} 
                  className="bg-white rounded-2xl border border-[#c2c6d3] overflow-hidden shadow-sm hover:shadow-md transition-all group relative flex flex-col justify-between"
                >
                  <div className="aspect-square relative overflow-hidden bg-[#f4f4f2]">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600'} 
                      alt={product.nom} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[9px] font-bold uppercase tracking-wider text-[#695d46] shadow-sm border border-[#c2c6d3]/40">
                        {product.categorie_id}
                      </span>
                    </div>
                    
                    {/* أزرار سريعة تظهر عند تمرير الفأرة */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2 bg-white text-[#424751] rounded-lg hover:text-[#003974] hover:bg-[#003974]/5 transition-all shadow-sm cursor-pointer"
                        title="Modifier la création"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, product.id)}
                        className="p-2 bg-white text-[#424751] hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="font-bold text-[#1a1c1b] text-sm tracking-tight line-clamp-1">{product.nom}</h4>
                      <p className="font-bold text-[#003974] text-sm shrink-0">{(product.prix || 0).toLocaleString('fr-MA')} DH</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#c2c6d3]/40">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#727782]" />
                        <span className={cn(
                          "text-xs font-medium",
                          product.stock < 5 ? "text-rose-600 font-bold" : "text-[#424751]"
                        )}>
                          {product.stock} dispo.
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          product.statut === 'Actif' ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#727782]">
                          {product.statut || 'Actif'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* 📋 نمط عرض القائمة المستعرضة (List View) */
          <div className="bg-white rounded-xl border border-[#c2c6d3] overflow-hidden shadow-sm divide-y divide-[#c2c6d3]/40">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-[#f9f9f7] transition-colors group gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#c2c6d3]/60 shadow-inner shrink-0 bg-[#f4f4f2]">
                    <img src={product.image} className="w-full h-full object-cover" alt={product.nom} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1c1b] text-sm tracking-tight group-hover:text-[#003974] transition-colors">{product.nom}</h4>
                    <p className="text-[9px] font-bold text-[#695d46] uppercase tracking-wider mt-0.5">
                      {product.categorie_id} • <span className="text-[#727782] font-normal font-['Inter']">ID: #{product.id.slice(-6).toUpperCase()}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="sm:text-right">
                    <p className="text-[9px] font-bold text-[#727782] uppercase tracking-wider mb-0.5">Prix</p>
                    <p className="font-bold text-[#003974] text-sm">{(product.prix || 0).toLocaleString('fr-MA')} DH</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[9px] font-bold text-[#727782] uppercase tracking-wider mb-0.5">Stock</p>
                    <p className={cn("font-bold text-xs", product.stock < 5 ? "text-rose-600" : "text-[#1a1c1b]")}>{product.stock} unités</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-[#f4f4f2] text-[#424751] hover:text-[#003974] hover:bg-[#003974]/5 rounded-lg border border-[#c2c6d3]/60 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, product.id)}
                      className="p-2 bg-[#f4f4f2] text-[#424751] hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-[#c2c6d3]/60 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* 📭 واجهة خلو الصفحة من أي منتج */
        <div className="bg-white rounded-2xl border border-[#c2c6d3] py-20 flex flex-col items-center text-center px-4">
          <div className="w-16 h-16 bg-[#f4f4f2] rounded-2xl flex items-center justify-center mb-4 border border-[#c2c6d3]/60">
            <Package className="w-6 h-6 text-[#695d46]" />
          </div>
          <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1c1b]">Aucune création au catalogue</h3>
          <p className="text-[#424751] text-xs max-w-xs mt-1">
            Révélez votre talent au monde entier en ajoutant votre tout premier chef-d'œuvre artisanal dès aujourd'hui.
          </p>
          <button 
            onClick={openAddModal}
            className="mt-6 bg-[#003974] text-white hover:bg-[#002851] px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter mon premier produit
          </button>
        </div>
      )}

      {/* 🧾 النافذة المنبثقة للنموذج (Modal Add/Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#1a1c1b]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-[#c2c6d3]"
            >
              <div className="p-6 border-b border-[#c2c6d3]/60 flex justify-between items-center bg-[#f4f4f2]/50">
                <div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#003974]">
                    {editingProduct ? 'Modifier la Création' : 'Nouvelle Création d\'Art'}
                  </h3>
                  <p className="text-xs text-[#424751] mt-0.5">
                    {editingProduct ? 'Ajustez les détails ou le stock actuel.' : 'Enregistrez une œuvre d\'art unique pour vos acquéreurs.'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-[#e4e4e2] text-[#424751] rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#695d46]">Nom du Produit</label>
                    <input 
                      required
                      type="text" 
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      placeholder="Ex: Vase en Céramique émaillée"
                      className="w-full px-4 py-3 bg-white border border-[#c2c6d3] rounded-xl text-xs font-semibold focus:border-[#003974] focus:ring-1 focus:ring-[#003974] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#695d46]">Catégorie</label>
                    <select 
                      value={formData.categorie_id}
                      onChange={(e) => setFormData({...formData, categorie_id: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#c2c6d3] rounded-xl text-xs font-semibold focus:border-[#003974] outline-none transition-all cursor-pointer"
                    >
                      <option>Céramique</option>
                      <option>Tapis & Textiles</option>
                      <option>Maroquinerie</option>
                      <option>Bijoux</option>
                      <option>Bois Travaillé</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#695d46]">Prix (DH)</label>
                    <div className="relative">
                      <input 
                        required
                        type="number" 
                        value={formData.prix}
                        onChange={(e) => setFormData({...formData, prix: e.target.value})}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#c2c6d3] rounded-xl text-xs font-semibold focus:border-[#003974] focus:ring-1 focus:ring-[#003974] outline-none transition-all"
                      />
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#727782]" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#695d46]">Stock Disponible</label>
                    <div className="relative">
                      <input 
                        required
                        type="number" 
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        placeholder="1"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#c2c6d3] rounded-xl text-xs font-semibold focus:border-[#003974] focus:ring-1 focus:ring-[#003974] outline-none transition-all"
                      />
                      <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#727782]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#695d46]">URL de l'Image du Produit</label>
                  <div className="relative">
                    <input 
                      required
                      type="url" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#c2c6d3] rounded-xl text-xs font-semibold focus:border-[#003974] focus:ring-1 focus:ring-[#003974] outline-none transition-all"
                    />
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#727782]" />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-3.5 bg-[#003974] hover:bg-[#002851] text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    {editingProduct ? 'Enregistrer les Modifications' : 'Mettre l\'œuvre en Vente'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtisanProducts;