import React, { createContext, useContext, useState, useEffect } from 'react';
import { createOrderApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [estEnCoursDeTraitement, setEstEnCoursDeTraitement] = useState(false);

  // 📥 Charger le panier spécifique à l'utilisateur Django
  useEffect(() => {
    if (user) {
      // استعملنا user.id اللي جاي من Django ديريكت
      const saved = localStorage.getItem(`panier_${user.id}`);
      setArticles(saved ? JSON.parse(saved) : []);
    } else {
      setArticles([]); 
    }
  }, [user]);

  // 💾 Sauvegarder le panier quand il change
  useEffect(() => {
    if (user && articles.length >= 0) {
      localStorage.setItem(`panier_${user.id}`, JSON.stringify(articles));
    }
  }, [articles, user]);

  const ajouterAuPanier = (produit, quantite = 1) => {
    setArticles(prev => {
      const existant = prev.find(item => item.id === produit.id);
      if (existant) {
        return prev.map(item =>
          item.id === produit.id ? { ...item, quantite: item.quantite + quantite } : item
        );
      }
      return [...prev, { ...produit, quantite }];
    });
  };

  const retirerDuPanier = (idProduit) => {
    setArticles(prev => prev.filter(item => item.id !== idProduit));
  };

  const modifierQuantite = (idProduit, quantite) => {
    if (quantite <= 0) {
      retirerDuPanier(idProduit);
      return;
    }
    setArticles(prev =>
      prev.map(item => (item.id === idProduit ? { ...item, quantite } : item))
    );
  };

  const viderLePanier = () => setArticles([]);

  // 🚀 دالة إرسال الطلب (متوافقة 100% مع CommandeSerializer ديال Django)
  const passerCommande = async () => {
    if (articles.length === 0) throw new Error('Le panier est vide');
    if (!user) throw new Error('Veuillez vous connecter pour commander');
    
    setEstEnCoursDeTraitement(true);
    try {
      const total = articles.reduce((sum, item) => sum + item.prix * item.quantite, 0);
      
      // هنا قادينا الصيفطة على حساب Django (user ID, prix_total, والـ lignes)
      const orderPayload = {
        user: user.id, 
        prix_total: total,
        // هاد الـ lignes هما اللي غايمشيو لـ LigneCommandeSerializer
        lignes: articles.map(item => ({
          produit: item.id,
          quantite: item.quantite,
          prix_unitaire: item.prix
        }))
      };

      const commande = await createOrderApi(orderPayload);
      viderLePanier();
      return commande;
    } catch (error) {
      console.error('Erreur lors du passage de commande Django:', error);
      throw error;
    } finally {
      setEstEnCoursDeTraitement(false);
    }
  };

  const nombreTotalArticles = articles.reduce((sum, item) => sum + item.quantite, 0);
  const sousTotal = articles.reduce((sum, item) => sum + item.prix * item.quantite, 0);

  return (
    <CartContext.Provider value={{
      articles,
      ajouterAuPanier,
      retirerDuPanier,
      modifierQuantite,
      viderLePanier,
      passerCommande,
      nombreTotalArticles,
      sousTotal,
      estEnCoursDeTraitement
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};