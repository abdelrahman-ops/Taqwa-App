import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import {
  DailyLog,
  QuranGoal,
  UserProfile,
  formatDate,
  getRamadanDay,
  createEmptyDailyLog,
  QURAN_TOTAL_PAGES,
  RAMADAN_DAYS,
  calculateDayProgress,
} from '../types';
import * as storage from '../services/storage';
import * as api from '../services/api';
import { Locale, getDirection, getTranslations, Translations } from '../i18n';

// ===== Theme =====
export type ThemeMode = 'light' | 'dark' | 'auto';

function getStoredTheme(): ThemeMode {
  return (localStorage.getItem('ramadan_theme') as ThemeMode) || 'auto';
}
function getStoredLocale(): Locale {
  return (localStorage.getItem('ramadan_locale') as Locale) || 'en';
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

// ===== State Types =====

interface AppState {
  currentDate: string;
  currentDayNumber: number;
  dailyLog: DailyLog | null;
  allLogs: Record<string, DailyLog>;
  quranGoal: QuranGoal;
  userProfile: UserProfile | null;
  isOnboarded: boolean;
  ramadanStartDate: string;
  loading: boolean;
  locale: Locale;
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  isOnline: boolean;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  syncing: boolean;
}

type AppAction =
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_DAILY_LOG'; payload: DailyLog }
  | { type: 'SET_ALL_LOGS'; payload: Record<string, DailyLog> }
  | { type: 'SET_QURAN_GOAL'; payload: QuranGoal }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'SET_ONBOARDED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOCALE'; payload: Locale }
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'SET_RESOLVED_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_GUEST_MODE'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'INIT'; payload: Partial<AppState> };

interface AppContextType extends AppState {
  t: Translations;
  direction: 'ltr' | 'rtl';
  currentStreak: number;
  longestStreak: number;
  setDate: (date: string) => void;
  updateDailyLog: (updates: Partial<DailyLog>) => void;
  updateFasting: (updates: Partial<DailyLog['fasting']>) => void;
  updatePrayers: (prayer: keyof DailyLog['prayers'], value: boolean) => void;
  updateQuran: (updates: Partial<DailyLog['quran']>) => void;
  updateAzkar: (type: 'morning' | 'evening', value: boolean) => void;
  addExtra: (description: string) => void;
  toggleExtra: (id: string) => void;
  removeExtra: (id: string) => void;
  setQuranGoal: (targetCompletions: number) => void;
  saveProfile: (profile: UserProfile) => void;
  completeOnboarding: (name: string, quranTarget: number) => void;
  resetData: () => void;
  setLocale: (locale: Locale) => void;
  setThemeMode: (mode: ThemeMode) => void;
  loginUser: (email: string, password: string) => Promise<string | null>;
  registerUser: (name: string, email: string, password: string) => Promise<string | null>;
  continueAsGuest: () => void;
  signInFromGuest: () => void;
  logout: () => void;
  syncData: () => Promise<void>;
  isPostRamadan: boolean;
  todayStr: string;
}

// ===== Initial State =====

const today = formatDate(new Date());
const startDate = storage.getRamadanStartDate();
const storedTheme = getStoredTheme();
/** Day number for today — fixed at module load time for streak calculations. */
const todayDayNumber = getRamadanDay(today, startDate);
const isPostRamadanToday = todayDayNumber > RAMADAN_DAYS;

const initialState: AppState = {
  currentDate: today,
  currentDayNumber: todayDayNumber,
  dailyLog: null,
  allLogs: {},
  quranGoal: storage.getQuranGoal(),
  userProfile: storage.getUserProfile(),
  isOnboarded: storage.isOnboarded(),
  ramadanStartDate: startDate,
  loading: true,
  locale: getStoredLocale(),
  themeMode: storedTheme,
  resolvedTheme: resolveTheme(storedTheme),
  isOnline: navigator.onLine,
  isAuthenticated: api.isAuthenticated(),
  isGuestMode: storage.isGuestMode(),
  syncing: false,
};

