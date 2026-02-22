/**
 * React Query Client Configuration
 *
 * Configures QueryClient with sensible defaults for an offline-first PWA:
 * - Stale time of 2 minutes (server data stays fresh for a bit)
 * - Retry only once on failure
 * - Refetch on window focus for background sync
 * - GC time of 30 minutes
 */

import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './apiClient';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,       // 2 minutes
      gcTime: 30 * 60 * 1000,          // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on auth errors or client errors
        if (error instanceof ApiError) {
          if (error.status === 401 || error.status === 403) return false;
          if (error.status >= 400 && error.status < 500) return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});
