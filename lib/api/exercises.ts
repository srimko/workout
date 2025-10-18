import { apiClient } from './client';
import { Exercise } from '../types';

export const exercisesApi = {
  // GET /exercises
  getAll: () => apiClient.get<Exercise[]>('/exercises'),

  // GET /exercises/:id
  getById: (id: number) => apiClient.get<Exercise>(`/exercises/${id}`),

  // Filtrer par groupe musculaire
  getByMuscleGroup: (muscleGroup: string) =>
    apiClient.get<Exercise[]>('/exercises', {
      params: { muscle_groups_like: muscleGroup },
    }),

  // POST /exercises
  create: (data: Omit<Exercise, 'id' | 'created_at'>) =>
    apiClient.post<Exercise>('/exercises', data),

  // PUT /exercises/:id
  update: (id: number, data: Partial<Exercise>) =>
    apiClient.put<Exercise>(`/exercises/${id}`, data),

  // DELETE /exercises/:id
  delete: (id: number) => apiClient.delete(`/exercises/${id}`),
};
