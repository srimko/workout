import { apiClient } from './client';
import { PersonalRecord } from '../types';

export const recordsApi = {
  // GET /personal_records
  getAll: () => apiClient.get<PersonalRecord[]>('/personal_records'),

  // GET /personal_records/:id
  getById: (id: number) =>
    apiClient.get<PersonalRecord>(`/personal_records/${id}`),

  // Filtrer par utilisateur
  getByUserId: (userId: string) =>
    apiClient.get<PersonalRecord[]>('/personal_records', {
      params: { user_id: userId },
    }),

  // POST /personal_records
  create: (data: Omit<PersonalRecord, 'id'>) =>
    apiClient.post<PersonalRecord>('/personal_records', data),

  // DELETE /personal_records/:id
  delete: (id: number) => apiClient.delete(`/personal_records/${id}`),
};
