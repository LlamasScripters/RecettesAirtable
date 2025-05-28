import type { Request, Response } from 'express';
import { airtableService } from '../services/airtableService';
import { aiService } from '../services/aiService';
import type { RecipeQuery, AIRecipeRequest, APIResponse } from '../types';

export class RecipeController {
  
  // GET /api/recipes - Récupérer toutes les recettes avec filtres
  async getRecipes(req: Request, res: Response): Promise<void> {
    try {
      const query: RecipeQuery = {
        search: req.query.search as string,
        type: req.query.type as string,
        difficulty: req.query.difficulty as string,
        allergies: req.query.allergies ? (req.query.allergies as string).split(',') : undefined,
        page: req.query.page ? Number.parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? Number.parseInt(req.query.limit as string) : 10
      };

      const result = await airtableService.getRecipes(query);
      
      const response: APIResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Recettes récupérées avec succès'
      };
      
      res.json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      res.status(500).json(response);
    }
  }

  // GET /api/recipes/:id - Récupérer une recette par ID
  async getRecipeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const recipe = await airtableService.getRecipeById(id);
      
      if (!recipe) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Recette non trouvée'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: APIResponse<typeof recipe> = {
        success: true,
        data: recipe,
        message: 'Recette récupérée avec succès'
      };
      
      res.json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      res.status(500).json(response);
    }
  }

  // POST /api/recipes/generate - Générer une nouvelle recette avec l'IA
  async generateRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { ingredients, servings, allergies, type, difficulty }: AIRecipeRequest = req.body;
      
      // Validation des données d'entrée
      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Au moins un ingrédient est requis'
        };
        res.status(400).json(response);
        return;
      }
      
      if (!servings || servings < 1 || servings > 20) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Le nombre de portions doit être entre 1 et 20'
        };
        res.status(400).json(response);
        return;
      }
      
      // Générer la recette avec l'IA
      const aiRecipe = await aiService.generateRecipe({
        ingredients,
        servings,
        allergies: allergies || [],
        type,
        difficulty
      });
      
      // Sauvegarder la recette dans Airtable
      const savedRecipe = await airtableService.createRecipe(aiRecipe);
      
      const response: APIResponse<typeof savedRecipe> = {
        success: true,
        data: savedRecipe,
        message: 'Recette générée et sauvegardée avec succès'
      };
      
      res.status(201).json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      res.status(500).json(response);
    }
  }

  // PUT /api/recipes/:id - Mettre à jour une recette
  async updateRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedRecipe = await airtableService.updateRecipe(id, updates);
      
      const response: APIResponse<typeof updatedRecipe> = {
        success: true,
        data: updatedRecipe,
        message: 'Recette mise à jour avec succès'
      };
      
      res.json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      res.status(500).json(response);
    }
  }

  // DELETE /api/recipes/:id - Supprimer une recette
  async deleteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await airtableService.deleteRecipe(id);
      
      if (!success) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Impossible de supprimer la recette'
        };
        res.status(500).json(response);
        return;
      }
      
      const response: APIResponse<null> = {
        success: true,
        message: 'Recette supprimée avec succès'
      };
      
      res.json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      res.status(500).json(response);
    }
  }

  // POST /api/recipes/:id/favorite - Marquer/démarquer une recette comme favorite
  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const recipe = await airtableService.getRecipeById(id);
      
      if (!recipe) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Recette non trouvée'
        };
        res.status(404).json(response);
        return;
      }
      
      const updatedRecipe = await airtableService.updateRecipe(id, {
        isFavorite: !recipe.isFavorite
      });
      
      const response: APIResponse<typeof updatedRecipe> = {
        success: true,
        data: updatedRecipe,
        message: `Recette ${updatedRecipe.isFavorite ? 'ajoutée aux' : 'retirée des'} favoris`
      };
      
      res.json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      res.status(500).json(response);
    }
  }

  // POST /api/recipes/analyze-nutrition - Analyser les valeurs nutritionnelles d'ingrédients
  async analyzeNutrition(req: Request, res: Response): Promise<void> {
    try {
      const { ingredients, servings } = req.body;
      
      if (!ingredients || !servings) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Ingrédients et nombre de portions requis'
        };
        res.status(400).json(response);
        return;
      }
      
      const nutrition = await aiService.analyzeNutrition(ingredients, servings);
      
      const response: APIResponse<typeof nutrition> = {
        success: true,
        data: nutrition,
        message: 'Analyse nutritionnelle réalisée avec succès'
      };
      
      res.json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      res.status(500).json(response);
    }
  }
}

export const recipeController = new RecipeController(); 