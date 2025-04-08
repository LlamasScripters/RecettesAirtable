import { Button } from "@/components/ui/button";
import type { Recipe } from "@/types";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useRecipeStore } from "../stores/recipes.store";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useRecipeStore();
  const favorite = isFavorite(recipe.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div
        className="h-48 bg-center bg-cover"
        style={{
          backgroundImage: `url(${recipe.imageUrl || "https://via.placeholder.com/300x200?text=Recette"})`,
        }}
      ></div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{recipe.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(recipe.id);
            }}
          >
            <Heart
              className={`h-5 w-5 ${favorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
            <span className="sr-only">
              {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            </span>
          </Button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="inline-block px-2 py-1 mr-2 mb-2 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700">
            {recipe.type}
          </span>
          <span className="inline-block px-2 py-1 mr-2 mb-2 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700">
            {recipe.difficulty}
          </span>
          <span className="inline-block px-2 py-1 mr-2 mb-2 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700">
            {recipe.prepTime + recipe.cookTime} min
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
          {recipe.description}
        </p>
        <div className="mt-3">
          <Link
            to="/recettes/$recipeId"
            params={{ recipeId: recipe.id }}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition"
          >
            Voir la recette
          </Link>
        </div>
      </div>
    </div>
  );
}
