import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type RecipeSuggestion = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export const Route = createFileRoute("/chats/_layout/new")({
  component: NewChatPage,
});

function NewChatPage() {
  const navigate = useNavigate();

  // Simuler des suggestions de recettes
  const recipeSuggestions: RecipeSuggestion[] = [
    {
      id: "r1",
      title: "Risotto aux champignons",
      description:
        "Un plat italien classique, crémeux et parfumé aux champignons de saison.",
      imageUrl: "https://via.placeholder.com/300x200?text=Risotto",
    },
    {
      id: "r2",
      title: "Curry de légumes",
      description:
        "Un curry végétarien épicé avec légumes de saison et lait de coco.",
      imageUrl: "https://via.placeholder.com/300x200?text=Curry",
    },
    {
      id: "r3",
      title: "Poulet rôti aux herbes",
      description:
        "Poulet rôti avec romarin, thym et ail, accompagné de pommes de terre.",
      imageUrl: "https://via.placeholder.com/300x200?text=Poulet",
    },
    {
      id: "r4",
      title: "Tarte aux pommes",
      description:
        "Dessert classique avec pâte sablée, pommes caramélisées et cannelle.",
      imageUrl: "https://via.placeholder.com/300x200?text=Tarte",
    },
  ];

  const handleRecipeSelect = (recipeId: string) => {
    // Dans une application réelle, on créerait une nouvelle conversation ici
    navigate({ to: "/chats/$chatId", params: { chatId: "4" } });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateCustomRecipe = () => {
    navigate({ to: "/chats/$chatId", params: { chatId: "4" } });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Créer une nouvelle recette</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Que souhaitez-vous cuisiner aujourd'hui ?
        </h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Décrivez la recette que vous souhaitez (ingrédients, type de cuisine, régime alimentaire...)"
            className="w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleCreateCustomRecipe}
            className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
          >
            Créer ma recette personnalisée
          </button>
          <button className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition">
            Recettes récentes
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Suggestions de recettes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipeSuggestions.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleRecipeSelect(recipe.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
            >
              <div
                className="h-48 bg-center bg-cover"
                style={{ backgroundImage: `url(${recipe.imageUrl})` }}
              ></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                <p className="text-gray-600 text-sm">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
