import { Router } from 'express';
import { metadataController } from '../controllers/metadataController';

const router = Router();

// GET /api/metadata/allergenes - Récupérer tous les allergènes
router.get('/allergenes', metadataController.getAllergenes.bind(metadataController));

// GET /api/metadata/types-plats - Récupérer tous les types de plats
router.get('/types-plats', metadataController.getTypesPlats.bind(metadataController));

// GET /api/metadata/ingredients - Récupérer tous les ingrédients
router.get('/ingredients', metadataController.getIngredients.bind(metadataController));

// GET /api/metadata/all - Récupérer toutes les métadonnées
router.get('/all', metadataController.getAllMetadata.bind(metadataController));

const metadataRoutes = router;
export default metadataRoutes; 