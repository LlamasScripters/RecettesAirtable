import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Allergene, Recipe, RecipeQuery } from "../../../types";

interface RecipeStore {
  recentRecipes: Recipe[];
  favorites: Set<string>;
  lastSearch: RecipeQuery;
  allergies: Allergene[];
  darkMode: boolean;

  addRecentRecipe: (recipe: Recipe) => void;
  toggleFavorite: (recipeId: string) => void;
  setLastSearch: (query: RecipeQuery) => void;
  setAllergies: (allergies: Allergene[]) => void;
  toggleDarkMode: () => void;
  isFavorite: (recipeId: string) => boolean;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
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

      setAllergies: (allergies: Allergene[]) => {
        set({ allergies });
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      isFavorite: (recipeId: string) => {
        return get().favorites.has(recipeId);
      },
    }),
    {
      name: 'recipe-store',
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        favorites: Array.from(state.favorites),
        allergies: state.allergies,
        recentRecipes: state.recentRecipes
      }),
    }
  )
);
