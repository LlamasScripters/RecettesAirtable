import { useQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api';

// Hook pour récupérer toutes les métadonnées
export function useMetadata() {
  return useQuery({
    queryKey: ['metadata'],
    queryFn: async () => {
      const response = await apiService.getMetadata();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de la récupération des métadonnées');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - les métadonnées changent rarement
  });
}

// Hook pour vérifier la santé de l'API
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await apiService.healthCheck();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'API non disponible');
      }
      return response.data;
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
} 