import type { Request, Response } from 'express';
import { airtableService } from '../services/airtableService';
import type { APIResponse } from '../types';

export class MetadataController {

  // GET /api/metadata/allergenes - Récupérer tous les allergènes
  async getAllergenes(req: Request, res: Response): Promise<void> {
    try {
      const allergenes = await airtableService.getAllergenes();
      
      const response: APIResponse<typeof allergenes> = {
        success: true,
        data: allergenes,
        message: 'Allergènes récupérés avec succès'
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

  // GET /api/metadata/types-plats - Récupérer tous les types de plats
  async getTypesPlats(req: Request, res: Response): Promise<void> {
    try {
      const typesPlats = await airtableService.getTypesPlats();
      
      const response: APIResponse<typeof typesPlats> = {
        success: true,
        data: typesPlats,
        message: 'Types de plats récupérés avec succès'
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

  // GET /api/metadata/ingredients - Récupérer tous les ingrédients
  async getIngredients(req: Request, res: Response): Promise<void> {
    try {
      const ingredients = await airtableService.getIngredients();
      
      const response: APIResponse<typeof ingredients> = {
        success: true,
        data: ingredients,
        message: 'Ingrédients récupérés avec succès'
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

  // GET /api/metadata/all - Récupérer toutes les métadonnées
  async getAllMetadata(req: Request, res: Response): Promise<void> {
    try {
      const [allergenes, typesPlats, ingredients] = await Promise.all([
        airtableService.getAllergenes(),
        airtableService.getTypesPlats(),
        airtableService.getIngredients()
      ]);
      
      const metadata = {
        allergenes,
        typesPlats,
        ingredients
      };
      
      const response: APIResponse<typeof metadata> = {
        success: true,
        data: metadata,
        message: 'Métadonnées récupérées avec succès'
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

export const metadataController = new MetadataController(); 