import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Users, Heart, Star, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useRecipe, useToggleFavorite } from "../../../hooks/useRecipes";

export const Route = createFileRoute(
  "/_authenticated/recipes/$recipeId"
)({
  component: RecipeDetailPage,
  notFoundComponent: () => (
    <div className="flex flex-col h-full min-h-screen bg-gray-50 items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Recette introuvable</h1>
        <p className="text-gray-600 mb-6">
          Cette recette n'existe pas ou a été supprimée.
        </p>
        <Link
          to="/recipes"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux recettes
        </Link>
      </div>
    </div>
  ),
});

function RecipeDetailPage() {
  const { recipeId } = Route.useParams();
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipe(recipeId);
  const toggleFavoriteMutation = useToggleFavorite();

  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');

  const handleGoBack = () => {
    navigate({ to: '/recipes' });
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    
    try {
      await toggleFavoriteMutation.mutateAsync(recipe.id);
    } catch (error) {
      console.error('Erreur lors du changement de statut favori:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de la recette...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux recettes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'facile':
        return 'bg-green-100 text-green-800';
      case 'moyen':
        return 'bg-yellow-100 text-yellow-800';
      case 'difficile':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux recettes
            </Button>
            
            <Button
              onClick={handleToggleFavorite}
              disabled={toggleFavoriteMutation.isPending}
              variant="outline"
              className={`flex items-center ${recipe.isFavorite ? 'text-red-500 border-red-200' : ''}`}
            >
              <Heart 
                className={`w-4 h-4 mr-2 ${recipe.isFavorite ? 'fill-red-500' : ''}`} 
              />
              {recipe.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {recipe.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {recipe.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Préparation: {recipe.prepTime || 'N/A'} min</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Cuisson: {recipe.cookTime || 'N/A'} min</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{recipe.servings} portions</span>
                </div>
                {recipe.difficulty && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('ingredients')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ingredients'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ingrédients
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('instructions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'instructions'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Instructions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nutrition')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'nutrition'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nutrition
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'ingredients' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ingrédients pour {recipe.servings} portions
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.split('\n').filter(ingredient => ingredient.trim()).map((ingredient, index) => (
                  <li key={`ingredient-${recipe.id}-${index}`} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{ingredient.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Instructions de préparation
              </h3>
              <ol className="space-y-4">
                {recipe.instructions.split('\n').filter(instruction => instruction.trim()).map((instruction, index) => (
                  <li key={`instruction-${recipe.id}-${index}`} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-sm font-medium rounded-full mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction.trim()}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informations nutritionnelles
              </h3>
              {recipe.nutrition ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Macronutriments</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calories</span>
                        <span className="text-gray-900">{recipe.nutrition.calories || 'N/A'} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protéines</span>
                        <span className="text-gray-900">{recipe.nutrition.protein || 'N/A'}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Glucides</span>
                        <span className="text-gray-900">{recipe.nutrition.carbs || 'N/A'}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lipides</span>
                        <span className="text-gray-900">{recipe.nutrition.fat || 'N/A'}g</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Vitamines et minéraux</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vitamine A</span>
                        <span className="text-gray-900">{recipe.nutrition.vitamins?.a || 'N/A'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vitamine C</span>
                        <span className="text-gray-900">{recipe.nutrition.vitamins?.c || 'N/A'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calcium</span>
                        <span className="text-gray-900">{recipe.nutrition.minerals?.calcium || 'N/A'}mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fer</span>
                        <span className="text-gray-900">{recipe.nutrition.minerals?.iron || 'N/A'}mg</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Aucune information nutritionnelle disponible pour cette recette.</p>
              )}
            </div>
          )}
        </div>

        {/* Allergènes */}
        {recipe.allergies && recipe.allergies.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Allergènes</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.allergies.map((allergene, index) => (
                <span
                  key={`allergene-${recipe.id}-${index}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  {allergene}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
