import { apiClient } from './client';
import { Set } from '../types';

export const setsApi = {
  // GET /sets
  getAll: () => apiClient.get<Set[]>('/sets'),

  // GET /sets/:id
  getById: (id: number) => apiClient.get<Set>(`/sets/${id}`),

  // Récupérer toutes les séries d'une séance
  getByWorkoutId: (workoutId: number) =>
    apiClient.get<Set[]>('/sets', {
      params: { workout_id: workoutId },
    }),

  // POST /sets
  create: (data: Omit<Set, 'id'>) => apiClient.post<Set>('/sets', data),

  // PUT /sets/:id
  update: (id: number, data: Partial<Set>) =>
    apiClient.put<Set>(`/sets/${id}`, data),

  // DELETE /sets/:id
  delete: (id: number) => apiClient.delete(`/sets/${id}`),
};
