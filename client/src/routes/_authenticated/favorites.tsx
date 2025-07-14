import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useCallback, useEffect } from 'react';
import { Search, Heart, Plus, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { RecipeList } from '../../components/RecipeList';
import { ViewModeToggle, type ViewMode } from '../../components/ViewModeToggle';
import { useInfiniteRecipes } from '../../hooks/useInfiniteRecipes';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import type { RecipeQuery } from '../../types';

export const Route = createFileRoute('/_authenticated/favorites')({
  component: FavoritesPage,
});

function FavoritesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('favorites-view-mode') as ViewMode) || 'grid';
  });
  const [query, setQuery] = useState<Omit<RecipeQuery, 'page' | 'limit'>>({
    // TODO: Ajouter un filtre pour les favoris quand l'API le supportera
  });

  const {
    recipes,
    totalRecipes,
    hasNextPage,
    isLoadingMore,
    isLoading,
    error,
    fetchNextPage,
    refetch,
    isRefetching
  } = useInfiniteRecipes(query);

  // Gestion de la persistance du mode d'affichage
  useEffect(() => {
    localStorage.setItem('favorites-view-mode', viewMode);
  }, [viewMode]);

  const handleSearch = useCallback((search: string) => {
    setQuery(prev => ({ ...prev, search: search || undefined }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      fetchNextPage();
    }
  }, [hasNextPage, isLoadingMore, fetchNextPage]);

  const { loaderRef } = useInfiniteScroll(handleLoadMore, {
    enabled: hasNextPage && !isLoadingMore
  });

  const handleViewRecipe = (id: string) => {
    navigate({ to: '/recipes/$recipeId', params: { recipeId: id } });
  };

  const handleCreateRecipe = () => {
    navigate({ to: '/recipes/new' });
  };

  // TODO: Filtrer les recettes favorites côté client en attendant l'API
  const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Erreur de chargement</h2>
          <p className="text-muted-foreground">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Mes Favoris</h1>
                  <p className="text-muted-foreground mt-1">
                    Vos recettes préférées en un seul endroit
                    {favoriteRecipes.length > 0 && ` • ${favoriteRecipes.length} favori${favoriteRecipes.length > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ViewModeToggle 
                viewMode={viewMode} 
                onViewModeChange={setViewMode}
              />
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                disabled={isRefetching}
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={handleCreateRecipe}
                className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Générer une recette
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans vos favoris..."
                className="pl-10"
                defaultValue={query.search || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const timeoutId = setTimeout(() => handleSearch(value), 300);
                  return () => clearTimeout(timeoutId);
                }}
              />
            </div>
          </div>
        </div>

        {/* Résultats */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-muted-foreground">Chargement de vos favoris...</span>
          </div>
        ) : favoriteRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucun favori pour le moment
              </h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez des recettes à vos favoris en cliquant sur le cœur lors de la consultation d'une recette.
              </p>
              <Button 
                onClick={() => navigate({ to: '/recipes' })} 
                className="bg-orange-500 hover:bg-orange-600 mr-2"
              >
                Découvrir des recettes
              </Button>
              <Button 
                onClick={handleCreateRecipe} 
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer une recette
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Liste des recettes favorites avec layout adaptatif */}
            <RecipeList
              recipes={favoriteRecipes}
              onViewDetails={handleViewRecipe}
              viewMode={viewMode}
            />

            {/* Infinite scroll loader */}
            {hasNextPage && favoriteRecipes.length > 0 && (
              <div ref={loaderRef} className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span className="ml-2 text-muted-foreground">Chargement...</span>
              </div>
            )}

            {/* Indicateur de fin */}
            {!hasNextPage && favoriteRecipes.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  Vous avez vu tous vos favoris
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}