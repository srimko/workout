'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Category, Exercise } from '@/lib/types';

/**
 * Hook to fetch all categories from Supabase (client-side)
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;

        setCategories(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * Hook to fetch exercises by category from Supabase (client-side)
 */
export function useExercisesByCategory(categoryId: string | null, activeOnly: boolean = true) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setExercises([]);
      setLoading(false);
      return;
    }

    async function fetchExercises() {
      try {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
          .from('exercises')
          .select('*')
          .eq('category_id', categoryId)
          .order('title');

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        setExercises(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [categoryId, activeOnly]);

  return { exercises, loading, error };
}

/**
 * Hook to fetch all exercises from Supabase (client-side)
 */
export function useExercises(activeOnly: boolean = false) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
          .from('exercises')
          .select('*')
          .order('title');

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        setExercises(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [activeOnly]);

  return { exercises, loading, error };
}
