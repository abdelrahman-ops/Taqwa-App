/**
 * API Hooks — Barrel Export
 *
 * Re-exports all React Query hooks for convenient imports:
 *   import { useLogin, useDailyLog, useQuranGoal } from '@/hooks/api';
 */

export { queryKeys } from './queryKeys';

// Auth
export { useCurrentUser, useLogin, useRegister, useLogout } from './useAuthMutation';

// Daily Logs
export { useDailyLog, useAllDailyLogs, useDailyLogStats, useSaveDailyLog, useSyncDailyLogs } from './useDailyLogQuery';

// Quran Goal
export { useQuranGoal, useQuranSchedule, useSaveQuranGoal } from './useQuranGoalQuery';
