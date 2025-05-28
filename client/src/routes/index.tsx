import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChefHat, Sparkles, Clock, Heart, Search, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useHealthCheck } from '../hooks/useMetadata'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { data: healthData, isLoading: healthLoading } = useHealthCheck()

  const handleExploreRecipes = () => {
    navigate({ to: '/recipes' })
  }

  const handleGenerateRecipe = () => {
    navigate({ to: '/recipes/new' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            {/* Logo et titre principal */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-6">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Recettes
                <span className="text-orange-500 ml-3">Airtable</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Découvrez, créez et partagez de délicieuses recettes avec l'aide de 
                l'intelligence artificielle. Votre compagnon culinaire pour des repas savoureux.
              </p>
            </div>

            {/* Status API */}
            <div className="mb-8">
              {healthLoading ? (
                <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2" />
                  Vérification du service...
                </div>
              ) : healthData ? (
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                  Service opérationnel
                </div>
              ) : (
                <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                  Service indisponible
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                onClick={handleExploreRecipes}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Explorer les recettes
              </Button>
              <Button
                onClick={handleGenerateRecipe}
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Générer avec l'IA
              </Button>
            </div>
          </div>
        </div>

        {/* Formes décoratives */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-200 rounded-full opacity-20 blur-3xl" />
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Recettes Airtable ?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Une expérience culinaire moderne alliant technologie et gastronomie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                IA Créative
              </h3>
              <p className="text-gray-600">
                Générez des recettes personnalisées selon vos ingrédients et préférences
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analyse Nutritionnelle
              </h3>
              <p className="text-gray-600">
                Connaissez les valeurs nutritionnelles détaillées de chaque recette
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gain de Temps
              </h3>
              <p className="text-gray-600">
                Trouvez rapidement des recettes adaptées à votre temps disponible
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Favoris & Allergies
              </h3>
              <p className="text-gray-600">
                Sauvegardez vos recettes préférées et gérez vos allergies alimentaires
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à cuisiner de nouveaux plats ?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Rejoignez des milliers de cuisiniers qui utilisent déjà notre plateforme
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleExploreRecipes}
              size="lg"
              className="bg-white text-orange-500 hover:bg-gray-50 px-8 py-3 text-lg"
            >
              Commencer maintenant
            </Button>
            <Button
              onClick={handleGenerateRecipe}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              Générer une recette
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-6 h-6 text-orange-500 mr-2" />
            <span className="text-lg font-semibold">Recettes Airtable</span>
          </div>
          <p className="text-gray-400 mb-4">
            Projet ESGI - Airtable avancé • Développé avec ❤️ et beaucoup de café
          </p>
          <div className="text-sm text-gray-500">
            Powered by React, TypeScript, Tailwind CSS, Airtable & Ollama
          </div>
        </div>
      </footer>
    </div>
  )
}
