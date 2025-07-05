import { tables } from '../config/database';
import type { 
  AirtableRecipe, 
  Recipe, 
  RecipeQuery, 
  AIRecipeResponse,
  NutritionInfo,
  PaginatedResponse
} from '../types';

export class AirtableService {
  
  // Convertir un enregistrement Airtable en objet Recipe
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      private transformAirtableRecord(record: any): Recipe {
    const fields = record.fields || {};
    
    // Parser les valeurs nutritionnelles si elles existent
    let nutrition: NutritionInfo;
    try {
      nutrition = fields.nutrition ? JSON.parse(fields.nutrition) : {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        vitamins: { a: 0, c: 0, d: 0 },
        minerals: { calcium: 0, iron: 0, magnesium: 0 }
      };
    } catch {
      nutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        vitamins: { a: 0, c: 0, d: 0 },
        minerals: { calcium: 0, iron: 0, magnesium: 0 }
      };
    }

    return {
      id: record.id,
      title: fields.titre || '',
      description: fields.description || '',
      type: fields.type || '',
      difficulty: fields.difficulté || '',
      prepTime: fields.tempsPreparation || 0,
      cookTime: fields.tempsCuisson || 0,
      servings: fields.portions || 1,
      ingredients: fields.ingredients || '',
      instructions: fields.instructions || '',
      nutrition,
      allergies: fields.allergenes || [],
      imageUrl: fields.imageUrl,
      createdAt: fields.dateCreation || record.createdTime,
      isFavorite: fields.estFavori || false
    };
  }

  // Récupérer toutes les recettes avec pagination et filtres
  async getRecipes(query: RecipeQuery = {}): Promise<PaginatedResponse<Recipe>> {
    try {
      console.log('🔍 Tentative de récupération des recettes...');
      const { search, type, difficulty, allergies, page = 1, limit = 10 } = query;
      
      // Construire la formule de filtre Airtable
      const filters: string[] = [];
      
      if (search) {
        filters.push(`OR(
          SEARCH("${search}", {titre}),
          SEARCH("${search}", {description}),
          SEARCH("${search}", {ingredients})
        )`);
      }
      
      if (type) {
        filters.push(`{type} = "${type}"`);
      }
      
      if (difficulty) {
        filters.push(`{difficulté} = "${difficulty}"`);
      }
      
      if (allergies && allergies.length > 0) {
        // Exclure les recettes contenant ces allergènes
        const allergyFilters = allergies.map(allergy => 
          `NOT(FIND("${allergy}", ARRAYJOIN({allergenes}, ",")))`
        );
        filters.push(allergyFilters.join(' AND '));
      }
      
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const records: any[] = [];
      
      console.log('📡 Appel à Airtable en cours...');
      // Configuration de la requête Airtable
      let selectOptions: any;
      
      if (filters.length > 0) {
        selectOptions = {
          sort: [{ field: 'dateCreation', direction: 'desc' }],
          pageSize: 100,
          filterByFormula: `AND(${filters.join(', ')})`
        };
        console.log('🔍 Filtre appliqué:', selectOptions.filterByFormula);
      } else {
        selectOptions = {
          sort: [{ field: 'dateCreation', direction: 'desc' }],
          pageSize: 100
        };
        console.log('🔍 Aucun filtre, récupération de tous les enregistrements');
      }
      
      await tables.recipes.select(selectOptions).eachPage((pageRecords, fetchNextPage) => {
        console.log(`📄 Page reçue avec ${pageRecords.length} enregistrements`);
        records.push(...pageRecords);
        fetchNextPage();
      });
      
      console.log(`✅ Total des enregistrements récupérés: ${records.length}`);
      
      // Pagination manuelle
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedRecords = records.slice(startIndex, endIndex);
      
      const recipes = paginatedRecords.map(record => this.transformAirtableRecord(record));
      
      return {
        data: recipes,
        pagination: {
          page,
          limit,
          total: records.length,
          totalPages: Math.ceil(records.length / limit)
        }
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des recettes:', error);
      console.error('Détails de l\'erreur:', {
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error('Impossible de récupérer les recettes');
    }
  }

  // Récupérer une recette par son ID
  async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      const record = await tables.recipes.find(id);
      return this.transformAirtableRecord(record);
    } catch (error) {
      console.error('Erreur lors de la récupération de la recette:', error);
      return null;
    }
  }

  // Créer une nouvelle recette
  async createRecipe(recipeData: AIRecipeResponse): Promise<Recipe> {
    console.log('💾 Tentative de création de recette...');
    console.log('Données reçues:', JSON.stringify(recipeData, null, 2));
    
    const nutritionString = JSON.stringify(recipeData.nutrition);
    
    // Convertir les données en chaînes pour Airtable
    let ingredientsString = '';
    let instructionsString = '';
    
    if (Array.isArray(recipeData.ingredients)) {
      // Si c'est un tableau d'objets, extraire les noms
      ingredientsString = recipeData.ingredients.map(ingredient => {
        if (typeof ingredient === 'object' && ingredient.name) {
          return `${ingredient.quantity || ''} ${ingredient.name}`.trim();
        }
        return ingredient.toString();
      }).join('\n');
    } else {
      ingredientsString = recipeData.ingredients;
    }
    
    if (Array.isArray(recipeData.instructions)) {
      instructionsString = recipeData.instructions.join('\n');
    } else {
      instructionsString = recipeData.instructions;
    }
    
    // Mapper les valeurs vers les options autorisées par Airtable
    const mappedType = recipeData.type || 'Entrée';
    const mappedDifficulty = recipeData.difficulty || 'Facile';
    
    console.log('🔄 Valeurs mappées:', { 
      originalType: recipeData.type, 
      mappedType, 
      originalDifficulty: recipeData.difficulty, 
      mappedDifficulty 
    });
    
    try {
      const fieldsToCreate = {
        titre: recipeData.title,
        description: recipeData.description,
        type: mappedType,
        difficulté: mappedDifficulty,
        tempsPreparation: recipeData.prepTime || 0,
        tempsCuisson: recipeData.cookTime || 0,
        portions: recipeData.servings || 2,
        ingredients: ingredientsString,
        instructions: instructionsString,
        nutrition: nutritionString,
        dateCreation: new Date().toISOString().split('T')[0],
        estFavori: false
      };
      
      console.log('📝 Champs à créer (avec mapping):', JSON.stringify(fieldsToCreate, null, 2));
      
      const record = await tables.recipes.create(fieldsToCreate);
      
      console.log('✅ Recette créée avec succès:', record.id);
      console.log('📄 Réponse Airtable:', JSON.stringify(record.fields, null, 2));
      
      return this.transformAirtableRecord(record);
    } catch (error) {
      console.error('❌ Erreur lors de la création de la recette:', error);
      console.error('📋 Détails de l\'erreur:', {
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Si le problème persiste avec les champs de sélection, créons sans eux
      console.log('🔄 Tentative de création sans champs de sélection...');
      try {
        const minimalRecord = await tables.recipes.create({
          titre: recipeData.title || 'Recette générée',
          description: recipeData.description || 'Description générée par IA',
          tempsPreparation: recipeData.prepTime || 0,
          tempsCuisson: recipeData.cookTime || 0,
          portions: recipeData.servings || 2,
          ingredients: ingredientsString,
          instructions: instructionsString,
          nutrition: nutritionString,
          dateCreation: new Date().toISOString().split('T')[0],
          estFavori: false
        });
        console.log('✅ Recette minimale créée:', minimalRecord.id);
        console.log('📄 Réponse Airtable minimale:', JSON.stringify(minimalRecord.fields, null, 2));
        return this.transformAirtableRecord(minimalRecord);
      } catch (minimalError) {
        console.error('❌ Échec création minimale:', minimalError);
        throw new Error('Impossible de créer la recette dans Airtable');
      }
    }
  }

  // Mettre à jour une recette
  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const updateFields: any = {};
      
      if (updates.title) updateFields.titre = updates.title;
      if (updates.description) updateFields.description = updates.description;
      if (updates.type) updateFields.type = updates.type;
      if (updates.difficulty) updateFields.difficulté = updates.difficulty;
      if (updates.prepTime !== undefined) updateFields.tempsPreparation = updates.prepTime;
      if (updates.cookTime !== undefined) updateFields.tempsCuisson = updates.cookTime;
      if (updates.servings !== undefined) updateFields.portions = updates.servings;
      if (updates.ingredients) updateFields.ingredients = updates.ingredients;
      if (updates.instructions) updateFields.instructions = updates.instructions;
      if (updates.nutrition) updateFields.nutrition = JSON.stringify(updates.nutrition);
      if (updates.allergies) updateFields.allergenes = updates.allergies;
      if (updates.imageUrl) updateFields.imageUrl = updates.imageUrl;
      if (updates.isFavorite !== undefined) updateFields.estFavori = updates.isFavorite;
      
      const record = await tables.recipes.update(id, updateFields);
      return this.transformAirtableRecord(record);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la recette:', error);
      throw new Error('Impossible de mettre à jour la recette');
    }
  }

  // Supprimer une recette
  async deleteRecipe(id: string): Promise<boolean> {
    try {
      await tables.recipes.destroy(id);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la recette:', error);
      return false;
    }
  }

  // Récupérer tous les allergènes
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async getAllergenes(): Promise<any[]> {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const records: any[] = [];
      
      await tables.allergenes.select().eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords.map(record => ({
          id: record.id,
          nom: record.fields.nom,
          description: record.fields.description
        })));
        fetchNextPage();
      });
      
      return records;
    } catch (error) {
      console.error('Erreur lors de la récupération des allergènes:', error);
      throw new Error('Impossible de récupérer les allergènes');
    }
  }

  // Récupérer tous les types de plats
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async getTypesPlats(): Promise<any[]> {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const records: any[] = [];
      
      await tables.typesPlats.select().eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords.map(record => ({
          id: record.id,
          nom: record.fields.nom,
          description: record.fields.description
        })));
        fetchNextPage();
      });
      
      return records;
    } catch (error) {
      console.error('Erreur lors de la récupération des types de plats:', error);
      throw new Error('Impossible de récupérer les types de plats');
    }
  }

  // Récupérer tous les ingrédients
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async getIngredients(): Promise<any[]> {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const records: any[] = [];
      
      await tables.ingredients.select().eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords.map(record => ({
          id: record.id,
          nom: record.fields.nom,
          categorie: record.fields.categorie,
          uniteParDefaut: record.fields.uniteParDefaut
        })));
        fetchNextPage();
      });
      
      return records;
    } catch (error) {
      console.error('Erreur lors de la récupération des ingrédients:', error);
      throw new Error('Impossible de récupérer les ingrédients');
    }
  }
}

export const airtableService = new AirtableService(); 