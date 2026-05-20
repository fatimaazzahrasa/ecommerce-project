import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Edit2, 
  ChevronLeft, 
  ChevronRight, 
  UserX,
  Filter,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
// 🔌 استيراد دوال الـ API المحدثة
import { fetchUsersApi } from '../../services/api'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tous');

  // 🔄 جلب المستخدمين من الـ Backend عند تحميل الصفحة
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const fetched = await fetchUsersApi();
        // تأكد من أن الـ API يرجع مصفوفة دائماً
        setUtilisateurs(Array.isArray(fetched) ? fetched : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // 🤝 دالة حذف أو حظر مستخدم من الـ Backend
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Voulez-vous vraiment supprimer l'utilisateur ${name} ?`)) {
      try {
        // إرسال طلب الحذف للـ API الخاص بك
        await axios.delete(`/api/admin/users/${id}`);
        
        // تحديث الحالة في الواجهة فوراً دون الحاجة لإعادة تحميل الصفحة
        setUtilisateurs(utilisateurs.filter(user => (user.id || user._id) !== id));
        alert("Utilisateur supprimé avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Impossible de supprimer l'utilisateur. Réessayez plus tard.");
      }
    }
  };

  // ✉️ دالة دعوة مستخدم جديد
  const handleInviteUser = async () => {
    const email = prompt("Entrez l'adresse email de l'utilisateur à inviter :");
    if (!email) return;

    try {
      await axios.post('/api/admin/users/invite', { email });
      alert(`Invitation envoyée avec succès à : ${email}`);
    } catch (error) {
      console.error("Erreur d'invitation:", error);
      alert("Échec de l'envoi de l'invitation.");
    }
  };

  // 🔍 تصفية المستخدمين محلياً بناءً على البحث والفلتر
  const filteredUsers = utilisateurs.filter(user => {
    const nomUser = user.nom || user.name || '';
    const emailUser = user.email || '';
    const roleUser = user.role || '';

    const matchesSearch = nomUser.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emailUser.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'Tous' || roleUser.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-4 md:p-10 space-y-10 bg-surface">
      <header className="flex flex-col gap-2">
        <h2 className="font-manrope text-4xl md:text-5xl font-black text-on-surface tracking-tighter">Gestion des Utilisateurs</h2>
        <p className="text-on-surface-variant font-medium text-lg">Administrez les comptes clients, artisans et administrateurs de la plateforme.</p>
      </header>

      {/* Filtres & Actions */}
      <section className="bg-white p-8 rounded-[2rem] border border-outline-variant shadow-xl shadow-surface-container/30 flex flex-col xl:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-6 w-full xl:w-auto">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
            <input 
              className="w-full pl-12 pr-6 py-4 bg-surface border-2 border-outline-variant rounded-2xl font-bold text-sm focus:border-primary outline-none transition-all" 
              placeholder="Chercher par nom, email..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 bg-surface border-2 border-outline-variant rounded-2xl px-6 py-1">
             <Filter className="w-5 h-5 text-outline" />
             <select 
                className="py-3 bg-transparent font-black text-[10px] uppercase tracking-widest focus:ring-0 border-none cursor-pointer text-on-surface outline-none"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="Tous">Tous les Rôles</option>
                <option value="artisan">Artisan</option>
                <option value="client">Client</option>
                <option value="admin">Administrateur</option>
              </select>
          </div>
        </div>
        <button 
          onClick={handleInviteUser}
          className="w-full xl:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-manrope font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un Utilisateur
        </button>
      </section><button 
          onClick={handleInviteUser}
          className="w-full xl:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-manrope font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un Utilisateur
        </button><button 
          onClick={handleInviteUser}
          className="w-full xl:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-manrope font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un Utilisateur
        </button><button 
          onClick={handleInviteUser}
          className="w-full xl:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-manrope font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un Utilisateur
        </button><button 
          onClick={handleInviteUser}
          className="w-full xl:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-manrope font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un Utilisateur
        </button><button 
          onClick={handleInviteUser}
          className="w-full xl:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-manrope font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un Utilisateur
        </button><button 
          onClick={handleInviteUser}
          className="w-full xl:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-manrope font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un Utilisateur
        </button><button 
          onClick={handleInviteUser}
          className="w-full xl:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-manrope font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un Utilisateur
        </button><button 
          onClick={() => navigate('/admin/users/create')}
          className="w-full xl:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-manrope font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un Utilisateur
        </button>

      {/* Conteneur de Table */}
      <div className="bg-white rounded-[2.5rem] border border-outline-variant shadow-2xl shadow-surface-container/20 overflow-hidden text-on-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/50 border-b-2 border-outline-variant/30">
              <tr>
                <th className="px-10 py-6 font-manrope text-[10px] font-black text-outline uppercase tracking-[0.2em]">UTILISATEUR</th>
                <th className="px-10 py-6 font-manrope text-[10px] font-black text-outline uppercase tracking-[0.2em]">RÔLE</th>
                <th className="px-10 py-6 font-manrope text-[10px] font-black text-outline uppercase tracking-[0.2em] text-center">STATUT</th>
                <th className="px-10 py-6 font-manrope text-[10px] font-black text-outline uppercase tracking-[0.2em] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {isLoading ? (
                 <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-12 h-12 rounded-full border-4 border-outline-variant border-t-primary animate-spin" />
                        <p className="font-black text-primary uppercase tracking-[0.2em] text-[10px]">Synchronisation avec la base de données...</p>
                      </div>
                    </td>
                 </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan={4} className="py-32 text-center">
                     <div className="flex flex-col items-center gap-8 opacity-30 grayscale">
                        <UserX className="w-20 h-20 text-outline" />
                        <div>
                          <p className="font-manrope text-2xl font-black text-on-surface tracking-tight">Aucun utilisateur trouvé</p>
                          <p className="text-sm font-bold uppercase tracking-widest mt-2">Veuillez ajuster vos filtres ou termes de recherche.</p>
                        </div>
                     </div>
                   </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userId = user.id || user._id;
                  const isUserActive = user.statut !== 'Bloqué' && user.statut !== 'Inactif';
                  
                  return (
                    <tr key={userId} className="hover:bg-surface-container/30 transition-all group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl border-2 border-outline-variant/50 overflow-hidden shadow-sm bg-surface-container p-0.5">
                             <img 
                               src={user.avatar || `https://i.pravatar.cc/150?u=${userId}`} 
                               className="w-full h-full object-cover rounded-[0.9rem] group-hover:scale-110 transition-transform duration-700" 
                               alt={user.nom} 
                             />
                          </div>
                          <div>
                            <p className="font-manrope font-black text-on-surface text-xl tracking-tighter group-hover:text-primary transition-colors">{user.nom || user.name}</p>
                            <p className="text-xs font-bold text-outline lowercase">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={cn(
                          "inline-flex items-center px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border",
                          user.role === 'admin' ? "bg-black text-white border-black" :
                          user.role === 'artisan' ? "bg-secondary/5 text-secondary border-secondary/20" :
                          "bg-primary/5 text-primary border-primary/20"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-center gap-3">
                           <div className={cn("w-10 h-1 rounded-full opacity-20 relative overflow-hidden", isUserActive ? "bg-emerald-500" : "bg-rose-500")}>
                              <div className={cn("absolute inset-0 w-[80%] rounded-full", isUserActive ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]")}></div>
                           </div>
                           <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isUserActive ? "text-emerald-600" : "text-rose-600")}>
                             {user.statut || 'Actif'}
                           </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button className="w-12 h-12 flex items-center justify-center text-outline hover:text-primary hover:bg-primary/5 rounded-2xl border-2 border-outline-variant/30 transition-all active:scale-90 cursor-pointer" title="Éditer">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(userId, user.nom || user.name)}
                            className="w-12 h-12 flex items-center justify-center text-outline hover:text-red-600 hover:bg-red-50 rounded-2xl border-2 border-outline-variant/30 transition-all active:scale-90 cursor-pointer" 
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-10 py-8 border-t-2 border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between bg-surface-container-low/30 gap-6">
          <p className="text-[10px] font-black text-outline uppercase tracking-[0.25em]">
            Affichage de {filteredUsers.length} sur {utilisateurs.length} membres
          </p>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center border-2 border-outline-variant/30 rounded-xl hover:text-primary disabled:opacity-20 transition-all cursor-not-allowed" disabled>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {[1].map(page => (
                <button 
                  key={page} 
                  className="w-10 h-10 rounded-xl font-black text-[10px] transition-all border-2 bg-primary text-white border-primary shadow-xl shadow-primary/20"
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="w-10 h-10 flex items-center justify-center border-2 border-outline-variant/30 rounded-xl hover:text-primary transition-all cursor-not-allowed" disabled>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;