import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Search, Filter, Plus, Loader2, ChefHat } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { RecipeCard } from '../../../components/RecipeCard';
import { useRecipes } from '../../../hooks/useRecipes';
import { useMetadata } from '../../../hooks/useMetadata';
import type { RecipeQuery } from '../../../types';

export const Route = createFileRoute('/_authenticated/categories/$type')({
  component: CategoryPage,
});

// Mapping des types URL vers les noms affichés et les types Airtable
const categoryMapping = {
  'starters': { 
    name: 'Entrées', 
    airtableType: 'Entrée',
    description: 'Commencez votre repas en beauté',
    icon: '🥗'
  },
  'main-dishes': { 
    name: 'Plats principaux', 
    airtableType: 'Plat principal',
    description: 'Le cœur de votre repas',
    icon: '🍽️'
  },
  'desserts': { 
    name: 'Desserts', 
    airtableType: 'Dessert',
    description: 'Une note sucrée pour finir',
    icon: '🍰'
  },
  'sides': { 
    name: 'Accompagnements', 
    airtableType: 'Accompagnement',
    description: 'Parfaits pour compléter vos plats',
    icon: '🥖'
  },
  'drinks': { 
    name: 'Boissons', 
    airtableType: 'Boisson',
    description: 'Rafraîchissements et boissons chaudes',
    icon: '🥤'
  }
} as const;

function CategoryPage() {
  const navigate = useNavigate();
  const { type } = Route.useParams();
  const category = categoryMapping[type as keyof typeof categoryMapping];
  
  const [query, setQuery] = useState<RecipeQuery>({
    page: 1,
    limit: 12,
    type: category?.airtableType,
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

  // Si la catégorie n'existe pas, rediriger
  if (!category) {
    navigate({ to: '/recipes' });
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                  <p className="text-gray-600 mt-1">{category.description}</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleCreateRecipe}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Générer une recette
            </Button>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Barre de recherche */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Rechercher dans les ${category.name.toLowerCase()}...`}
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

            {/* Filtre par difficulté */}
            <div>
              <select
                value={query.difficulty || ''}
                onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
            <span className="ml-2 text-gray-600">Chargement des {category.name.toLowerCase()}...</span>
          </div>
        ) : recipesData?.data.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune recette trouvée
              </h3>
              <p className="text-gray-600 mb-4">
                Il n'y a pas encore de {category.name.toLowerCase()} correspondant à vos critères.
              </p>
              <Button onClick={handleCreateRecipe} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Créer une recette
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="mb-6">
              <p className="text-gray-600">
                {recipesData?.pagination.total} {category.name.toLowerCase()} trouvée{(recipesData?.pagination.total || 0) > 1 ? 's' : ''}
              </p>
            </div>

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
                          <span key={`ellipsis-${page}`} className="px-2 text-gray-400">...</span>
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