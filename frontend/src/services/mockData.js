// 🗂️ CategorieSerializer Structure
export const MOCK_CATEGORIES = [
  { id: 1, nom: 'Céramique', description: 'Objets en argile et poterie faits main.' },
  { id: 2, nom: 'Bois', description: 'Sculptures and ustensiles en bois local.' },
  { id: 3, nom: 'Textiles', description: 'Tissages et vêtements artisanaux.' },
  { id: 4, nom: 'Métal', description: 'Forge et bijoux en métaux précieux.' },
];

// 📦 ProduitSerializer Structure (مفصل على حساب Django ديالك)
export const MOCK_PRODUITS = [
  {
    id: 1,
    categorie: 1,                        // ID de la catégorie
    categorie_name: 'Céramique',          // read_only field ف Django
    artisan: 10,                         // ID de l'artisan
    artisan_name: 'Alex_Rivera',         // read_only field ف Django
    nom: "Vase Terre d'Orient No. 12",
    description: 'Une pièce unique façonnée à la main, mêlant puissance géologique et délicatesse humaine.',
    prix: 2850,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
    date_creation: '2026-05-18T18:00:00Z',
    // هادو زدناهم حيت الـ UI كيحتاجهم للديزاين
    statut: 'En Stock',
    note: 4.5,
    nombre_avis: 48
  },
  {
    id: 2,
    categorie: 1,
    categorie_name: 'Céramique',
    artisan: 10,
    artisan_name: 'Alex_Rivera',
    nom: 'Bol de Pierre Moucheté',
    description: 'Un bol minimaliste en céramique avec un glaçage blanc moucheté.',
    prix: 650,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1580913425633-c006841b53e8?auto=format&fit=crop&q=80&w=800',
    date_creation: '2026-05-18T18:00:00Z',
    statut: 'En Stock',
    note: 4.8,
    nombre_avis: 15
  },
  {
    id: 3,
    categorie: 4,
    categorie_name: 'Métal',
    artisan: 20,
    artisan_name: 'Elena_Sterling',
    nom: 'Couteau de Chef Damas',
    description: 'Forgé à la main avec 67 couches d\'acier Damas. Équilibre parfait.',
    prix: 18500,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    date_creation: '2026-05-18T18:00:00Z',
    statut: 'En Stock',
    note: 4.9,
    nombre_avis: 12
  }
];

// 🔑 UserSerializer Structure (مفصل على حساب Django ديالك)
export const MOCK_UTILISATEURS = [
  {
    id: 1,
    username: 'alex_artisan',
    email: 'alex@artisan.com',
    first_name: 'Alex',
    last_name: 'Rivera',
    role: 'artisan',
    // زدنا هادو حيت الـ UI محتاجهم ف الديزاين د الـ Profile
    statut: 'Actif',
    avatar: 'https://i.pravatar.cc/150?u=u1'
  },
  {
    id: 2,
    username: 'admin_pfa',
    email: 'admin@local.com',
    first_name: 'Chef',
    last_name: 'Admin',
    role: 'admin',
    statut: 'Actif',
    avatar: 'https://i.pravatar.cc/150?u=u2'
  },
  {
    id: 3,
    username: 'sophie_client',
    email: 'sophie@client.com',
    first_name: 'Sophie',
    last_name: 'Client',
    role: 'client',
    statut: 'Actif',
    avatar: 'https://i.pravatar.cc/150?u=u3'
  }
];

// 🛒 CommandeSerializer Structure (مفصل على حساب Django ديالك)
export const MOCK_COMMANDES = [
  {
    id: 10234,
    user: 3,                          // ID de l'utilisateur (Sophie)
    prix_total: 1300,
    statut: 'En préparation',
    date_creation: '2026-05-10T12:00:00Z',
    lignes: [
      {
        id: 1,
        commande: 10234,
        produit: 2,
        quantite: 2,
        prix_unitaire: 650,
        produit_details: MOCK_PRODUITS.find(p => p.id === 2) // Nested Serializer
      }
    ]
  }
];