import {
  createFileRoute,
  Link,
  // notFound,
  useNavigate,
  // useParams,
} from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Heart, Clock, Users, ChefHat, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useRecipe, useToggleFavorite } from '../../hooks/useRecipes';
// import { z } from "zod";

type Message = {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type NutritionInfo = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitamins: {
    a: number;
    c: number;
    d: number;
  };
  minerals: {
    calcium: number;
    iron: number;
    magnesium: number;
  };
};

type RecipeDetail = {
  id: string;
  title: string;
  ingredients: string[];
  servings: number;
  instructions: string[];
  prepTime: number;
  cookTime: number;
  nutrition: NutritionInfo;
  allergies: string[];
};

export const Route = createFileRoute(
  "/recipes-old/$recipeId"
)({
  component: RecipeDetailPage,
  notFoundComponent: () => (
    <div className="flex flex-col h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Recette introuvable</h1>
        <p className="text-gray-600 mb-6">
          Cette conversation n'existe pas ou vous n'avez pas les droits
          suffisants pour y accéder.
        </p>
        <Link
          to="/recipes"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition"
        >
          Retour à la liste des conversations
        </Link>
      </div>
    </div>
  ),
});

function RecipeDetailPage() {
  const { recipeId } = Route.useParams();
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipe(recipeId);
  const toggleFavorite = useToggleFavorite();

  const [imageError, setImageError] = useState(false);

  const handleBack = () => {
    navigate({ to: '/recipes' });
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    try {
      await toggleFavorite.mutateAsync(recipe.id);
    } catch (error) {
      console.error('Erreur lors du toggle favori:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de la recette...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Recette introuvable</h1>
          <p className="text-gray-600 mb-6">
            Cette recette n'existe pas ou vous n'avez pas les droits pour y accéder.
          </p>
          <Button onClick={handleBack} className="bg-orange-500 hover:bg-orange-600">
            Retour aux recettes
          </Button>
        </div>
      </div>
    );
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

  const parseInstructions = (instructions: string): string[] => {
    if (!instructions) return [];
    // Diviser par les numéros (1., 2., etc.) ou par les sauts de ligne doubles
    return instructions
      .split(/(?:\d+\.\s*|\n\s*\n)/)
      .map(step => step.trim())
      .filter(step => step.length > 0);
  };

  const parseIngredients = (ingredients: string): string[] => {
    if (!ingredients) return [];
    // Diviser par virgule, point-virgule ou saut de ligne
    return ingredients
      .split(/[,;\n]/)
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux recettes
            </Button>
            <Button
              type="button"
              variant={recipe.isFavorite ? "default" : "outline"}
              onClick={handleToggleFavorite}
              disabled={toggleFavorite.isPending}
              className={recipe.isFavorite ? "bg-red-500 hover:bg-red-600 text-white" : ""}
            >
              <Heart className={`w-4 h-4 mr-1 ${recipe.isFavorite ? "fill-current" : ""}`} />
              {recipe.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Image de la recette */}
              <div className="h-64 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                {!imageError ? (
                  <img
                    src={`https://via.placeholder.com/800x400/f97316/ffffff?text=${encodeURIComponent(recipe.title)}`}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-orange-500">
                    <ChefHat className="w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">Photo de la recette</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Titre et badges */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    {recipe.type && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        {recipe.type}
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {recipe.description && (
                  <div className="mb-6">
                    <p className="text-gray-600 leading-relaxed">{recipe.description}</p>
                  </div>
                )}

                {/* Métadonnées */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="text-sm text-gray-500">Temps total</div>
                      <div className="font-semibold">{recipe.prepTime || 'N/A'} min</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="text-sm text-gray-500">Portions</div>
                      <div className="font-semibold">{recipe.servings || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <ChefHat className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="text-sm text-gray-500">Difficulté</div>
                      <div className="font-semibold">{recipe.difficulty || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
                  <div className="space-y-4">
                    {parseInstructions(recipe.instructions).map((step, index) => (
                      <div key={`instruction-${recipe.id}-${index}`} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergènes */}
                {recipe.allergies && recipe.allergies.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900 mb-2">Allergènes</h3>
                        <div className="flex flex-wrap gap-2">
                          {recipe.allergies.map((allergene) => (
                            <span key={allergene} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                              {allergene}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Ingrédients */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ingrédients</h2>
                <ul className="space-y-3">
                  {parseIngredients(recipe.ingredients).map((ingredient, index) => (
                    <li key={`ingredient-${recipe.id}-${index}`} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Informations nutritionnelles */}
              {recipe.nutrition && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Valeurs nutritionnelles</h2>
                  <div className="space-y-3">
                    {Object.entries(recipe.nutrition).map(([key, value]) => {
                      if (typeof value === 'object') return null;
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
