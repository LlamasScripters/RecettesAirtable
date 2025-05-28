// Types basés sur la structure Airtable définie dans la documentation
export interface AirtableRecipe {
  id: string;
  createdTime: string;
  fields: {
    id?: number;
    titre?: string;
    description?: string;
    type?: string;
    difficulté?: string;
    tempsPreparation?: number;
    tempsCuisson?: number;
    portions?: number;
    ingredients?: string;
    instructions?: string;
    nutrition?: string;
    allergenes?: string[];
    imageUrl?: string;
    dateCreation?: string;
    estFavori?: boolean;
  };
}

export interface AirtableIngredient {
  id: string;
  createdTime: string;
  fields: {
    id?: number;
    nom?: string;
    categorie?: string;
    uniteParDefaut?: string;
    valeurNutritionnelle?: string;
    allergenes?: string[];
  };
}

export interface AirtableTypePlat {
  id: string;
  createdTime: string;
  fields: {
    id?: number;
    nom?: string;
    description?: string;
  };
}

export interface AirtableAllergene {
  id: string;
  createdTime: string;
  fields: {
    id?: number;
    nom?: string;
    description?: string;
    Ingrédients?: string[];
    Recettes?: string[];
  };
}

// Types pour l'API
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitamins: {
    a: number;
    c: number;
    d: number;
  };
  minerals: {
    calcium: number;
    iron: number;
    magnesium: number;
  };
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string;
  instructions: string;
  nutrition: NutritionInfo;
  allergies: string[];
  imageUrl?: string;
  createdAt: string;
  isFavorite: boolean;
}

export interface RecipeFormInput {
  ingredients: string[];
  servings: number;
  allergies: string[];
}

export interface RecipeQuery {
  search?: string;
  type?: string;
  difficulty?: string;
  allergies?: string[];
  page?: number;
  limit?: number;
}

export interface AIRecipeRequest {
  ingredients: string[];
  servings: number;
  allergies: string[];
  type?: string;
  difficulty?: string;
}

export interface AIRecipeResponse {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string;
  instructions: string;
  nutrition: NutritionInfo;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 