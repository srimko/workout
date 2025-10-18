import { apiClient } from './client';
import { Profile } from '../types';

export const profilesApi = {
  // GET /profiles
  getAll: () => apiClient.get<Profile[]>('/profiles'),

  // GET /profiles/:id
  getById: (id: string) => apiClient.get<Profile>(`/profiles/${id}`),

  // POST /profiles
  create: (data: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) =>
    apiClient.post<Profile>('/profiles', data),

  // PUT /profiles/:id
  update: (id: string, data: Partial<Profile>) =>
    apiClient.put<Profile>(`/profiles/${id}`, data),

  // DELETE /profiles/:id
  delete: (id: string) => apiClient.delete(`/profiles/${id}`),
};
