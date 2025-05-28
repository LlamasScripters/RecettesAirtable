import { Router } from 'express';
import { recipeController } from '../controllers/recipeController';

const router = Router();

// GET /api/recipes - Récupérer toutes les recettes avec filtres
router.get('/', recipeController.getRecipes.bind(recipeController));

// GET /api/recipes/:id - Récupérer une recette par ID
router.get('/:id', recipeController.getRecipeById.bind(recipeController));

// POST /api/recipes/generate - Générer une nouvelle recette avec l'IA
router.post('/generate', recipeController.generateRecipe.bind(recipeController));

// POST /api/recipes/analyze-nutrition - Analyser les valeurs nutritionnelles
router.post('/analyze-nutrition', recipeController.analyzeNutrition.bind(recipeController));

// PUT /api/recipes/:id - Mettre à jour une recette
router.put('/:id', recipeController.updateRecipe.bind(recipeController));

// DELETE /api/recipes/:id - Supprimer une recette
router.delete('/:id', recipeController.deleteRecipe.bind(recipeController));

// POST /api/recipes/:id/favorite - Marquer/démarquer une recette comme favorite
router.post('/:id/favorite', recipeController.toggleFavorite.bind(recipeController));

const recipeRoutes = router;
export default recipeRoutes; 