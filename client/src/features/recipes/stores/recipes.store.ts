import { create } from "zustand";
import type { Allergy, Recipe, RecipeQuery } from "../../../types";

interface RecipeStore {
  recentRecipes: Recipe[];
  favorites: Set<string>;
  lastSearch: RecipeQuery;
  allergies: Allergy[];
  darkMode: boolean;

  addRecentRecipe: (recipe: Recipe) => void;
  toggleFavorite: (recipeId: string) => void;
  setLastSearch: (query: RecipeQuery) => void;
  setAllergies: (allergies: Allergy[]) => void;
  toggleDarkMode: () => void;
  isFavorite: (recipeId: string) => boolean;
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recentRecipes: [],
  favorites: new Set<string>(),
  lastSearch: {},
  allergies: [],
  darkMode: false,

  addRecentRecipe: (recipe: Recipe) => {
    set((state) => {
      const filteredRecipes = state.recentRecipes.filter(
        (r) => r.id !== recipe.id
      );
      return {
        recentRecipes: [recipe, ...filteredRecipes].slice(0, 5),
      };
    });
  },

  toggleFavorite: (recipeId: string) => {
    set((state) => {
      const newFavorites = new Set(state.favorites);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      return { favorites: newFavorites };
    });
  },

  setLastSearch: (query: RecipeQuery) => {
    set({ lastSearch: query });
  },

  setAllergies: (allergies: Allergy[]) => {
    set({ allergies });
  },

  toggleDarkMode: () => {
    set((state) => ({ darkMode: !state.darkMode }));
  },

  isFavorite: (recipeId: string) => {
    return get().favorites.has(recipeId);
  },
}));
