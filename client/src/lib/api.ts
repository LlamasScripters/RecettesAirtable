import type { 
  Recipe, 
  RecipeQuery, 
  AIRecipeRequest, 
  APIResponse, 
  PaginatedResponse, 
  Metadata,
  NutritionInfo 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Récupérer toutes les recettes avec filtres et pagination
  async getRecipes(query: RecipeQuery = {}): Promise<APIResponse<PaginatedResponse<Recipe>>> {
    const searchParams = new URLSearchParams();
    
    if (query.search) searchParams.append('search', query.search);
    if (query.type) searchParams.append('type', query.type);
    if (query.difficulty) searchParams.append('difficulty', query.difficulty);
    if (query.allergies?.length) {
      for (const allergy of query.allergies) {
        searchParams.append('allergies', allergy);
      }
    }
    if (query.page) searchParams.append('page', query.page.toString());
    if (query.limit) searchParams.append('limit', query.limit.toString());

    const endpoint = `/api/recipes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<Recipe>>(endpoint);
  }

  // Récupérer une recette par ID
  async getRecipeById(id: string): Promise<APIResponse<Recipe>> {
    return this.request<Recipe>(`/api/recipes/${id}`);
  }

  // Générer une nouvelle recette avec l'IA
  async generateRecipe(request: AIRecipeRequest): Promise<APIResponse<Recipe>> {
    return this.request<Recipe>('/api/recipes/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Analyser les valeurs nutritionnelles
  async analyzeNutrition(ingredients: string): Promise<APIResponse<NutritionInfo>> {
    return this.request<NutritionInfo>('/api/recipes/analyze-nutrition', {
      method: 'POST',
      body: JSON.stringify({ ingredients }),
    });
  }

  // Mettre à jour une recette
  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<APIResponse<Recipe>> {
    return this.request<Recipe>(`/api/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Supprimer une recette
  async deleteRecipe(id: string): Promise<APIResponse<boolean>> {
    return this.request<boolean>(`/api/recipes/${id}`, {
      method: 'DELETE',
    });
  }

  // Basculer le statut favori d'une recette
  async toggleFavorite(id: string): Promise<APIResponse<Recipe>> {
    return this.request<Recipe>(`/api/recipes/${id}/favorite`, {
      method: 'POST',
    });
  }

  // Récupérer toutes les métadonnées (allergènes, types, ingrédients)
  async getMetadata(): Promise<APIResponse<Metadata>> {
    return this.request<Metadata>('/api/metadata/all');
  }

  // Vérifier la santé de l'API
  async healthCheck(): Promise<APIResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/api/health');
  }
}

export const apiService = new ApiService();
export default apiService; 