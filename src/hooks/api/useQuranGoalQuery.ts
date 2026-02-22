/**
 * Quran Goal Hooks
 *
 * React Query wrappers for Quran goal operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../lib/apiClient';
import { queryKeys } from './queryKeys';

// ── Fetch Current Goal ───────────────────────

export function useQuranGoal(enabled = true) {
  return useQuery({
    queryKey: queryKeys.quranGoal.current,
    queryFn: async () => {
      const { data } = await api.get<any>('/quran-goal');
      return data;
    },
    enabled: enabled && api.isAuthenticated(),
  });
}

// ── Fetch Schedule ───────────────────────────

export function useQuranSchedule(enabled = true) {
  return useQuery({
    queryKey: queryKeys.quranGoal.schedule,
    queryFn: async () => {
      const { data } = await api.get<any>('/quran-goal/schedule');
      return data;
    },
    enabled: enabled && api.isAuthenticated(),
  });
}

// ── Save / Update Goal ───────────────────────

export function useSaveQuranGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetCompletions: number) => {
      const { data } = await api.put<any>('/quran-goal', { targetCompletions });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quranGoal.current });
      queryClient.invalidateQueries({ queryKey: queryKeys.quranGoal.schedule });
    },
  });
}