function computeStreaks(allLogs: Record<string, DailyLog>, currentDayNumber: number) {
  const achievedDays = new Set(
    Object.values(allLogs)
      .filter((log) => calculateDayProgress(log) >= 40)
      .map((log) => log.dayNumber)
  );

  // If today hasn't reached 40% yet (still in progress), don't let it break
  // the streak — start counting from yesterday instead.
  const startDay = achievedDays.has(currentDayNumber)
    ? currentDayNumber
    : currentDayNumber - 1;

  let currentStreak = 0;
  for (let day = startDay; day >= 1; day--) {
    if (achievedDays.has(day)) {
      currentStreak++;
    } else {
      break;
    }
  }

  const sortedDays = Array.from(achievedDays).sort((a, b) => a - b);
  let longestStreak = 0;
  let running = 0;
  let previous = -1;

  for (const day of sortedDays) {
    if (day === previous + 1) {
      running += 1;
    } else {
      running = 1;
    }
    longestStreak = Math.max(longestStreak, running);
    previous = day;
  }

  return { currentStreak, longestStreak };
}

// ===== Reducer =====

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_DATE': {
      const dayNumber = getRamadanDay(action.payload, state.ramadanStartDate);
      return { ...state, currentDate: action.payload, currentDayNumber: dayNumber };
    }
    case 'SET_DAILY_LOG':
      return { ...state, dailyLog: action.payload };
    case 'SET_ALL_LOGS':
      return { ...state, allLogs: action.payload };
    case 'SET_QURAN_GOAL':
      return { ...state, quranGoal: action.payload };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'SET_ONBOARDED':
      return { ...state, isOnboarded: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_LOCALE':
      return { ...state, locale: action.payload };
    case 'SET_THEME':
      return { ...state, themeMode: action.payload, resolvedTheme: resolveTheme(action.payload) };
    case 'SET_RESOLVED_THEME':
      return { ...state, resolvedTheme: action.payload };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_GUEST_MODE':
      return { ...state, isGuestMode: action.payload };
    case 'SET_SYNCING':
      return { ...state, syncing: action.payload };
    case 'INIT':
      return { ...state, ...action.payload, loading: false };
    default:
      return state;
  }
}

