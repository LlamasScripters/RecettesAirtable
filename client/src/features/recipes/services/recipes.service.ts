import type {
  Allergy,
  DifficultyLevel,
  Recipe,
  RecipeFormInput,
  RecipeQuery,
  RecipeType,
} from "@/types";
import {
  filterRecipesByAllergies,
  filterRecipesByDifficulty,
  filterRecipesByType,
  generateMockRecipes,
  searchRecipes,
} from "@/lib/mock-data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let recipeCache: Recipe[] | null = null;

export const RecipeService = {
  getRecipes: async (): Promise<Recipe[]> => {
    await delay(500);

    if (!recipeCache) {
      recipeCache = generateMockRecipes();
    }

    return recipeCache;
  },

  getRecipeById: async (id: string): Promise<Recipe | null> => {
    await delay(300);

    if (!recipeCache) {
      recipeCache = generateMockRecipes();
    }

    const recipe = recipeCache.find((r) => r.id === id);
    return recipe || null;
  },

  searchRecipes: async (query: RecipeQuery): Promise<Recipe[]> => {
    await delay(400);

    if (!recipeCache) {
      recipeCache = generateMockRecipes();
    }

    let filteredRecipes = [...recipeCache];

    if (query.search) {
      filteredRecipes = searchRecipes(filteredRecipes, query.search);
    }

    if (query.type) {
      filteredRecipes = filterRecipesByType(filteredRecipes, query.type);
    }

    if (query.difficulty) {
      filteredRecipes = filterRecipesByDifficulty(
        filteredRecipes,
        query.difficulty
      );
    }

    if (query.allergies && query.allergies.length > 0) {
      filteredRecipes = filterRecipesByAllergies(
        filteredRecipes,
        query.allergies
      );
    }

    return filteredRecipes;
  },

  createRecipe: async (recipeInput: RecipeFormInput): Promise<Recipe> => {
    await delay(800);

    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      title: `Recette personnalisée (${recipeInput.ingredients.slice(0, 2).join(", ")})`,
      description: `Une recette personnalisée créée avec les ingrédients suivants: ${recipeInput.ingredients.join(", ")}`,
      type: "plat principal",
      difficulty: "moyen",
      prepTime: 20,
      cookTime: 30,
      servings: recipeInput.servings,
      ingredients: recipeInput.ingredients.map((name) => ({
        id: crypto.randomUUID(),
        name,
        quantity: "à définir",
        unit: "",
      })),
      instructions: [
        "Instructions à venir...",
        "Cette recette a été générée automatiquement.",
      ],
      nutrition: {
        calories: 350,
        protein: 15,
        carbs: 40,
        fat: 12,
        vitamins: {
          a: 10,
          c: 15,
          d: 5,
        },
        minerals: {
          calcium: 8,
          iron: 10,
          magnesium: 7,
        },
      },
      allergies: recipeInput.allergies,
      imageUrl:
        "https://via.placeholder.com/300x200?text=Recette+Personnalisée",
      createdAt: new Date(),
    };

    // Ajouter la nouvelle recette au cache
    if (recipeCache) {
      recipeCache = [newRecipe, ...recipeCache];
    } else {
      recipeCache = [newRecipe];
    }

    return newRecipe;
  },

  getRecipeTypes: async (): Promise<RecipeType[]> => {
    await delay(200);
    return [
      "entrée",
      "plat principal",
      "dessert",
      "boisson",
      "apéritif",
      "accompagnement",
    ];
  },

  getDifficultyLevels: async (): Promise<DifficultyLevel[]> => {
    await delay(200);
    return ["facile", "moyen", "difficile"];
  },

  getAllergies: async (): Promise<Allergy[]> => {
    await delay(200);
    return [
      "gluten",
      "lactose",
      "oeufs",
      "fruits à coque",
      "arachides",
      "soja",
      "poisson",
      "crustacés",
    ];
  },
};
