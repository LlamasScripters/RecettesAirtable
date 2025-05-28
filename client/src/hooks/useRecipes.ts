import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import type { Recipe, RecipeQuery, AIRecipeRequest } from '../types';

// Hook pour récupérer toutes les recettes
export function useRecipes(query: RecipeQuery = {}) {
  return useQuery({
    queryKey: ['recipes', query],
    queryFn: async () => {
      const response = await apiService.getRecipes(query);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de la récupération des recettes');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook pour récupérer une recette par ID
export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const response = await apiService.getRecipeById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de la récupération de la recette');
      }
      return response.data;
    },
    enabled: !!id,
  });
}

// Hook pour générer une nouvelle recette
export function useGenerateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AIRecipeRequest) => {
      const response = await apiService.generateRecipe(request);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de la génération de la recette');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalider le cache des recettes pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

// Hook pour mettre à jour une recette
export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Recipe> }) => {
      const response = await apiService.updateRecipe(id, updates);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de la mise à jour de la recette');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache local
      queryClient.setQueryData(['recipe', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

// Hook pour supprimer une recette
export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.deleteRecipe(id);
      if (!response.success || response.data === undefined) {
        throw new Error(response.error || 'Erreur lors de la suppression de la recette');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

// Hook pour basculer le statut favori
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.toggleFavorite(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de la mise à jour des favoris');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['recipe', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

// Hook pour analyser les valeurs nutritionnelles
export function useAnalyzeNutrition() {
  return useMutation({
    mutationFn: async (ingredients: string) => {
      const response = await apiService.analyzeNutrition(ingredients);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de l\'analyse nutritionnelle');
      }
      return response.data;
    },
  });
} 