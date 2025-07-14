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
    <div className="group relative bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border">
      {/* Image placeholder ou vraie image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-orange-300 dark:text-orange-600" />
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
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              recipe.isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre et description */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 mb-1">
            {recipe.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {recipe.description}
          </p>
        </div>

        {/* Métadonnées */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
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
        <div className="bg-muted rounded-lg p-3 mb-3">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold text-foreground">{recipe.nutrition.calories}</div>
              <div className="text-muted-foreground">cal</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">{recipe.nutrition.protein}g</div>
              <div className="text-muted-foreground">prot.</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">{recipe.nutrition.carbs}g</div>
              <div className="text-muted-foreground">gluc.</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">{recipe.nutrition.fat}g</div>
              <div className="text-muted-foreground">lip.</div>
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
                  className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded-full"
                >
                  {allergy}
                </span>
              ))}
              {recipe.allergies.length > 3 && (
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded-full">
                  +{recipe.allergies.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bouton voir détails */}
        <Button
          onClick={handleViewDetails}
          className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
          size="sm"
        >
          Voir la recette
        </Button>
      </div>
    </div>
  );
} 