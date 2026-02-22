/**
 * Auth Hooks
 *
 * React Query mutations for login, register, and a query for the current user.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../lib/apiClient';
import { queryKeys } from './queryKeys';

// ── Types ────────────────────────────────────

interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

interface UserResponse {
  _id: string;
  name: string;
  email: string;
}

// ── Current User Query ───────────────────────

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const { data } = await api.get<UserResponse>('/auth/me');
      return data;
    },
    enabled: enabled && api.isAuthenticated(),
  });
}

// ── Login Mutation ───────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
      return data;
    },
    onSuccess: (data: AuthResponse) => {
      api.setAuthToken(data.token);
      queryClient.setQueryData(queryKeys.auth.me, {
        _id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      });
    },
  });
}

// ── Register Mutation ────────────────────────

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
      return data;
    },
    onSuccess: (data: AuthResponse) => {
      api.setAuthToken(data.token);
      queryClient.setQueryData(queryKeys.auth.me, {
        _id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      });
    },
  });
}

// ── Logout ───────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      api.setAuthToken(null);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
      queryClient.removeQueries({ queryKey: queryKeys.dailyLog.all });
      queryClient.removeQueries({ queryKey: queryKeys.quranGoal.current });
    },
  });
}
