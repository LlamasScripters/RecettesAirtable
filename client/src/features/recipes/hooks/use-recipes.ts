import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RecipeService } from "../services/recipes.service";
import type { RecipeFormInput, RecipeQuery } from "../../../types";

export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (filters: RecipeQuery) => [...recipeKeys.lists(), filters] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  types: () => [...recipeKeys.all, "types"] as const,
  difficulties: () => [...recipeKeys.all, "difficulties"] as const,
  allergies: () => [...recipeKeys.all, "allergies"] as const,
};

export function useRecipes(filters: RecipeQuery = {}) {
  return useQuery({
    queryKey: recipeKeys.list(filters),
    queryFn: () => RecipeService.searchRecipes(filters),
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => RecipeService.getRecipeById(id),
    retry: false,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: RecipeFormInput) => RecipeService.createRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

export function useRecipeTypes() {
  return useQuery({
    queryKey: recipeKeys.types(),
    queryFn: () => RecipeService.getRecipeTypes(),
    staleTime: Infinity,
  });
}

export function useDifficultyLevels() {
  return useQuery({
    queryKey: recipeKeys.difficulties(),
    queryFn: () => RecipeService.getDifficultyLevels(),
    staleTime: Infinity,
  });
}

export function useAllergies() {
  return useQuery({
    queryKey: recipeKeys.allergies(),
    queryFn: () => RecipeService.getAllergies(),
    staleTime: Infinity,
  });
}
