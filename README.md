# Klikwy - Plateforme de Services Freelance

Une plateforme moderne construite avec Next.js 15, React 19, NextAuth et Tailwind CSS permettant aux clients de trouver des services et aux freelances de vendre leurs compétences.

## 🚀 Fonctionnalités

- **Authentification complète** avec NextAuth (email/mot de passe + Google OAuth)
- **Redirections automatiques** basées sur le type d'utilisateur
- **Page "Trouver des services"** pour les clients
- **Page "Vendre mes services"** pour les freelances
- **Interface moderne** avec Tailwind CSS et composants UI personnalisés
- **Compatible React 19** avec Radix UI

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd klikwy
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration environnement**
```bash
cp env.example .env.local
```

Remplir les variables dans `.env.local` :
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma db push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du Projet

```
src/
├── app/                    # Pages et API routes (App Router)
│   ├── api/               # API endpoints
│   │   ├── auth/          # NextAuth configuration
│   │   ├── services/      # CRUD services
│   │   ├── orders/        # Gestion commandes
│   │   ├── profile/       # Profil utilisateur
│   │   └── payments/      # Paiements
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Tableau de bord
│   ├── profile/           # Page profil
│   ├── settings/          # Paramètres compte
│   └── billing/           # Facturation
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── header.tsx        # Header avec méga-menu
│   ├── footer.tsx        # Footer
│   └── ServicesSection.tsx # Section services
├── lib/                   # Utilitaires et configuration
│   ├── prisma.ts         # Client Prisma
│   └── utils.ts          # Fonctions utilitaires
└── types/                # Types TypeScript
```

## 🗄 Modèles de Données

### Utilisateur
- Informations personnelles (nom, email, image)
- Rôle (CLIENT, FREELANCER, ADMIN)
- Compétences et bio
- Statut freelance

### Service
- Titre, description, prix (MAD)
- Catégorie et tags
- Temps de livraison
- Image et portfolio

### Commande
- Client et freelance
- Statut (PENDING, IN_PROGRESS, DELIVERED, etc.)
- Budget et délais
- Livrables

### Paiement
- Montant et devise
- Statut et méthode
- Historique complet

## 🎯 Fonctionnalités Clés

### Pour les Clients
- Parcourir les services par catégorie
- Publier des briefs de projets
- Commander des services
- Suivre les commandes
- Système de notation

### Pour les Freelances
- Créer et gérer des services
- Recevoir et traiter les commandes
- Portfolio et profil professionnel
- Messagerie avec clients
- Suivi des revenus

### Administration
- Gestion des utilisateurs
- Modération des services
- Statistiques de la plateforme
- Gestion des paiements

## 🔧 Configuration Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un existant
3. Activer l'API Google+ 
4. Créer des identifiants OAuth 2.0
5. Ajouter les URLs autorisées :
   - `http://localhost:3000` (développement)
   - `https://votre-domaine.com` (production)
6. Copier Client ID et Client Secret dans `.env.local`

## 📱 Responsive Design

L'application est entièrement responsive avec :
- **Mobile-first** approach
- **Breakpoints Tailwind** : sm, md, lg, xl
- **Navigation mobile** avec menu hamburger
- **Grids adaptatifs** pour les services
- **Formulaires optimisés** pour mobile

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes
- Netlify
- Railway
- Heroku

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou support :
- Email : support@klikwy.com
- Issues GitHub : [Créer une issue](https://github.com/votre-repo/issues)

### Pour les Clients (Trouver des services)
- Accès à `/trouver-services`
- Recherche et filtrage des services disponibles
- Interface de navigation intuitive
### Pour les Freelances (Vendre mes services)
- Accès à `/vendre-services`
- Tableau de bord avec statistiques
- Gestion des services (création, modification, suppression)

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/auth/          # Routes d'authentification
│   ├── auth/              # Pages de connexion/inscription
│   ├── trouver-services/  # Page client
│   ├── vendre-services/   # Page freelance
│   └── lib/               # Configuration NextAuth
├── components/
│   ├── ui/                # Composants UI réutilisables
│   ├── header.tsx         # En-tête avec navigation
│   └── footer.tsx         # Pied de page
├── lib/
│   ├── userStore.ts       # Gestion des utilisateurs (remplacer par BDD)
│   └── utils.ts           # Utilitaires
├── types/
│   └── next-auth.d.ts     # Types NextAuth étendus
└── middleware.ts          # Middleware de redirection
```

## 🔧 Technologies Utilisées

- **Next.js 15** - Framework React
- **React 19** - Bibliothèque UI
- **NextAuth.js** - Authentification
- **Tailwind CSS** - Styles
- **TypeScript** - Typage statique
- **Radix UI** - Composants accessibles
- **Lucide React** - Icônes

## ⚠️ Notes Importantes

- **Base de données** : Actuellement utilise un stockage en mémoire (`userStore.ts`). Remplacez par une vraie base de données (PostgreSQL, MongoDB, etc.) pour la production.
- **Sécurité** : Changez `NEXTAUTH_SECRET` en production
- **OAuth** : Configurez les domaines autorisés pour Google OAuth en production

## 🚀 Déploiement

Le projet est prêt pour le déploiement sur Vercel :

```bash
npm run build
npm start
```

## 📝 Prochaines Étapes

- [ ] Intégration d'une vraie base de données
- [ ] Système de paiement
- [ ] Chat en temps réel
- [ ] Système de notation/avis
- [ ] Upload de fichiers
- [ ] Notifications push
