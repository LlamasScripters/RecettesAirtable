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
  type?: string;
  difficulty?: string;
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

export interface Allergene {
  id: string;
  nom: string;
  description?: string;
}

export interface TypePlat {
  id: string;
  nom: string;
  description?: string;
}

export interface Ingredient {
  id: string;
  nom: string;
  categorie?: string;
  uniteParDefaut?: string;
}

export interface Metadata {
  allergenes: Allergene[];
  typesPlats: TypePlat[];
  ingredients: Ingredient[];
}

export type RecipeType = "Entrée" | "Plat principal" | "Dessert" | "Accompagnement" | "Boisson";
export type DifficultyLevel = "Facile" | "Moyen" | "Difficile";
export type Allergy = string; 