// ===== Context =====

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.resolvedTheme);
    root.classList.remove('dark', 'light');
    root.classList.add(state.resolvedTheme);

    const themeColor = state.resolvedTheme === 'dark' ? '#0D1117' : '#1B5E20';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
  }, [state.resolvedTheme]);

  // Apply locale/direction to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', state.locale);
    root.setAttribute('dir', getDirection(state.locale));
  }, [state.locale]);

  // Listen for system theme changes
  useEffect(() => {
    if (state.themeMode !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      dispatch({ type: 'SET_RESOLVED_THEME', payload: e.matches ? 'dark' : 'light' });
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [state.themeMode]);

  // Online/offline detection
  useEffect(() => {
    const onOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const onOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Initialize data from localStorage
  useEffect(() => {
    const bootstrap = async () => {
      const allLogs = storage.getAllDailyLogs();
      const quranGoal = storage.getQuranGoal();
      const dayNumber = getRamadanDay(today, startDate);
      const dailyLog = storage.getOrCreateDailyLog(today, dayNumber);
      let profile = storage.getUserProfile();
      let authenticated = api.isAuthenticated();
      const guestMode = storage.isGuestMode();

      if (authenticated) {
        const { data } = await api.getMe();
        if (data) {
          profile = {
            name: data.name,
            email: data.email,
            ramadanStartDate: profile?.ramadanStartDate || startDate,
          };
          storage.saveUserProfile(profile);
        } else {
          api.setAuthToken(null);
          authenticated = false;
        }
      }

      dispatch({
        type: 'INIT',
        payload: {
          allLogs,
          quranGoal,
          dailyLog,
          userProfile: profile || null,
          isAuthenticated: authenticated,
          isGuestMode: guestMode,
        },
      });
    };

    bootstrap();
  }, []);

  // Load daily log when date changes
  useEffect(() => {
    if (state.loading) return;
    const log = storage.getOrCreateDailyLog(state.currentDate, state.currentDayNumber);
    dispatch({ type: 'SET_DAILY_LOG', payload: log });
  }, [state.currentDate, state.currentDayNumber, state.loading]);

  const setDate = useCallback((date: string) => {
    dispatch({ type: 'SET_DATE', payload: date });
  }, []);

  const saveDailyLogAndSync = useCallback(
    (updated: DailyLog) => {
      storage.saveDailyLog(updated);
      dispatch({ type: 'SET_DAILY_LOG', payload: updated });
      dispatch({ type: 'SET_ALL_LOGS', payload: storage.getAllDailyLogs() });
      if (api.isAuthenticated()) {
        api.saveDailyLogToServer(updated.date, updated).catch(() => {});
      }
    },
    []
  );

  const updateDailyLog = useCallback(
    (updates: Partial<DailyLog>) => {
      if (!state.dailyLog) return;
      saveDailyLogAndSync({ ...state.dailyLog, ...updates });
    },
    [state.dailyLog, saveDailyLogAndSync]
  );

  const updateFasting = useCallback(
    (updates: Partial<DailyLog['fasting']>) => {
      if (!state.dailyLog) return;
      saveDailyLogAndSync({
        ...state.dailyLog,
        fasting: { ...state.dailyLog.fasting, ...updates },
      });
    },
    [state.dailyLog, saveDailyLogAndSync]
  );

  const updatePrayers = useCallback(
    (prayer: keyof DailyLog['prayers'], value: boolean) => {
      if (!state.dailyLog) return;
      saveDailyLogAndSync({
        ...state.dailyLog,
        prayers: { ...state.dailyLog.prayers, [prayer]: value },
      });
    },
    [state.dailyLog, saveDailyLogAndSync]
  );

  const updateQuran = useCallback(
    (updates: Partial<DailyLog['quran']>) => {
      if (!state.dailyLog) return;
      const newQuran = { ...state.dailyLog.quran, ...updates };
      newQuran.completed = newQuran.pagesRead >= newQuran.targetPages;
      saveDailyLogAndSync({ ...state.dailyLog, quran: newQuran });
    },
    [state.dailyLog, saveDailyLogAndSync]
  );

  const updateAzkar = useCallback(
    (type: 'morning' | 'evening', value: boolean) => {
      if (!state.dailyLog) return;
      saveDailyLogAndSync({
        ...state.dailyLog,
        azkar: { ...state.dailyLog.azkar, [type]: value },
      });
    },
    [state.dailyLog, saveDailyLogAndSync]
  );

  const addExtra = useCallback(
    (description: string) => {
      if (!state.dailyLog) return;
      const newExtra = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        description,
        completed: false,
      };
      saveDailyLogAndSync({
        ...state.dailyLog,
        extras: [...state.dailyLog.extras, newExtra],
      });
    },
    [state.dailyLog, saveDailyLogAndSync]
  );

  const toggleExtra = useCallback(
    (id: string) => {
      if (!state.dailyLog) return;
      saveDailyLogAndSync({
        ...state.dailyLog,
        extras: state.dailyLog.extras.map((e) =>
          e.id === id ? { ...e, completed: !e.completed } : e
        ),
      });
    },
    [state.dailyLog, saveDailyLogAndSync]
  );

  const removeExtra = useCallback(
    (id: string) => {
      if (!state.dailyLog) return;
      saveDailyLogAndSync({
        ...state.dailyLog,
        extras: state.dailyLog.extras.filter((e) => e.id !== id),
      });
    },
    [state.dailyLog, saveDailyLogAndSync]
  );

  const setQuranGoal = useCallback((targetCompletions: number) => {
    const goal: QuranGoal = {
      targetCompletions,
      totalPages: QURAN_TOTAL_PAGES,
      totalDays: RAMADAN_DAYS,
      dailyPages: Math.ceil((QURAN_TOTAL_PAGES * targetCompletions) / RAMADAN_DAYS),
    };
    storage.saveQuranGoal(goal);
    dispatch({ type: 'SET_QURAN_GOAL', payload: goal });
    const refreshedLog = storage.getOrCreateDailyLog(state.currentDate, state.currentDayNumber);
    dispatch({ type: 'SET_DAILY_LOG', payload: refreshedLog });
    dispatch({ type: 'SET_ALL_LOGS', payload: storage.getAllDailyLogs() });
    if (api.isAuthenticated()) {
      api.saveQuranGoalToServer(targetCompletions).catch(() => {});
    }
  }, [state.currentDate, state.currentDayNumber]);

  const saveProfile = useCallback((profile: UserProfile) => {
    storage.saveUserProfile(profile);
    dispatch({ type: 'SET_USER_PROFILE', payload: profile });
  }, []);

  const completeOnboarding = useCallback(
    (name: string, quranTarget: number) => {
      const profile: UserProfile = { name, email: '', ramadanStartDate: '2026-02-19' };
      storage.saveUserProfile(profile);
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
      setQuranGoal(quranTarget);
      storage.setOnboarded();
      dispatch({ type: 'SET_ONBOARDED', payload: true });
    },
    [setQuranGoal]
  );

  const resetData = useCallback(() => {
    storage.clearAllData();
    api.setAuthToken(null);
    window.location.reload();
  }, []);

  const setLocale = useCallback((locale: Locale) => {
    localStorage.setItem('ramadan_locale', locale);
    dispatch({ type: 'SET_LOCALE', payload: locale });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    localStorage.setItem('ramadan_theme', mode);
    dispatch({ type: 'SET_THEME', payload: mode });
  }, []);

  const loginUser = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await api.login(email, password);
    if (data) {
      api.setAuthToken(data.token);
      const profile: UserProfile = {
        name: data.user.name,
        email: data.user.email,
        ramadanStartDate: state.userProfile?.ramadanStartDate || state.ramadanStartDate,
      };
      storage.saveUserProfile(profile);
      storage.setGuestMode(false);
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_GUEST_MODE', payload: false });
      return null;
    }
    return error || 'Login failed';
  }, [state.ramadanStartDate, state.userProfile?.ramadanStartDate]);

  const registerUser = useCallback(async (name: string, email: string, password: string): Promise<string | null> => {
    const { data, error } = await api.register(name, email, password);
    if (data) {
      api.setAuthToken(data.token);
      const profile: UserProfile = {
        name: data.user.name,
        email: data.user.email,
        ramadanStartDate: state.userProfile?.ramadanStartDate || state.ramadanStartDate,
      };
      storage.saveUserProfile(profile);
      storage.setGuestMode(false);
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_GUEST_MODE', payload: false });
      return null;
    }
    return error || 'Registration failed';
  }, [state.ramadanStartDate, state.userProfile?.ramadanStartDate]);

  const continueAsGuest = useCallback(() => {
    storage.setGuestMode(true);
    dispatch({ type: 'SET_GUEST_MODE', payload: true });
  }, []);

  const signInFromGuest = useCallback(() => {
    storage.setGuestMode(false);
    dispatch({ type: 'SET_GUEST_MODE', payload: false });
  }, []);

  const logout = useCallback(() => {
    api.setAuthToken(null);
    storage.setGuestMode(false);
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'SET_GUEST_MODE', payload: false });
  }, []);

  const syncData = useCallback(async () => {
    if (!api.isAuthenticated()) return;
    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      await api.syncToServer(storage.getAllDailyLogs(), storage.getQuranGoal());
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }, []);

  const t = getTranslations(state.locale);
  const direction = getDirection(state.locale);
  // Always use today's day number so streak reflects actual progress, not whichever day is being viewed
  const { currentStreak, longestStreak } = computeStreaks(state.allLogs, todayDayNumber);

  const contextValue: AppContextType = {
    ...state,
    t,
    direction,
    currentStreak,
    longestStreak,
    isPostRamadan: isPostRamadanToday,
    todayStr: today,
    setDate,
    updateDailyLog,
    updateFasting,
    updatePrayers,
    updateQuran,
    updateAzkar,
    addExtra,
    toggleExtra,
    removeExtra,
    setQuranGoal,
    saveProfile,
    completeOnboarding,
    resetData,
    setLocale,
    setThemeMode,
    loginUser,
    registerUser,
    continueAsGuest,
    signInFromGuest,
    logout,
    syncData,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
