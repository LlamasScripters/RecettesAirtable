import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useCallback, useEffect } from 'react';
import { Search, Filter, Plus, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { RecipeList } from '../../../components/RecipeList';
import { ViewModeToggle, type ViewMode } from '../../../components/ViewModeToggle';
import { useInfiniteRecipes } from '../../../hooks/useInfiniteRecipes';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { useMetadata } from '../../../hooks/useMetadata';
import type { RecipeQuery } from '../../../types';

export const Route = createFileRoute('/_authenticated/recipes/')({
  component: RecipesPage,
});

function RecipesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('recipe-view-mode') as ViewMode) || 'grid';
  });
  const [query, setQuery] = useState<Omit<RecipeQuery, 'page' | 'limit'>>({});

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

  const { data: metadata } = useMetadata();

  // Gestion de la persistance du mode d'affichage
  useEffect(() => {
    localStorage.setItem('recipe-view-mode', viewMode);
  }, [viewMode]);

  const handleSearch = useCallback((search: string) => {
    setQuery(prev => ({ ...prev, search: search || undefined }));
  }, []);

  const handleFilterChange = useCallback((key: keyof RecipeQuery, value: string | undefined) => {
    setQuery(prev => ({ ...prev, [key]: value }));
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

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center">
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
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header */}
      <div className="bg-card dark:bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Recettes</h1>
              <p className="text-muted-foreground mt-1">
                Découvrez et créez de délicieuses recettes
                {totalRecipes > 0 && ` • ${totalRecipes} recette${totalRecipes > 1 ? 's' : ''}`}
              </p>
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

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-card dark:bg-card rounded-lg shadow-sm border border-border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Barre de recherche */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une recette..."
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

            {/* Filtre par type */}
            <div>
              <select
                value={query.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Tous les types</option>
                {metadata?.typesPlats.map((type) => (
                  <option key={type.id} value={type.nom}>
                    {type.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par difficulté */}
            <div>
              <select
                value={query.difficulty || ''}
                onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Toutes difficultés</option>
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-muted-foreground">Chargement des recettes...</span>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Filter className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucune recette trouvée
              </h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier vos critères de recherche ou créez une nouvelle recette.
              </p>
              <Button onClick={handleCreateRecipe} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Créer une recette
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Liste des recettes avec layout adaptatif */}
            <RecipeList
              recipes={recipes}
              onViewDetails={handleViewRecipe}
              viewMode={viewMode}
            />

            {/* Infinite scroll loader */}
            {hasNextPage && (
              <div ref={loaderRef} className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span className="ml-2 text-muted-foreground">Chargement...</span>
              </div>
            )}

            {/* Indicateur de fin */}
            {!hasNextPage && recipes.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  Vous avez vu toutes les recettes disponibles
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 