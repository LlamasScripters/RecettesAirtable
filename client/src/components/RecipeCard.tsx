import { Heart, Clock, Users, ChefHat } from 'lucide-react';
import { Button } from './ui/button';
import { useToggleFavorite } from '../hooks/useRecipes';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails?: (id: string) => void;
}

export function RecipeCard({ recipe, onViewDetails }: RecipeCardProps) {
  const toggleFavorite = useToggleFavorite();

  const handleToggleFavorite = () => {
    toggleFavorite.mutate(recipe.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(recipe.id);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image placeholder ou vraie image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-orange-300" />
          </div>
        )}
        
        {/* Badge type de plat */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {recipe.type}
          </span>
        </div>

        {/* Bouton favori */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={toggleFavorite.isPending}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              recipe.isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre et description */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {recipe.description}
          </p>
        </div>

        {/* Métadonnées */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{recipe.servings} pers.</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${
              recipe.difficulty === 'Facile' ? 'bg-green-400' :
              recipe.difficulty === 'Moyen' ? 'bg-orange-400' :
              'bg-red-400'
            }`} />
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        {/* Informations nutritionnelles */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold text-gray-900">{recipe.nutrition.calories}</div>
              <div className="text-gray-500">cal</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{recipe.nutrition.protein}g</div>
              <div className="text-gray-500">prot.</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{recipe.nutrition.carbs}g</div>
              <div className="text-gray-500">gluc.</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{recipe.nutrition.fat}g</div>
              <div className="text-gray-500">lip.</div>
            </div>
          </div>
        </div>

        {/* Allergènes */}
        {recipe.allergies.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {recipe.allergies.slice(0, 3).map((allergy) => (
                <span
                  key={allergy}
                  className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                >
                  {allergy}
                </span>
              ))}
              {recipe.allergies.length > 3 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  +{recipe.allergies.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bouton voir détails */}
        <Button
          onClick={handleViewDetails}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
        >
          Voir la recette
        </Button>
      </div>
    </div>
  );
} 