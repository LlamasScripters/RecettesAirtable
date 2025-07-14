import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, Sparkles, Plus, X, Loader2, ChefHat } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useGenerateRecipe } from '../../../hooks/useRecipes';
import { useMetadata } from '../../../hooks/useMetadata';
import type { AIRecipeRequest } from '../../../types';

export const Route = createFileRoute('/_authenticated/recipes/new')({
  component: NewRecipePage,
});

function NewRecipePage() {
  const navigate = useNavigate();
  const generateRecipe = useGenerateRecipe();
  const { data: metadata } = useMetadata();

  const [formData, setFormData] = useState<AIRecipeRequest>({
    ingredients: [],
    servings: 4,
    allergies: [],
    type: '',
    difficulty: 'Facile',
  });

  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentAllergy, setCurrentAllergy] = useState('');

  const handleBack = () => {
    navigate({ to: '/recipes' });
  };

  const addIngredient = () => {
    if (currentIngredient.trim() && !formData.ingredients.includes(currentIngredient.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()]
      }));
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing !== ingredient)
    }));
  };

  const addAllergy = () => {
    if (currentAllergy.trim() && !formData.allergies.includes(currentAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, currentAllergy.trim()]
      }));
      setCurrentAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(all => all !== allergy)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.ingredients.length === 0) {
      alert('Veuillez ajouter au moins un ingrédient');
      return;
    }

    try {
      const recipe = await generateRecipe.mutateAsync(formData);
      navigate({ to: '/recipes/$recipeId', params: { recipeId: recipe.id } });
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
              disabled={generateRecipe.isPending}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h1 className="text-xl font-semibold text-foreground">Générateur de recettes IA</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          {/* Header du formulaire */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <ChefHat className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Créer une recette personnalisée</h2>
            </div>
            <p className="text-orange-100">
              Notre IA va créer une recette unique basée sur vos ingrédients et préférences
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Section Ingrédients */}
            <div>
              <label htmlFor="ingredients-input" className="block text-lg font-semibold text-foreground mb-3">
                Ingrédients disponibles *
              </label>
              <p className="text-muted-foreground mb-4">
                Quels ingrédients avez-vous dans votre frigo ou votre placard ?
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input
                  id="ingredients-input"
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addIngredient)}
                  placeholder="Ex: tomates, basilic, mozzarella..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addIngredient}
                  variant="outline"
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-1 text-orange-600 hover:text-orange-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Grid pour les autres options */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Portions et Type */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="servings-input" className="block text-lg font-semibold text-foreground mb-3">
                    Nombre de portions
                  </label>
                  <Input
                    id="servings-input"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.servings}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      servings: Number.parseInt(e.target.value) || 1
                    }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="type-select" className="block text-lg font-semibold text-foreground mb-3">
                    Type de plat
                  </label>
                  <select
                    id="type-select"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Surprends-moi !</option>
                    {metadata?.typesPlats.map((type) => (
                      <option key={type.id} value={type.nom}>
                        {type.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty-select" className="block text-lg font-semibold text-foreground mb-3">
                    Niveau de difficulté
                  </label>
                  <select
                    id="difficulty-select"
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Facile">Facile</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label htmlFor="allergies-input" className="block text-lg font-semibold text-foreground mb-3">
                  Allergies et intolérances
                </label>
                <p className="text-muted-foreground mb-4">
                  Précisez vos allergies pour une recette adaptée
                </p>
                
                <div className="flex gap-2 mb-4">
                  <Input
                    id="allergies-input"
                    value={currentAllergy}
                    onChange={(e) => setCurrentAllergy(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addAllergy)}
                    placeholder="Ex: gluten, lactose, noix..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addAllergy}
                    variant="outline"
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                      >
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeAllergy(allergy)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bouton de génération */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {formData.ingredients.length > 0 ? (
                    `${formData.ingredients.length} ingrédient${formData.ingredients.length > 1 ? 's' : ''} ajouté${formData.ingredients.length > 1 ? 's' : ''}`
                  ) : (
                    'Ajoutez au moins un ingrédient pour commencer'
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={formData.ingredients.length === 0 || generateRecipe.isPending}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
                >
                  {generateRecipe.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Générer ma recette
                    </>
                  )}
                </Button>
              </div>
              
              {generateRecipe.isPending && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                    <div>
                      <div className="font-medium text-orange-900">L'IA travaille sur votre recette...</div>
                      <div className="text-sm text-orange-700">Cela peut prendre quelques secondes</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
