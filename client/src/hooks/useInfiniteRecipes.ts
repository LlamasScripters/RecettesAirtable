import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiService } from '../lib/api';
import type { RecipeQuery, Recipe } from '../types';

interface UseInfiniteRecipesOptions extends Omit<RecipeQuery, 'page' | 'limit'> {
  limit?: number;
  enabled?: boolean;
}

export function useInfiniteRecipes(options: UseInfiniteRecipesOptions = {}) {
  const { limit = 12, enabled = true, ...queryOptions } = options;

  const query = useInfiniteQuery({
    queryKey: ['recipes', 'infinite', queryOptions],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await apiService.getRecipes({
          ...queryOptions,
          page: pageParam,
          limit
        });
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Erreur lors de la récupération des recettes');
        }
        // L'API retourne un objet avec `data` qui contient les données paginées
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des recettes:', error);
        // Fallback vers des données mockées si disponibles
        const mockData = await import('../lib/mock-data');
        const mockRecipes = mockData.generateMockRecipes(limit);
        return {
          data: mockRecipes,
          pagination: {
            currentPage: pageParam,
            totalPages: Math.ceil(mockRecipes.length / limit),
            totalItems: mockRecipes.length,
            itemsPerPage: limit
          }
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const recipes = useMemo(() => {
    return query.data?.pages.flatMap(page => page.data) ?? [];
  }, [query.data]);

  const totalRecipes = query.data?.pages[0]?.pagination?.totalItems ?? 0;
  const hasNextPage = query.hasNextPage;
  const isLoadingMore = query.isFetchingNextPage;

  return {
    recipes,
    totalRecipes,
    hasNextPage,
    isLoadingMore,
    isLoading: query.isLoading,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    isRefetching: query.isRefetching
  };
}