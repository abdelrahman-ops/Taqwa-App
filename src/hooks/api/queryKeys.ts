/**
 * Query Keys
 *
 * Centralized query key factory for consistent cache management.
 */

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  dailyLog: {
    all: ['dailyLog'] as const,
    byDate: (date: string) => ['dailyLog', date] as const,
    stats: ['dailyLog', 'stats'] as const,
  },
  quranGoal: {
    current: ['quranGoal'] as const,
    schedule: ['quranGoal', 'schedule'] as const,
  },
} as const;
