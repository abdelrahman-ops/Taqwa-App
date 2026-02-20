/**
 * API Service Layer
 * Connects frontend to Express backend.
 * Falls back to localStorage when offline or unauthenticated.
 */

const API_BASE = '/api';

// ===== Auth Token Management =====

let authToken: string | null = localStorage.getItem('ramadan_auth_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('ramadan_auth_token', token);
  } else {
    localStorage.removeItem('ramadan_auth_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export function isAuthenticated(): boolean {
  return !!authToken;
}

// ===== Fetch Helper =====

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; offline: boolean }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { data: null, error: body.error || `HTTP ${res.status}`, offline: false };
    }

    const data = await res.json();
    return { data, error: null, offline: false };
  } catch {
    // Network error — offline
    return { data: null, error: 'Network error', offline: true };
  }
}

// ===== Auth API =====

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

export async function register(name: string, email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe() {
  return apiFetch<{ _id: string; name: string; email: string }>('/auth/me');
}

// ===== Daily Log API =====

export async function fetchDailyLog(date: string) {
  return apiFetch<any>(`/daily-log/${date}`);
}

export async function fetchAllDailyLogs() {
  return apiFetch<any[]>('/daily-log');
}

export async function saveDailyLogToServer(date: string, logData: any) {
  return apiFetch<any>(`/daily-log/${date}`, {
    method: 'PUT',
    body: JSON.stringify(logData),
  });
}

export async function fetchStats() {
  return apiFetch<any>('/daily-log/stats/summary');
}

// ===== Quran Goal API =====

export async function fetchQuranGoal() {
  return apiFetch<any>('/quran-goal');
}

export async function saveQuranGoalToServer(targetCompletions: number) {
  return apiFetch<any>('/quran-goal', {
    method: 'PUT',
    body: JSON.stringify({ targetCompletions }),
  });
}

export async function fetchQuranSchedule() {
  return apiFetch<any>('/quran-goal/schedule');
}

// ===== Health Check =====

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ===== Sync Service =====

/**
 * Sync local data to server. Called when user is authenticated and online.
 * Uses localStorage as source of truth, pushes to server.
 */
export async function syncToServer(allLogs: Record<string, any>, quranGoal: any) {
  if (!isAuthenticated()) return;

  const results: string[] = [];

  // Sync daily logs
  for (const [date, log] of Object.entries(allLogs)) {
    const { error } = await saveDailyLogToServer(date, log);
    if (error) results.push(`Log ${date}: ${error}`);
  }

  // Sync quran goal
  if (quranGoal) {
    const { error } = await saveQuranGoalToServer(quranGoal.targetCompletions);
    if (error) results.push(`QuranGoal: ${error}`);
  }

  return results;
}
