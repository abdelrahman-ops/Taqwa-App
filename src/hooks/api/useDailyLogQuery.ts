/**
 * Daily Log Hooks
 *
 * React Query wrappers for daily log CRUD operations.
 * Falls back to localStorage for offline-first behavior.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../lib/apiClient';
import { queryKeys } from './queryKeys';

// ── Fetch Single Log ─────────────────────────

export function useDailyLog(date: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dailyLog.byDate(date),
    queryFn: async () => {
      const { data } = await api.get<any>(`/daily-log/${date}`);
      return data;
    },
    enabled: enabled && api.isAuthenticated(),
  });
}

// ── Fetch All Logs ───────────────────────────

export function useAllDailyLogs(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dailyLog.all,
    queryFn: async () => {
      const { data } = await api.get<any[]>('/daily-log');
      return data;
    },
    enabled: enabled && api.isAuthenticated(),
  });
}

// ── Fetch Stats ──────────────────────────────

export function useDailyLogStats(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dailyLog.stats,
    queryFn: async () => {
      const { data } = await api.get<any>('/daily-log/stats/summary');
      return data;
    },
    enabled: enabled && api.isAuthenticated(),
  });
}

// ── Save / Update Log ────────────────────────

export function useSaveDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, logData }: { date: string; logData: any }) => {
      const { data } = await api.put<any>(`/daily-log/${date}`, logData);
      return data;
    },
    onSuccess: (_data: any, variables: { date: string; logData: any }) => {
      // Invalidate both the specific date and the "all" list
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyLog.byDate(variables.date) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyLog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyLog.stats });
    },
  });
}

// ── Sync All Logs to Server ──────────────────

export function useSyncDailyLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (allLogs: Record<string, any>) => {
      const errors: string[] = [];
      for (const [date, log] of Object.entries(allLogs)) {
        try {
          await api.put(`/daily-log/${date}`, log);
        } catch (err: any) {
          errors.push(`Log ${date}: ${err.message}`);
        }
      }
      if (errors.length > 0) {
        throw new Error(errors.join('; '));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyLog.all });
    },
  });
}
