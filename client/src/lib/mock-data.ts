import type { Allergy, DifficultyLevel, Recipe, RecipeType } from "../types";

// Fonction pour générer des UUID
const generateUUID = (): string => {
  return crypto.randomUUID();
};

// Fonction pour générer des données mockées de recettes
export const generateMockRecipes = (): Recipe[] => {
  return [
    {
      id: generateUUID(),
      title: "Risotto aux champignons",
      description: "Un plat réconfortant de risotto crémeux aux champignons sauvages.",
      type: "plat principal",
      difficulty: "moyen",
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      ingredients: [
        { id: generateUUID(), name: "riz arborio", quantity: "300", unit: "g" },
        { id: generateUUID(), name: "champignons de Paris", quantity: "250", unit: "g" },
        { id: generateUUID(), name: "oignon", quantity: "1", unit: "" },
        { id: generateUUID(), name: "ail", quantity: "2", unit: "gousses" },
        { id: generateUUID(), name: "vin blanc sec", quantity: "100", unit: "ml" },
        { id: generateUUID(), name: "bouillon de légumes", quantity: "1", unit: "L" },
        { id: generateUUID(), name: "parmesan", quantity: "50", unit: "g" },
        { id: generateUUID(), name: "huile d'olive", quantity: "2", unit: "cuillères à soupe" },
        { id: generateUUID(), name: "beurre", quantity: "30", unit: "g" },
        { id: generateUUID(), name: "sel", quantity: "", unit: "à goût" },
        { id: generateUUID(), name: "poivre", quantity: "", unit: "à goût" },
      ],
      instructions: [
        "Nettoyez et coupez les champignons en morceaux. Émincez l'oignon et l'ail.",
        "Dans une casserole, faites chauffer l'huile d'olive et ajoutez l'oignon. Faites revenir jusqu'à ce qu'il devienne translucide.",
        "Ajoutez l'ail et les champignons, faites revenir pendant 5 minutes.",
        "Ajoutez le riz et remuez pendant 1-2 minutes jusqu'à ce qu'il devienne translucide sur les bords.",
        "Versez le vin blanc et remuez jusqu'à absorption complète.",
        "Ajoutez le bouillon chaud, louche par louche, en attendant que le liquide soit absorbé avant d'en ajouter plus.",
        "Continuez ce processus pendant environ 18 minutes, jusqu'à ce que le riz soit al dente.",
        "Retirez du feu, ajoutez le beurre et le parmesan râpé, et remuez vigoureusement.",
        "Assaisonnez avec du sel et du poivre, et servez immédiatement."
      ],
      nutrition: {
        calories: 420,
        protein: 12,
        carbs: 65,
        fat: 14,
        vitamins: {
          a: 5,
          c: 8,
          d: 2
        },
        minerals: {
          calcium: 15,
          iron: 10,
          magnesium: 8
        }
      },
      allergies: ["lactose"],
      imageUrl: "https://via.placeholder.com/300x200?text=Risotto",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: generateUUID(),
      title: "Salade César au poulet grillé",
      description: "Une salade César classique avec du poulet grillé, croutons maison et parmesan.",
      type: "entrée",
      difficulty: "facile",
      prepTime: 20,
      cookTime: 15,
      servings: 2,
      ingredients: [
        { id: generateUUID(), name: "laitue romaine", quantity: "1", unit: "tête" },
        { id: generateUUID(), name: "poulet", quantity: "200", unit: "g" },
        { id: generateUUID(), name: "parmesan", quantity: "30", unit: "g" },
        { id: generateUUID(), name: "pain", quantity: "2", unit: "tranches" },
        { id: generateUUID(), name: "huile d'olive", quantity: "3", unit: "cuillères à soupe" },
        { id: generateUUID(), name: "ail", quantity: "1", unit: "gousse" },
        { id: generateUUID(), name: "jaune d'œuf", quantity: "1", unit: "" },
        { id: generateUUID(), name: "moutarde de Dijon", quantity: "1", unit: "cuillère à café" },
        { id: generateUUID(), name: "jus de citron", quantity: "1", unit: "cuillère à soupe" },
        { id: generateUUID(), name: "anchois", quantity: "3", unit: "filets" },
        { id: generateUUID(), name: "sel", quantity: "", unit: "à goût" },
        { id: generateUUID(), name: "poivre", quantity: "", unit: "à goût" }
      ],
      instructions: [
        "Préparez les croûtons: coupez le pain en cubes, mélangez avec de l'huile d'olive, du sel et de l'ail émincé, puis faites-les dorer au four à 180°C pendant 10 minutes.",
        "Assaisonnez le poulet avec du sel et du poivre, puis faites-le griller pendant environ 6 minutes de chaque côté jusqu'à ce qu'il soit bien cuit. Laissez reposer puis coupez en tranches.",
        "Pour la vinaigrette, mélangez le jaune d'œuf, la moutarde, le jus de citron, l'ail écrasé et les anchois hachés. Ajoutez l'huile d'olive en filet tout en fouettant.",
        "Lavez et essorez la laitue romaine, puis déchirez-la en morceaux de taille moyenne.",
        "Dans un grand bol, mélangez la laitue avec la vinaigrette, ajoutez les croûtons et le poulet grillé.",
        "Râpez du parmesan sur le dessus et servez immédiatement."
      ],
      nutrition: {
        calories: 380,
        protein: 25,
        carbs: 18,
        fat: 22,
        vitamins: {
          a: 20,
          c: 15,
          d: 3
        },
        minerals: {
          calcium: 12,
          iron: 8,
          magnesium: 5
        }
      },
      allergies: ["oeufs", "lactose", "gluten"],
      imageUrl: "https://via.placeholder.com/300x200?text=Salade+César",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: generateUUID(),
      title: "Curry de légumes au lait de coco",
      description: "Un curry végétarien épicé avec un mélange de légumes et de lait de coco, servi avec du riz basmati.",
      type: "plat principal",
      difficulty: "facile",
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      ingredients: [
        { id: generateUUID(), name: "oignon", quantity: "1", unit: "" },
        { id: generateUUID(), name: "ail", quantity: "3", unit: "gousses" },
        { id: generateUUID(), name: "gingembre", quantity: "2", unit: "cm" },
        { id: generateUUID(), name: "courgette", quantity: "1", unit: "" },
        { id: generateUUID(), name: "poivron rouge", quantity: "1", unit: "" },
        { id: generateUUID(), name: "carottes", quantity: "2", unit: "" },
        { id: generateUUID(), name: "patate douce", quantity: "1", unit: "moyenne" },
        { id: generateUUID(), name: "pois chiches", quantity: "400", unit: "g" },
        { id: generateUUID(), name: "lait de coco", quantity: "400", unit: "ml" },
        { id: generateUUID(), name: "tomates concassées", quantity: "400", unit: "g" },
        { id: generateUUID(), name: "pâte de curry", quantity: "2", unit: "cuillères à soupe" },
        { id: generateUUID(), name: "curcuma", quantity: "1", unit: "cuillère à café" },
        { id: generateUUID(), name: "cumin", quantity: "1", unit: "cuillère à café" },
        { id: generateUUID(), name: "coriandre fraîche", quantity: "1", unit: "bouquet" },
        { id: generateUUID(), name: "huile végétale", quantity: "2", unit: "cuillères à soupe" },
        { id: generateUUID(), name: "sel", quantity: "", unit: "à goût" }
      ],
      instructions: [
        "Émincez l'oignon, hachez l'ail et le gingembre. Coupez tous les légumes en dés.",
        "Dans une grande casserole, faites chauffer l'huile et faites revenir l'oignon jusqu'à ce qu'il soit translucide.",
        "Ajoutez l'ail et le gingembre, puis faites revenir pendant 1 minute.",
        "Ajoutez la pâte de curry, le curcuma et le cumin, et faites revenir pendant 1 minute supplémentaire.",
        "Ajoutez la patate douce, les carottes et le poivron, et faites revenir pendant 5 minutes.",
        "Ajoutez les tomates concassées et le lait de coco, et portez à ébullition.",
        "Réduisez le feu et laissez mijoter pendant 15 minutes, ou jusqu'à ce que les légumes soient tendres.",
        "Ajoutez la courgette et les pois chiches, et laissez mijoter pendant 5 minutes supplémentaires.",
        "Assaisonnez avec du sel selon votre goût.",
        "Servez chaud, garni de coriandre fraîche, avec du riz basmati."
      ],
      nutrition: {
        calories: 320,
        protein: 9,
        carbs: 42,
        fat: 14,
        vitamins: {
          a: 35,
          c: 45,
          d: 0
        },
        minerals: {
          calcium: 8,
          iron: 15,
          magnesium: 12
        }
      },
      allergies: [],
      imageUrl: "https://via.placeholder.com/300x200?text=Curry+de+légumes",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: generateUUID(),
      title: "Mousse au chocolat",
      description: "Une mousse au chocolat légère et aérienne, parfaite pour terminer un repas.",
      type: "dessert",
      difficulty: "moyen",
      prepTime: 20,
      cookTime: 0,
      servings: 4,
      ingredients: [
        { id: generateUUID(), name: "chocolat noir", quantity: "200", unit: "g" },
        { id: generateUUID(), name: "oeufs", quantity: "4", unit: "" },
        { id: generateUUID(), name: "sucre", quantity: "50", unit: "g" },
        { id: generateUUID(), name: "beurre", quantity: "30", unit: "g" },
        { id: generateUUID(), name: "sel", quantity: "1", unit: "pincée" }
      ],
      instructions: [
        "Cassez le chocolat en morceaux et faites-le fondre au bain-marie avec le beurre.",
        "Séparez les blancs des jaunes d'œufs.",
        "Mélangez les jaunes d'œufs avec le sucre jusqu'à ce que le mélange blanchisse.",
        "Ajoutez le chocolat fondu aux jaunes d'œufs et mélangez bien.",
        "Montez les blancs en neige ferme avec une pincée de sel.",
        "Incorporez délicatement les blancs en neige au mélange chocolaté en soulevant la masse pour ne pas faire retomber les blancs.",
        "Répartissez la mousse dans des ramequins et réfrigérez pendant au moins 3 heures avant de servir."
      ],
      nutrition: {
        calories: 310,
        protein: 7,
        carbs: 25,
        fat: 22,
        vitamins: {
          a: 8,
          c: 0,
          d: 1
        },
        minerals: {
          calcium: 3,
          iron: 6,
          magnesium: 10
        }
      },
      allergies: ["oeufs", "lactose"],
      imageUrl: "https://via.placeholder.com/300x200?text=Mousse+au+chocolat",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: generateUUID(),
      title: "Guacamole maison",
      description: "Un guacamole frais et savoureux, parfait pour un apéritif ou une entrée.",
      type: "apéritif",
      difficulty: "facile",
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      ingredients: [
        { id: generateUUID(), name: "avocats mûrs", quantity: "3", unit: "" },
        { id: generateUUID(), name: "oignon rouge", quantity: "1/2", unit: "" },
        { id: generateUUID(), name: "tomate", quantity: "1", unit: "" },
        { id: generateUUID(), name: "coriandre fraîche", quantity: "1", unit: "bouquet" },
        { id: generateUUID(), name: "jus de citron vert", quantity: "1", unit: "" },
        { id: generateUUID(), name: "ail", quantity: "1", unit: "gousse" },
        { id: generateUUID(), name: "piment jalapeño", quantity: "1/2", unit: "" },
        { id: generateUUID(), name: "sel", quantity: "", unit: "à goût" },
        { id: generateUUID(), name: "poivre", quantity: "", unit: "à goût" }
      ],
      instructions: [
        "Coupez les avocats en deux, retirez les noyaux et écrasez la chair dans un bol.",
        "Émincez finement l'oignon rouge, hachez la tomate (sans les graines), la coriandre et l'ail.",
        "Retirez les graines du jalapeño et hachez-le finement.",
        "Mélangez tous les ingrédients dans le bol avec les avocats écrasés.",
        "Ajoutez le jus de citron vert, le sel et le poivre selon votre goût.",
        "Mélangez bien tout en gardant un peu de texture.",
        "Servez immédiatement avec des chips de maïs ou réfrigérez en couvrant directement la surface du guacamole avec du film alimentaire pour éviter qu'il ne brunisse."
      ],
      nutrition: {
        calories: 180,
        protein: 2,
        carbs: 10,
        fat: 16,
        vitamins: {
          a: 5,
          c: 25,
          d: 0
        },
        minerals: {
          calcium: 2,
          iron: 4,
          magnesium: 8
        }
      },
      allergies: [],
      imageUrl: "https://via.placeholder.com/300x200?text=Guacamole",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: generateUUID(),
      title: "Pain perdu aux fruits rouges",
      description: "Un délicieux pain perdu servi avec des fruits rouges frais et du sirop d'érable.",
      type: "dessert",
      difficulty: "facile",
      prepTime: 10,
      cookTime: 10,
      servings: 2,
      ingredients: [
        { id: generateUUID(), name: "pain de mie", quantity: "4", unit: "tranches" },
        { id: generateUUID(), name: "oeufs", quantity: "2", unit: "" },
        { id: generateUUID(), name: "lait", quantity: "100", unit: "ml" },
        { id: generateUUID(), name: "sucre vanillé", quantity: "1", unit: "sachet" },
        { id: generateUUID(), name: "cannelle", quantity: "1/2", unit: "cuillère à café" },
        { id: generateUUID(), name: "beurre", quantity: "20", unit: "g" },
        { id: generateUUID(), name: "fraises", quantity: "100", unit: "g" },
        { id: generateUUID(), name: "framboises", quantity: "50", unit: "g" },
        { id: generateUUID(), name: "myrtilles", quantity: "50", unit: "g" },
        { id: generateUUID(), name: "sirop d'érable", quantity: "2", unit: "cuillères à soupe" },
        { id: generateUUID(), name: "sucre glace", quantity: "", unit: "pour saupoudrer" }
      ],
      instructions: [
        "Dans un bol, battez les œufs avec le lait, le sucre vanillé et la cannelle.",
        "Trempez les tranches de pain de mie dans ce mélange jusqu'à ce qu'elles soient bien imbibées des deux côtés.",
        "Faites fondre le beurre dans une poêle et faites dorer les tranches de pain environ 2-3 minutes de chaque côté.",
        "Pendant ce temps, lavez et coupez les fraises en deux. Rincez les framboises et les myrtilles.",
        "Servez le pain perdu chaud, garni de fruits rouges, arrosé de sirop d'érable et saupoudré de sucre glace."
      ],
      nutrition: {
        calories: 375,
        protein: 10,
        carbs: 55,
        fat: 14,
        vitamins: {
          a: 12,
          c: 30,
          d: 5
        },
        minerals: {
          calcium: 15,
          iron: 8,
          magnesium: 6
        }
      },
      allergies: ["oeufs", "lactose", "gluten"],
      imageUrl: "https://via.placeholder.com/300x200?text=Pain+perdu",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];
};

// Fonction pour générer une liste de recettes à partir d'une requête
export const searchRecipes = (recipes: Recipe[], query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  
  return recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(lowerCaseQuery) ||
    recipe.description.toLowerCase().includes(lowerCaseQuery) ||
    recipe.type.toLowerCase().includes(lowerCaseQuery) ||
    recipe.ingredients.some(ingredient => 
      ingredient.name.toLowerCase().includes(lowerCaseQuery)
    )
  );
};

export const filterRecipesByType = (recipes: Recipe[], type: RecipeType) => {
  return recipes.filter(recipe => recipe.type === type);
};

export const filterRecipesByAllergies = (recipes: Recipe[], allergies: Allergy[]) => {
  if (!allergies.length) return recipes;
  
  return recipes.filter(recipe => 
    !recipe.allergies.some(allergy => allergies.includes(allergy))
  );
};

export const filterRecipesByDifficulty = (recipes: Recipe[], difficulty: DifficultyLevel) => {
  return recipes.filter(recipe => recipe.difficulty === difficulty);
};