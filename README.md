# RecettesAirtable 🍳

Application web complète de gestion de recettes avec génération automatique par IA, utilisant Airtable comme base de données et Ollama pour l'intelligence artificielle.

## ✨ Fonctionnalités

- **Génération de recettes par IA** : Créez des recettes personnalisées à partir d'ingrédients
- **Gestion complète** : Ajout, modification, suppression de recettes
- **Filtrage avancé** : Par type, difficulté, allergènes
- **Analyse nutritionnelle** : Calcul automatique des valeurs nutritionnelles
- **Interface moderne** : Frontend React avec Tailwind CSS
- **API REST** : Backend Node.js/Express sécurisé

## 🏗️ Architecture

```
RecettesAirtable/
├── client/          # Frontend React/Vite
├── server/          # Backend Node.js/Express
├── compose.yml      # Configuration Docker
└── README.md
```

### Stack technologique

**Frontend :**
- React 19 + TypeScript
- Vite (build tool)
- TanStack Router (routing)
- TanStack Query (state management)
- Tailwind CSS + Radix UI (styling)
- Zustand (store)

**Backend :**
- Node.js + Express + TypeScript
- Airtable (base de données)
- Ollama (IA locale)
- Zod (validation)
- Helmet + CORS (sécurité)

**DevOps :**
- Docker + Docker Compose
- Hot-reload en développement
- Nginx (proxy frontend)

## 🚀 Démarrage rapide

### Prérequis

- Docker et Docker Compose
- Accès à une base Airtable

### Installation

1. **Cloner le projet :**
```bash
git clone <repo-url>
cd RecettesAirtable
```

2. **Configurer les variables d'environnement :**
Créer `server/.env` avec vos clés Airtable :
```env
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=your_base_id
```

3. **Démarrer l'application :**
```bash
docker compose up -d
```

4. **Télécharger le modèle IA :**
```bash
docker exec -it recettes-ollama ollama pull llama3.2:1b
```

5. **Accéder à l'application :**
- Frontend : http://localhost:3000
- API : http://localhost:5000
- Ollama : http://localhost:11434

## 📊 Services Docker

| Service | Port | Description |
|---------|------|-------------|
| `recettes-client` | 3000 | Frontend React |
| `recettes-server` | 5000 | API Node.js |
| `recettes-ollama` | 11434 | Service IA Ollama |

## 🔧 Commandes utiles

```bash
# Voir les logs
docker compose logs -f

# Redémarrer un service
docker compose restart server

# Arrêter l'application
docker compose down

# Reconstruire les images
docker compose build

# Modèles IA disponibles
docker exec recettes-ollama ollama list
```

## 🎯 Utilisation

1. **Accéder au frontend** sur http://localhost:3000
2. **Consulter les recettes** existantes dans Airtable
3. **Générer une nouvelle recette** avec l'IA :
   - Sélectionner des ingrédients
   - Choisir le nombre de portions
   - Spécifier allergènes et préférences
   - Laisser l'IA créer la recette
4. **Filtrer et rechercher** dans la collection

## 📚 Documentation

- [Documentation API Backend](./server/README.md)
- [Guide Frontend](./client/README.md)

## 🔐 Configuration Airtable

Structure de base requise :

**Table "recipes" :**
- `titre` (Text)
- `description` (Long text)
- `type` (Single select)
- `difficulté` (Single select) 
- `ingredients` (Long text)
- `instructions` (Long text)
- `portions` (Number)
- `tempsPréparation` (Number)
- `tempsCuisson` (Number)
- `allergenes` (Multiple select)
- `dateCreation` (Date)

## 🤖 Configuration IA

L'application utilise **Ollama** pour la génération de recettes. Modèles recommandés :

- `tinyllama` (637MB) - Rapide, basique
- `llama3.2:1b` (1.3GB) - Équilibré
- `llama3.2` (2GB) - Meilleure qualité

```bash
# Changer de modèle
docker exec -it recettes-ollama ollama pull <model-name>
# Puis modifier OLLAMA_MODEL dans compose.yml
```

## 🛠️ Développement

### Mode développement

```bash
# Démarrer avec hot-reload
docker compose up -d

# Ou manuellement :
cd server && npm run dev
cd client && npm start
```

### Tests

```bash
# Backend
cd server && npm test

# Frontend  
cd client && npm test
```

## 🐛 Dépannage

**Erreur "modèle non trouvé" :**
```bash
docker exec -it recettes-ollama ollama pull llama3.2:1b
```

**Frontend inaccessible :**
Vérifier que Vite écoute sur `0.0.0.0:3000`

**API erreur 500 :**
Vérifier les variables d'environnement Airtable

## 📄 Licence

MIT License

## 👥 Contributeurs

- Développé dans le cadre du M2 Airtable Avancé