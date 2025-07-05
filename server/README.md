# API Recettes - Serveur Backend

API REST pour la gestion de recettes de cuisine avec intégration Airtable et IA.

## 🚀 Démarrage rapide

### Prérequis

- Docker et Docker Compose
- Accès à la base Airtable

### Installation avec Docker (Recommandé)

1. Démarrer tous les services :
```bash
docker compose up -d
```

2. Télécharger le modèle IA :
```bash
docker exec -it recettes-ollama ollama pull llama3.2:1b
```

3. L'API sera disponible sur `http://localhost:5000`

### Installation manuelle

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
Créer un fichier `.env` avec :

```env
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=your_base_id
PORT=5000
NODE_ENV=development
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

3. Démarrer le serveur :
```bash
npm run dev
```

## 📚 Documentation API

### Endpoints disponibles

#### Recettes
- `GET /api/recipes` - Lister les recettes avec filtres
- `GET /api/recipes/:id` - Récupérer une recette
- `POST /api/recipes/generate` - Générer une recette avec l'IA
- `PUT /api/recipes/:id` - Mettre à jour une recette
- `DELETE /api/recipes/:id` - Supprimer une recette
- `POST /api/recipes/:id/favorite` - Marquer/démarquer favori
- `POST /api/recipes/analyze-nutrition` - Analyser la nutrition

#### Métadonnées
- `GET /api/metadata/allergenes` - Lister les allergènes
- `GET /api/metadata/types-plats` - Lister les types de plats
- `GET /api/metadata/ingredients` - Lister les ingrédients
- `GET /api/metadata/all` - Toutes les métadonnées

#### Système
- `GET /api/health` - Vérifier la santé de l'API
- `GET /` - Informations sur l'API

### Paramètres de filtrage (GET /api/recipes)

- `search` - Recherche textuelle dans titre, description, ingrédients
- `type` - Filtrer par type de plat
- `difficulty` - Filtrer par difficulté
- `allergies` - Exclure les recettes contenant ces allergènes (séparés par virgule)
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10, max: 100)

### Format de réponse standard

```json
{
  "success": true,
  "data": {}, 
  "message": "Message de succès"
}
```

En cas d'erreur :
```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

### Génération de recette avec IA

POST `/api/recipes/generate`

```json
{
  "ingredients": ["tomate", "basilic", "mozzarella"],
  "servings": 4,
  "allergies": ["gluten"],
  "type": "plat principal",
  "difficulty": "facile"
}
```

## 🏗️ Architecture

```
src/
├── config/          # Configuration (Airtable, etc.)
├── controllers/     # Contrôleurs des routes
├── middleware/      # Middlewares (validation, erreurs)
├── routes/          # Définition des routes
├── services/        # Services (Airtable, IA)
├── types/           # Types TypeScript
└── index.ts         # Point d'entrée
```

## 🐳 Configuration Docker

L'application utilise Docker Compose avec 3 services :

- `recettes-ollama` : Service IA avec Ollama
- `recettes-server` : API Node.js/Express  
- `recettes-client` : Frontend React/Vite

### Commandes Docker utiles

```bash
# Voir les logs
docker compose logs -f

# Redémarrer un service
docker compose restart server

# Arrêter tous les services
docker compose down

# Reconstruire les images
docker compose build
```

## 🔧 Configuration Ollama

Pour utiliser un modèle différent :

```bash
# Télécharger un autre modèle
docker exec -it recettes-ollama ollama pull tinyllama

# Changer le modèle dans compose.yml
OLLAMA_MODEL=tinyllama
```

## 🛡️ Sécurité

- Rate limiting : 100 requêtes par 15 minutes
- CORS configuré pour le frontend
- Helmet pour les headers de sécurité
- Validation des données d'entrée avec Zod
- Gestion d'erreurs sécurisée

## 🐛 Débogage

Les logs incluent :
- Requêtes HTTP (morgan)
- Erreurs serveur détaillées en développement
- Informations de démarrage

Pour déboguer :
1. Vérifier que les variables d'environnement sont correctes
2. Tester la connexion Airtable
3. Vérifier que Ollama fonctionne
4. Consulter les logs du serveur

## 📝 Scripts disponibles

- `npm run dev` - Démarrage en mode développement
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage en production
- `npm test` - Lancer les tests

## ⚡ Performance

- Compression gzip activée
- Limitation de taille des requêtes : 10MB
- Pagination des résultats
- Cache potentiel via proxy (recommandé pour la production) 