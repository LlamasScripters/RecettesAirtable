export type NutritionInfo = {
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
  };
  
  export type Ingredient = {
    id: string;
    name: string;
    quantity: string;
    unit: string;
  };
  
  export type RecipeType = 
    | "entrée" 
    | "plat principal" 
    | "dessert" 
    | "boisson" 
    | "apéritif" 
    | "accompagnement";
  
  export type DifficultyLevel = "facile" | "moyen" | "difficile";
  
  export type Allergy = 
    | "gluten" 
    | "lactose" 
    | "oeufs" 
    | "fruits à coque" 
    | "arachides" 
    | "soja" 
    | "poisson" 
    | "crustacés";
  
  export type Recipe = {
    id: string;
    title: string;
    description: string;
    type: RecipeType;
    difficulty: DifficultyLevel;
    prepTime: number; // in minutes
    cookTime: number; // in minutes
    servings: number;
    ingredients: Ingredient[];
    instructions: string[];
    nutrition: NutritionInfo;
    allergies: Allergy[];
    imageUrl?: string;
    createdAt: Date;
  };
  
  export type RecipeFormInput = {
    ingredients: string[];
    servings: number;
    allergies: Allergy[];
  };
  
  export type RecipeQuery = {
    search?: string;
    type?: RecipeType;
    difficulty?: DifficultyLevel;
    allergies?: Allergy[];
  };