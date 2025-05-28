import axios from 'axios';
import type { AIRecipeRequest, AIRecipeResponse, NutritionInfo } from '../types';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

export class AIService {
  private async callOllama(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        format: 'json'
      });

      return response.data.response;
    } catch (error) {
      console.error('Erreur lors de l\'appel à Ollama:', error);
      throw new Error('Service IA temporairement indisponible');
    }
  }

  private createRecipePrompt(request: AIRecipeRequest): string {
    const allergiesText = request.allergies.length > 0 
      ? `IMPORTANT: Cette recette ne doit contenir AUCUN de ces allergènes: ${request.allergies.join(', ')}.` 
      : '';

    return `
Tu es un chef cuisinier expert. Crée une recette détaillée en français avec les contraintes suivantes:

Ingrédients disponibles: ${request.ingredients.join(', ')}
Nombre de portions: ${request.servings}
${allergiesText}
${request.type ? `Type de plat: ${request.type}` : ''}
${request.difficulty ? `Difficulté: ${request.difficulty}` : ''}

Réponds UNIQUEMENT avec un JSON valide contenant exactement ces champs:
{
  "title": "Titre de la recette",
  "description": "Description courte et appétissante",
  "type": "Entrée|Plat principal|Dessert|Boisson|Accompagnement",
  "difficulty": "Facile|Moyen|Difficile",
  "prepTime": nombre_en_minutes,
  "cookTime": nombre_en_minutes,
  "servings": ${request.servings},
  "ingredients": "Liste des ingrédients sous forme de TEXTE SIMPLE, par exemple: 2 tomates\\n1 cuillère à soupe d'huile d'olive\\n100g de basilic frais",
  "instructions": "Instructions étape par étape sous forme de TEXTE SIMPLE, par exemple: Étape 1: Lavez les tomates\\nÉtape 2: Chauffez l'huile\\nÉtape 3: Faites cuire 10 minutes",
  "nutrition": {
    "calories": nombre_calories_par_portion,
    "protein": grammes_proteines,
    "carbs": grammes_glucides,
    "fat": grammes_lipides,
    "vitamins": {
      "a": pourcentage_AJR,
      "c": pourcentage_AJR,
      "d": pourcentage_AJR
    },
    "minerals": {
      "calcium": milligrammes,
      "iron": milligrammes,
      "magnesium": milligrammes
    }
  }
}

RÈGLES ABSOLUES:
- Le champ "type" doit être EXACTEMENT l'une de ces valeurs: "Entrée", "Plat principal", "Dessert", "Boisson", "Accompagnement"
- Le champ "difficulty" doit être EXACTEMENT l'une de ces valeurs: "Facile", "Moyen", "Difficile"
- Les champs "ingredients" et "instructions" doivent être des CHAÎNES DE CARACTÈRES simples, PAS des tableaux ou objets
- Respecte exactement la casse (majuscules/minuscules)
- Ne mets JAMAIS d'objets ou de tableaux dans les champs ingredients et instructions

La recette doit être créative, savoureuse et utiliser principalement les ingrédients fournis.
`;
  }

  private createNutritionPrompt(ingredients: string, servings: number): string {
    return `
Tu es un nutritionniste expert. Analyse ces ingrédients et calcule les valeurs nutritionnelles pour ${servings} portion(s):

Ingrédients: ${ingredients}

Réponds UNIQUEMENT avec un JSON valide:
{
  "calories": nombre_calories_par_portion,
  "protein": grammes_proteines_par_portion,
  "carbs": grammes_glucides_par_portion,
  "fat": grammes_lipides_par_portion,
  "vitamins": {
    "a": pourcentage_AJR_vitamine_A,
    "c": pourcentage_AJR_vitamine_C,
    "d": pourcentage_AJR_vitamine_D
  },
  "minerals": {
    "calcium": milligrammes_calcium,
    "iron": milligrammes_fer,
    "magnesium": milligrammes_magnesium
  }
}

Base tes calculs sur des données nutritionnelles réelles et précises.
`;
  }

  async generateRecipe(request: AIRecipeRequest): Promise<AIRecipeResponse> {
    try {
      const prompt = this.createRecipePrompt(request);
      const response = await this.callOllama(prompt);
      
      // Nettoyer la réponse pour extraire le JSON
      let cleanResponse = response.trim();
      
      // Trouver le JSON dans la réponse
      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('Réponse IA invalide: JSON non trouvé');
      }
      
      cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      
      const recipe = JSON.parse(cleanResponse) as AIRecipeResponse;
      
      // Validation des champs requis
      if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
        throw new Error('Réponse IA incomplète');
      }
      
      return recipe;
    } catch (error) {
      console.error('Erreur lors de la génération de recette:', error);
      throw new Error('Impossible de générer la recette. Veuillez réessayer.');
    }
  }

  async analyzeNutrition(ingredients: string, servings: number): Promise<NutritionInfo> {
    try {
      const prompt = this.createNutritionPrompt(ingredients, servings);
      const response = await this.callOllama(prompt);
      
      // Nettoyer la réponse pour extraire le JSON
      let cleanResponse = response.trim();
      
      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('Réponse IA invalide: JSON non trouvé');
      }
      
      cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      
      const nutrition = JSON.parse(cleanResponse) as NutritionInfo;
      
      return nutrition;
    } catch (error) {
      console.error('Erreur lors de l\'analyse nutritionnelle:', error);
      throw new Error('Impossible d\'analyser les valeurs nutritionnelles. Veuillez réessayer.');
    }
  }
}

export const aiService = new AIService(); 