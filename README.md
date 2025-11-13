# AI Tools Monitor - Plateforme de Veille Technologique IA

Plateforme complète de veille technologique sur l'intelligence artificielle et les outils pour développeurs.

## Stack Technique

### Backend
- **AdonisJS 6** avec TypeScript
- **PostgreSQL** comme base de données
- **Lucid ORM** pour les interactions avec la base de données
- **JWT** avec Access Tokens pour l'authentification
- **Vine** pour la validation des données
- **Shield** pour la protection CSRF
- **Limiter** pour le rate limiting
- **CORS** configuré

### Frontend
- **React** avec TypeScript
- **Vite** comme bundler
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **React Query** pour la gestion de l'état serveur
- **React Router** pour le routing
- **Zod** pour la validation côté client
- **Axios** pour les appels API

## Fonctionnalités

### Core Features
- ✅ Système d'authentification sécurisé (JWT)
- ✅ Gestion des outils IA (CRUD complet)
- ✅ Articles et actualités IA
- ✅ Base de données des modèles IA
- ✅ Système de commentaires
- ✅ Système de notation (ratings)
- ✅ Favoris et bookmarks
- ✅ Tags et catégorisation
- ✅ API publique avec rate limiting
- ✅ Veille automatisée (RSS, scraping)

### Sécurité
- Validation stricte des inputs (Vine + Zod)
- Protection CSRF
- Rate limiting sur toutes les routes
- Sanitization des contenus HTML
- Parameterized queries (Lucid ORM)
- Hash sécurisé des mots de passe (argon2)
- CORS configuré strictement
- Headers de sécurité (HSTS, CSP)

## Installation

### Prérequis

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm ou yarn
- Docker (optionnel, recommandé pour PostgreSQL)

### 1. Cloner le Projet

```bash
git clone <repository-url>
cd ai-tools-monitor
```

### 2. Démarrer PostgreSQL avec Docker

```bash
docker compose up -d
```

Cette commande démarre :
- PostgreSQL sur le port 5432
- Redis sur le port 6379

### 3. Configuration Backend

```bash
cd backend

# Installer les dépendances
npm install

# Le fichier .env est déjà configuré avec les bonnes valeurs
# Vérifier que DB_PASSWORD et DB_USER correspondent à docker-compose.yml

# Exécuter les migrations
node ace migration:run

# (Optionnel) Seed la base de données
node ace db:seed

# Démarrer le serveur de développement
npm run dev
```

Le backend sera accessible sur **http://localhost:3333**

### 4. Configuration Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur **http://localhost:5173**

## Structure du Projet

```
ai-tools-monitor/
├── backend/                  # Backend AdonisJS
│   ├── app/
│   │   ├── controllers/     # Contrôleurs API
│   │   ├── models/          # Modèles Lucid
│   │   ├── validators/      # Validateurs Vine
│   │   ├── middleware/      # Middleware personnalisés
│   │   ├── services/        # Services (scraping, email, etc.)
│   │   └── jobs/            # Jobs schedulés
│   ├── config/              # Configuration
│   ├── database/
│   │   ├── migrations/      # Migrations de base de données
│   │   └── seeders/         # Seeders
│   ├── start/
│   │   ├── routes.ts        # Définition des routes
│   │   └── kernel.ts        # Middleware global
│   └── tests/               # Tests
│
├── frontend/                # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Composants shadcn/ui
│   │   │   ├── auth/        # Composants d'authentification
│   │   │   ├── tools/       # Composants outils IA
│   │   │   ├── articles/    # Composants articles
│   │   │   ├── dashboard/   # Composants dashboard
│   │   │   └── layout/      # Composants de layout
│   │   ├── pages/           # Pages principales
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilitaires
│   │   ├── services/        # Services API
│   │   └── types/           # Types TypeScript
│   └── public/              # Assets statiques
│
├── shared/                  # Code partagé
│   └── types/               # Types TypeScript partagés
│
└── docker-compose.yml       # Configuration Docker
```

## Base de Données

### Schéma Principal

Le projet utilise les tables suivantes :

- **users** : Utilisateurs de la plateforme
- **access_tokens** : Tokens d'authentification
- **tools** : Outils IA
- **articles** : Articles et actualités
- **ai_models** : Modèles d'IA
- **comments** : Commentaires (polymorphic)
- **ratings** : Évaluations (polymorphic)
- **bookmarks** : Favoris (polymorphic)
- **tags** : Tags
- **taggables** : Relations tags (polymorphic many-to-many)
- **api_keys** : Clés API pour accès externe
- **sources** : Sources de veille automatique
- **rate_limit_requests** : Suivi du rate limiting

### Migrations

Pour exécuter les migrations :

```bash
cd backend
node ace migration:run
```

Pour annuler la dernière migration :

```bash
node ace migration:rollback
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

### Tools
- `GET /api/tools` - Liste des outils (avec filtres et pagination)
- `GET /api/tools/:id` - Détails d'un outil
- `POST /api/tools` - Créer un outil (authentifié)
- `PUT /api/tools/:id` - Modifier un outil (authentifié, owner/admin)
- `DELETE /api/tools/:id` - Supprimer un outil (authentifié, owner/admin)
- `GET /api/tools/search` - Recherche full-text

### Articles
- `GET /api/articles` - Liste des articles
- `GET /api/articles/:id` - Détails d'un article
- `POST /api/articles` - Créer un article (authentifié)
- `PUT /api/articles/:id` - Modifier un article (authentifié, owner/admin)
- `DELETE /api/articles/:id` - Supprimer un article (authentifié, owner/admin)

### AI Models
- `GET /api/models` - Liste des modèles IA
- `GET /api/models/:id` - Détails d'un modèle
- `GET /api/models/compare` - Comparer plusieurs modèles

## Scripts Disponibles

### Backend

```bash
npm run dev          # Démarre le serveur en mode développement
npm run build        # Build pour la production
npm run start        # Démarre le serveur en mode production
npm test             # Exécute les tests
node ace migration:run    # Exécute les migrations
node ace db:seed          # Seed la base de données
```

### Frontend

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Build pour la production
npm run preview      # Preview du build de production
npm run lint         # Lint le code
```

## Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## Déploiement

### Variables d'Environnement

#### Backend (.env)

```env
TZ=UTC
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=<générer-une-clé-sécurisée>
NODE_ENV=production

DB_HOST=<host-postgresql>
DB_PORT=5432
DB_USER=<user>
DB_PASSWORD=<password>
DB_DATABASE=ai_tools_monitor
```

#### Frontend (.env)

```env
VITE_API_URL=<url-backend-api>
```

### Docker

Pour déployer avec Docker :

```bash
# Build et démarrage des conteneurs
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter les conteneurs
docker compose down
```

## Contribution

### Conventions de Code

- **TypeScript strict mode** activé
- **Commits conventionnels** (feat:, fix:, security:, etc.)
- **Code commenté** pour la logique complexe
- **Pas de `any`** en TypeScript
- **Validation partout** (frontend + backend)
- **Responsive design** (mobile-first)
- **Accessibilité (a11y)** respectée

### Pull Requests

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commit les changements (`git commit -m 'feat: ajoute ma feature'`)
4. Push vers la branche (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

## Sécurité

Si vous découvrez une vulnérabilité de sécurité, merci de nous contacter directement plutôt que d'ouvrir une issue publique.

## Licence

MIT

## Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

**Développé avec ❤️ pour la communauté IA**
