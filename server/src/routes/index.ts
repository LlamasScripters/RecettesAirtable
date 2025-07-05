import { Router } from 'express';
import type { Request, Response } from 'express';
import recipeRoutes from './recipeRoutes';
import metadataRoutes from './metadataRoutes';

const router = Router();

// Routes principales
router.use('/recipes', recipeRoutes);
router.use('/metadata', metadataRoutes);

// Route de santé
router.get('/health', (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      message: 'API Recettes fonctionnelle',
      timestamp: new Date().toISOString()
    }
  });
});

export default router; 