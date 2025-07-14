import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Search, Filter, Plus, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { RecipeCard } from '../../../components/RecipeCard';
import { useRecipes } from '../../../hooks/useRecipes';
import { useMetadata } from '../../../hooks/useMetadata';
import type { RecipeQuery } from '../../../types';

export const Route = createFileRoute('/_authenticated/recipes/')({
  component: RecipesPage,
});

function RecipesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState<RecipeQuery>({
    page: 1,
    limit: 12,
  });

  const { data: recipesData, isLoading, error } = useRecipes(query);
  const { data: metadata } = useMetadata();

  const handleSearch = (search: string) => {
    setQuery(prev => ({ ...prev, search: search || undefined, page: 1 }));
  };

  const handleFilterChange = (key: keyof RecipeQuery, value: string | undefined) => {
    setQuery(prev => ({ ...prev, [key]: value, page: 1 }));
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
              </p>
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
        ) : recipesData?.data.length === 0 ? (
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
            {/* Grille des recettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {recipesData?.data.map((recipe) => (
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