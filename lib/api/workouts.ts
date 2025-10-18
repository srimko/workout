import { apiClient } from './client';
import { Workout } from '../types';

export const workoutsApi = {
  // GET /workouts
  getAll: () => apiClient.get<Workout[]>('/workouts'),

  // GET /workouts/:id
  getById: (id: number) => apiClient.get<Workout>(`/workouts/${id}`),

  // Filtrer par utilisateur
  getByUserId: (userId: string) =>
    apiClient.get<Workout[]>('/workouts', {
      params: { user_id: userId },
    }),

  // POST /workouts
  create: (data: Omit<Workout, 'id'>) =>
    apiClient.post<Workout>('/workouts', data),

  // PUT /workouts/:id
  update: (id: number, data: Partial<Workout>) =>
    apiClient.put<Workout>(`/workouts/${id}`, data),

  // DELETE /workouts/:id
  delete: (id: number) => apiClient.delete(`/workouts/${id}`),
};
