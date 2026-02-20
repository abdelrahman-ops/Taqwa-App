/**
 * Local Storage Service
 * Provides offline-first data persistence for the PWA.
 * All data is stored in localStorage so the app works without a backend.
 */

import {
  DailyLog,
  QuranGoal,
  UserProfile,
  createEmptyDailyLog,
  QURAN_TOTAL_PAGES,
  RAMADAN_DAYS,
} from '../types';

const STORAGE_KEYS = {
  DAILY_LOGS: 'ramadan_daily_logs',
  QURAN_GOAL: 'ramadan_quran_goal',
  USER_PROFILE: 'ramadan_user_profile',
  ONBOARDED: 'ramadan_onboarded',
  RAMADAN_START: 'ramadan_start_date',
  GUEST_MODE: 'ramadan_guest_mode',
  VOLUNTARY_FASTS: 'ramadan_voluntary_fasts',
};

function computeQuranForDay(
  logs: Record<string, DailyLog>,
  dayNumber: number,
  quranGoal: QuranGoal
): { targetPages: number; fromPage: number; toPage: number } {
  const totalGoalPages = QURAN_TOTAL_PAGES * quranGoal.targetCompletions;

  // Sum ALL previously read pages (including any over-reading)
  const previousReadPages = Object.values(logs)
    .filter((l) => l.dayNumber < dayNumber)
    .reduce((sum, l) => sum + (l.quran?.pagesRead || 0), 0);

  const remainingPages = Math.max(0, totalGoalPages - previousReadPages);
  const remainingDays = Math.max(1, RAMADAN_DAYS - dayNumber + 1);

  // If user already read everything (or over-read across all days), target is 0
  const targetPages = remainingPages <= 0
    ? 0
    : Math.max(1, Math.ceil(remainingPages / remainingDays));

  // fromPage starts right after what was already read (handles over-reading naturally)
  const fromAbsolute = previousReadPages + 1;
  const toAbsolute = Math.min(totalGoalPages, previousReadPages + Math.max(targetPages, 1));
  const fromPage = fromAbsolute > totalGoalPages
    ? 0
    : ((fromAbsolute - 1) % QURAN_TOTAL_PAGES) + 1;
  const toPage = toAbsolute > totalGoalPages
    ? QURAN_TOTAL_PAGES
    : ((Math.max(fromAbsolute, toAbsolute) - 1) % QURAN_TOTAL_PAGES) + 1;

  return { targetPages, fromPage, toPage };
}

// ===== Daily Logs =====

export function getAllDailyLogs(): Record<string, DailyLog> {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
  return data ? JSON.parse(data) : {};
}

export function getDailyLog(date: string): DailyLog | null {
  const logs = getAllDailyLogs();
  return logs[date] || null;
}

export function saveDailyLog(log: DailyLog): void {
  const logs = getAllDailyLogs();
  logs[log.date] = log;
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
}

export function getOrCreateDailyLog(date: string, dayNumber: number): DailyLog {
  const logs = getAllDailyLogs();
  const quranGoal = getQuranGoal();
  const existing = logs[date];

  if (existing) {
    if ((existing.quran?.pagesRead || 0) === 0) {
      const dynamicQuran = computeQuranForDay(logs, dayNumber, quranGoal);
      const updated: DailyLog = {
        ...existing,
        quran: {
          ...existing.quran,
          targetPages: dynamicQuran.targetPages,
          fromPage: dynamicQuran.fromPage,
          toPage: dynamicQuran.toPage,
          completed: false,
        },
      };
      saveDailyLog(updated);
      return updated;
    }
    return existing;
  }

  const newLog = createEmptyDailyLog(date, dayNumber, quranGoal);
  const dynamicQuran = computeQuranForDay(logs, dayNumber, quranGoal);
  newLog.quran.targetPages = dynamicQuran.targetPages;
  newLog.quran.fromPage = dynamicQuran.fromPage;
  newLog.quran.toPage = dynamicQuran.toPage;
  newLog.quran.completed = false;
  saveDailyLog(newLog);
  return newLog;
}

