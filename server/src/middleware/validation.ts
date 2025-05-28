import type { Request, Response, NextFunction } from 'express';
import { z, type ZodError } from 'zod';
import type { APIResponse } from '../types';

// Schéma de validation pour la génération de recette
const generateRecipeSchema = z.object({
  ingredients: z.array(z.string()).min(1, 'Au moins un ingrédient est requis'),
  servings: z.number().min(1).max(20, 'Le nombre de portions doit être entre 1 et 20'),
  allergies: z.array(z.string()).optional(),
  type: z.string().optional(),
  difficulty: z.string().optional()
});

// Schéma de validation pour l'analyse nutritionnelle
const analyzeNutritionSchema = z.object({
  ingredients: z.string().min(1, 'La liste d\'ingrédients est requise'),
  servings: z.number().min(1).max(20, 'Le nombre de portions doit être entre 1 et 20')
});

// Schéma de validation pour la mise à jour de recette
const updateRecipeSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  difficulty: z.string().optional(),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
  servings: z.number().min(1).max(20).optional(),
  ingredients: z.string().optional(),
  instructions: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  isFavorite: z.boolean().optional()
});

// Fonction utilitaire pour créer un middleware de validation
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Données invalides',
          message: error.errors.map((e: ZodError['errors'][number]) => `${e.path.join('.')}: ${e.message}`).join(', ')
        };
        res.status(400).json(response);
        return;
      }
      next(error);
    }
  };
};

// Middlewares de validation spécifiques
export const validateGenerateRecipe = validateRequest(generateRecipeSchema);
export const validateAnalyzeNutrition = validateRequest(analyzeNutritionSchema);
export const validateUpdateRecipe = validateRequest(updateRecipeSchema);

// Validation des paramètres de requête pour la recherche
export const validateRecipeQuery = (req: Request, res: Response, next: NextFunction): void => {
  const { page, limit } = req.query;
  
  if (page && Number.isNaN(Number(page))) {
    const response: APIResponse<null> = {
      success: false,
      error: 'Le paramètre page doit être un nombre'
    };
    res.status(400).json(response);
    return;
  }
  
  if (limit && Number.isNaN(Number(limit))) {
    const response: APIResponse<null> = {
      success: false,
      error: 'Le paramètre limit doit être un nombre'
    };
    res.status(400).json(response);
    return;
  }
  
  if (limit && Number(limit) > 100) {
    const response: APIResponse<null> = {
      success: false,
      error: 'Le paramètre limit ne peut pas dépasser 100'
    };
    res.status(400).json(response);
    return;
  }
  
  next();
}; 