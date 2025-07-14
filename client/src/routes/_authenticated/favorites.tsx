import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Search, Heart, Plus, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { RecipeCard } from '../../components/RecipeCard';
import { useRecipes } from '../../hooks/useRecipes';
import type { RecipeQuery } from '../../types';

export const Route = createFileRoute('/_authenticated/favorites')({
  component: FavoritesPage,
});

function FavoritesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState<RecipeQuery>({
    page: 1,
    limit: 12,
    // TODO: Ajouter un filtre pour les favoris quand l'API le supportera
  });

  const { data: recipesData, isLoading, error } = useRecipes(query);

  const handleSearch = (search: string) => {
    setQuery(prev => ({ ...prev, search: search || undefined, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  const handleViewRecipe = (id: string) => {
    navigate({ to: '/recipes/$recipeId', params: { recipeId: id } });
  };

  const handleCreateRecipe = () => {
    navigate({ to: '/recipes/new' });
  };

  // TODO: Filtrer les recettes favorites côté client en attendant l'API
  const favoriteRecipes = recipesData?.data || [];

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
                  </p>
                </div>
              </div>
            </div>
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
            {/* Statistiques */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                {favoriteRecipes.length} recette{favoriteRecipes.length > 1 ? 's' : ''} favorite{favoriteRecipes.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Grille des recettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onViewDetails={handleViewRecipe}
                />
              ))}
            </div>

            {/* Pagination */}
            {recipesData && recipesData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={query.page === 1}
                  onClick={() => handlePageChange((query.page || 1) - 1)}
                >
                  Précédent
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: recipesData.pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 ||
                      page === recipesData.pagination.totalPages ||
                      Math.abs(page - (query.page || 1)) <= 2
                    )
                    .map((page, index, array) => (
                      <>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span key={`ellipsis-${page}`} className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          key={page}
                          variant={page === query.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={page === query.page ? "bg-orange-500 hover:bg-orange-600" : ""}
                        >
                          {page}
                        </Button>
                      </>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={query.page === recipesData.pagination.totalPages}
                  onClick={() => handlePageChange((query.page || 1) + 1)}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}