// ===== Quran Goal =====

export function getQuranGoal(): QuranGoal {
  const data = localStorage.getItem(STORAGE_KEYS.QURAN_GOAL);
  if (data) return JSON.parse(data);

  // Default: complete Quran once
  return {
    targetCompletions: 1,
    totalPages: QURAN_TOTAL_PAGES,
    totalDays: RAMADAN_DAYS,
    dailyPages: Math.ceil(QURAN_TOTAL_PAGES / RAMADAN_DAYS),
  };
}

export function saveQuranGoal(goal: QuranGoal): void {
  goal.dailyPages = Math.ceil((goal.totalPages * goal.targetCompletions) / goal.totalDays);
  localStorage.setItem(STORAGE_KEYS.QURAN_GOAL, JSON.stringify(goal));
}

// ===== User Profile =====

export function getUserProfile(): UserProfile | null {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

// ===== Onboarding =====

export function isOnboarded(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
}

export function setOnboarded(): void {
  localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
}

export function isGuestMode(): boolean {
  return localStorage.getItem(STORAGE_KEYS.GUEST_MODE) === 'true';
}

export function setGuestMode(enabled: boolean): void {
  if (enabled) {
    localStorage.setItem(STORAGE_KEYS.GUEST_MODE, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.GUEST_MODE);
  }
}

// ===== Ramadan Start Date =====

export function getRamadanStartDate(): string {
  return localStorage.getItem(STORAGE_KEYS.RAMADAN_START) || '2026-02-19';
}

export function setRamadanStartDate(date: string): void {
  localStorage.setItem(STORAGE_KEYS.RAMADAN_START, date);
}

// ===== Statistics =====

export function getStats() {
  const logs = getAllDailyLogs();
  const logArray = Object.values(logs);

  return {
    totalDaysTracked: logArray.length,
    fastingDays: logArray.filter((l) => l.fasting.completed).length,
    totalPrayers: logArray.reduce((sum, l) => {
      const p = l.prayers;
      return sum + [p.fajr, p.dhuhr, p.asr, p.maghrib, p.isha, p.taraweeh].filter(Boolean).length;
    }, 0),
    totalQuranPages: logArray.reduce((sum, l) => sum + l.quran.pagesRead, 0),
    morningAzkar: logArray.filter((l) => l.azkar.morning).length,
    eveningAzkar: logArray.filter((l) => l.azkar.evening).length,
    totalExtras: logArray.reduce(
      (sum, l) => sum + l.extras.filter((e) => e.completed).length,
      0
    ),
    prayerBreakdown: {
      fajr: logArray.filter((l) => l.prayers.fajr).length,
      dhuhr: logArray.filter((l) => l.prayers.dhuhr).length,
      asr: logArray.filter((l) => l.prayers.asr).length,
      maghrib: logArray.filter((l) => l.prayers.maghrib).length,
      isha: logArray.filter((l) => l.prayers.isha).length,
      taraweeh: logArray.filter((l) => l.prayers.taraweeh).length,
    },
  };
}

// ===== Voluntary Fasting (post-Ramadan / Shawwal) =====

export function getVoluntaryFast(date: string): boolean {
  const data = localStorage.getItem(STORAGE_KEYS.VOLUNTARY_FASTS);
  const fasts: Record<string, boolean> = data ? JSON.parse(data) : {};
  return fasts[date] ?? false;
}

export function setVoluntaryFast(date: string, value: boolean): void {
  const data = localStorage.getItem(STORAGE_KEYS.VOLUNTARY_FASTS);
  const fasts: Record<string, boolean> = data ? JSON.parse(data) : {};
  if (value) {
    fasts[date] = true;
  } else {
    delete fasts[date];
  }
  localStorage.setItem(STORAGE_KEYS.VOLUNTARY_FASTS, JSON.stringify(fasts));
}

// ===== Clear All Data =====

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
