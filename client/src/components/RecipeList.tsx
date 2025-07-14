import { Heart, Clock, Users, ChefHat } from 'lucide-react';
import { Button } from './ui/button';
import { useToggleFavorite } from '../hooks/useRecipes';
import type { Recipe } from '../types';
import type { ViewMode } from './ViewModeToggle';

interface RecipeListProps {
  recipes: Recipe[];
  onViewDetails?: (id: string) => void;
  viewMode: ViewMode;
}

export function RecipeList({ recipes, onViewDetails, viewMode }: RecipeListProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <GridRecipeCard key={recipe.id} recipe={recipe} onViewDetails={onViewDetails} />
        ))}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <ListRecipeCard key={recipe.id} recipe={recipe} onViewDetails={onViewDetails} />
        ))}
      </div>
    );
  }

  if (viewMode === 'compact') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {recipes.map((recipe) => (
          <CompactRecipeCard key={recipe.id} recipe={recipe} onViewDetails={onViewDetails} />
        ))}
      </div>
    );
  }

  return null;
}

function GridRecipeCard({ recipe, onViewDetails }: { recipe: Recipe; onViewDetails?: (id: string) => void }) {
  const toggleFavorite = useToggleFavorite();

  const handleToggleFavorite = () => {
    toggleFavorite.mutate(recipe.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(recipe.id);
  };

  return (
    <div className="group relative bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border">
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
        
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {recipe.type}
          </span>
        </div>

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

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 mb-1">
            {recipe.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {recipe.description}
          </p>
        </div>

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

function ListRecipeCard({ recipe, onViewDetails }: { recipe: Recipe; onViewDetails?: (id: string) => void }) {
  const toggleFavorite = useToggleFavorite();

  const handleToggleFavorite = () => {
    toggleFavorite.mutate(recipe.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(recipe.id);
  };

  return (
    <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-border overflow-hidden">
      <div className="flex">
        <div className="relative w-48 h-32 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 flex-shrink-0">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-orange-300 dark:text-orange-600" />
            </div>
          )}
          
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {recipe.type}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={toggleFavorite.isPending}
            className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <Heart
              className={`w-3 h-3 transition-colors duration-200 ${
                recipe.isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
              }`}
            />
          </button>
        </div>

        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                {recipe.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                {recipe.description}
              </p>
            </div>
            <Button
              onClick={handleViewDetails}
              className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white ml-4"
              size="sm"
            >
              Voir
            </Button>
          </div>

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

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-3">
              <span><strong>{recipe.nutrition.calories}</strong> cal</span>
              <span><strong>{recipe.nutrition.protein}g</strong> prot.</span>
              <span><strong>{recipe.nutrition.carbs}g</strong> gluc.</span>
              <span><strong>{recipe.nutrition.fat}g</strong> lip.</span>
            </div>
            
            {recipe.allergies.length > 0 && (
              <div className="flex items-center gap-1">
                {recipe.allergies.slice(0, 2).map((allergy) => (
                  <span
                    key={allergy}
                    className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded-full"
                  >
                    {allergy}
                  </span>
                ))}
                {recipe.allergies.length > 2 && (
                  <span className="text-muted-foreground">+{recipe.allergies.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactRecipeCard({ recipe, onViewDetails }: { recipe: Recipe; onViewDetails?: (id: string) => void }) {
  const toggleFavorite = useToggleFavorite();

  const handleToggleFavorite = () => {
    toggleFavorite.mutate(recipe.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(recipe.id);
  };

  return (
    <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-border overflow-hidden cursor-pointer" onClick={handleViewDetails}>
      <div className="relative h-24 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-orange-300 dark:text-orange-600" />
          </div>
        )}
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite();
          }}
          disabled={toggleFavorite.isPending}
          className="absolute top-1 right-1 p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <Heart
            className={`w-3 h-3 transition-colors duration-200 ${
              recipe.isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-1">
          {recipe.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{recipe.prepTime + recipe.cookTime}min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{recipe.servings}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            recipe.difficulty === 'Facile' ? 'bg-green-400' :
            recipe.difficulty === 'Moyen' ? 'bg-orange-400' :
            'bg-red-400'
          }`} />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{recipe.nutrition.calories} cal</span>
          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-full text-xs">
            {recipe.type}
          </span>
        </div>
      </div>
    </div>
  );
}