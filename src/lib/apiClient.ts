/**
 * API Client with Interceptor Pattern
 *
 * Provides a fetch-based HTTP client with:
 * - Request interceptors (auth token injection)
 * - Response interceptors (error normalization, 401 handling)
 * - Offline detection
 * - Type-safe request/response handling
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export class ApiError extends Error {
  status: number;
  offline: boolean;

  constructor(message: string, status: number = 0, offline = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.offline = offline;
  }
}

type RequestInterceptor = (config: RequestInit & { url: string }) => RequestInit & { url: string };
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

// ──────────────────────────────────────────────
// Interceptor Registry
// ──────────────────────────────────────────────

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

export function addRequestInterceptor(fn: RequestInterceptor) {
  requestInterceptors.push(fn);
  return () => {
    const idx = requestInterceptors.indexOf(fn);
    if (idx !== -1) requestInterceptors.splice(idx, 1);
  };
}

export function addResponseInterceptor(fn: ResponseInterceptor) {
  responseInterceptors.push(fn);
  return () => {
    const idx = responseInterceptors.indexOf(fn);
    if (idx !== -1) responseInterceptors.splice(idx, 1);
  };
}

// ──────────────────────────────────────────────
// Auth Token Management
// ──────────────────────────────────────────────

const TOKEN_KEY = 'ramadan_auth_token';

let authToken: string | null = localStorage.getItem(TOKEN_KEY);

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export function isAuthenticated(): boolean {
  return !!authToken;
}

// ──────────────────────────────────────────────
// Built-in Auth Interceptor
// ──────────────────────────────────────────────

addRequestInterceptor((config) => {
  if (authToken) {
    const headers = new Headers(config.headers);
    headers.set('Authorization', `Bearer ${authToken}`);
    return { ...config, headers };
  }
  return config;
});

// ──────────────────────────────────────────────
// Core HTTP Methods
// ──────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Build initial config
  let config: RequestInit & { url: string } = {
    url: `${API_BASE}${endpoint}`,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  // Apply request interceptors
  for (const interceptor of requestInterceptors) {
    config = interceptor(config);
  }

  const { url, ...fetchOptions } = config;

  try {
    let response = await fetch(url, fetchOptions);

    // Apply response interceptors
    for (const interceptor of responseInterceptors) {
      response = await interceptor(response);
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = body.error || body.message || `HTTP ${response.status}`;

      // Handle 401 — clear auth
      if (response.status === 401) {
        setAuthToken(null);
      }

      throw new ApiError(message, response.status);
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (err) {
    if (err instanceof ApiError) throw err;

    // Network error → offline
    throw new ApiError('Network error — you appear to be offline', 0, true);
  }
}

/** GET request */
export function get<T>(endpoint: string) {
  return request<T>(endpoint, { method: 'GET' });
}

/** POST request */
export function post<T>(endpoint: string, body?: unknown) {
  return request<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/** PUT request */
export function put<T>(endpoint: string, body?: unknown) {
  return request<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/** DELETE request */
export function del<T>(endpoint: string) {
  return request<T>(endpoint, { method: 'DELETE' });
}

// ──────────────────────────────────────────────
// Health Check (standalone, no interceptors)
// ──────────────────────────────────────────────

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
