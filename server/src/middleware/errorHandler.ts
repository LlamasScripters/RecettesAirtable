import type { Request, Response, NextFunction } from 'express';
import type { APIResponse } from '../types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Erreur serveur:', error);

  const response: APIResponse<null> = {
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : error.message
  };

  res.status(500).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: APIResponse<null> = {
    success: false,
    error: `Route ${req.method} ${req.path} non trouvée`
  };
  
  res.status(404).json(response);
}; 