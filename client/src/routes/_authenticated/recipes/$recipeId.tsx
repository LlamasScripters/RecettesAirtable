import {
  createFileRoute,
  Link,
  // notFound,
  useNavigate,
  // useParams,
} from "@tanstack/react-router";
import { useState } from "react";
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
  "/_authenticated/recipes/$recipeId"
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

  // Simuler une conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      content:
        "Bonjour ! Je vais vous aider à créer une recette de risotto aux champignons. Avez-vous des préférences ou des allergies dont je devrais tenir compte ?",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      sender: "user",
      content:
        "Je voudrais une recette pour 2 personnes, et je suis intolérant au lactose.",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: "3",
      sender: "assistant",
      content:
        "Parfait ! Je vais adapter la recette pour qu'elle soit sans lactose. Préférez-vous utiliser des champignons spécifiques ? Par exemple, des champignons de Paris, des shiitakes, ou un mélange ?",
      timestamp: new Date(Date.now() - 3400000),
    },
    {
      id: "4",
      sender: "user",
      content: "Un mélange serait parfait !",
      timestamp: new Date(Date.now() - 3300000),
    },
  ]);

  // Simuler les détails de la recette
  const recipe: RecipeDetail = {
    id: recipeId,
    title: "Risotto aux champignons sans lactose",
    ingredients: [
      "200g de riz arborio",
      "300g de mélange de champignons (shiitakes, pleurotes, champignons de Paris)",
      "1 oignon moyen",
      "2 gousses d'ail",
      "100ml de vin blanc sec (facultatif)",
      "750ml de bouillon de légumes",
      "2 c. à soupe d'huile d'olive",
      "1 c. à soupe de thym frais",
      "50g de parmesan végétal (ou levure nutritionnelle)",
      "Sel et poivre noir",
      "Persil frais pour la garniture",
    ],
    servings: 2,
    instructions: [
      "Préparer les champignons : les nettoyer et les couper en morceaux. Émincer finement l'oignon et l'ail.",
      "Dans une grande poêle, chauffer l'huile d'olive à feu moyen. Ajouter l'oignon et cuire jusqu'à ce qu'il soit translucide (environ 3-4 minutes).",
      "Ajouter l'ail et les champignons, cuire jusqu'à ce que les champignons soient tendres et aient rendu leur eau (environ 5-7 minutes).",
      "Ajouter le riz et remuer pendant 1-2 minutes jusqu'à ce qu'il soit légèrement translucide.",
      "Verser le vin blanc (si utilisé) et remuer jusqu'à absorption complète.",
      "Ajouter le bouillon chaud, une louche à la fois, en remuant fréquemment. Attendre que le liquide soit absorbé avant d'ajouter la louche suivante.",
      "Continuer ce processus pendant environ 18-20 minutes jusqu'à ce que le riz soit al dente.",
      "Incorporer le parmesan végétal ou la levure nutritionnelle, le thym, le sel et le poivre.",
      "Servir immédiatement, garni de persil frais haché.",
    ],
    prepTime: 15,
    cookTime: 30,
    nutrition: {
      calories: 420,
      protein: 10,
      carbs: 65,
      fat: 12,
      vitamins: {
        a: 5,
        c: 8,
        d: 2,
      },
      minerals: {
        calcium: 4,
        iron: 15,
        magnesium: 8,
      },
    },
    allergies: ["Sans lactose"],
  };

  const [newMessage, setNewMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simuler une réponse de l'assistant
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: "assistant",
      content:
        'J\'ai mis à jour votre recette selon vos préférences. Vous pouvez consulter la recette finale avec tous les détails en cliquant sur le bouton "Voir la recette complète".',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsGenerating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête de la conversation */}
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">{recipe.title}</h1>
        <button
          onClick={() => setShowRecipeDetails(!showRecipeDetails)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
        >
          {showRecipeDetails ? "Revenir au chat" : "Voir la recette complète"}
        </button>
      </header>

      {/* Contenu principal (conversation ou détails de la recette) */}
      <div className="flex-1 overflow-auto">
        {showRecipeDetails ? (
          <div className="p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">{recipe.title}</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">
                    Temps de préparation
                  </div>
                  <div className="font-medium">{recipe.prepTime} minutes</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">Temps de cuisson</div>
                  <div className="font-medium">{recipe.cookTime} minutes</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">Portions</div>
                  <div className="font-medium">{recipe.servings} personnes</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ingrédients</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal pl-5 space-y-3">
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Informations nutritionnelles
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Calories</div>
                      <div className="font-medium">
                        {recipe.nutrition.calories} kcal
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Protéines</div>
                      <div className="font-medium">
                        {recipe.nutrition.protein}g
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Glucides</div>
                      <div className="font-medium">
                        {recipe.nutrition.carbs}g
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Lipides</div>
                      <div className="font-medium">{recipe.nutrition.fat}g</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Vitamines (% AJR)
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Vitamine A</span>
                          <span>{recipe.nutrition.vitamins.a}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vitamine C</span>
                          <span>{recipe.nutrition.vitamins.c}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vitamine D</span>
                          <span>{recipe.nutrition.vitamins.d}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Minéraux (% AJR)
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Calcium</span>
                          <span>{recipe.nutrition.minerals.calcium}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fer</span>
                          <span>{recipe.nutrition.minerals.iron}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Magnésium</span>
                          <span>{recipe.nutrition.minerals.magnesium}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {recipe.allergies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Allergènes et restrictions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-emerald-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-4 flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone de saisie de message (visible uniquement en mode chat) */}
      {!showRecipeDetails && (
        <div className="border-t bg-white p-4">
          <div className="flex items-end space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tapez votre message..."
              className="flex-1 border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={3}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isGenerating}
              className="h-12 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
