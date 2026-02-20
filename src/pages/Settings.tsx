import React, { useState, useMemo } from 'react';
import {
  FiSettings,
  FiUser,
  FiGlobe,
  FiMoon,
  FiSun,
  FiMonitor,
  FiTrash2,
  FiInfo,
  FiWifi,
  FiWifiOff,
  FiRefreshCw,
  FiHeart,
  FiCheck,
  FiLogIn,
  FiShield,
  FiChevronRight,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { ThemeMode } from '../context/AppContext';
import { calculateDayProgress, toLocalizedNum } from '../types';

const DUAS = [
  { en: 'O Allah, help me remember You, be grateful to You, and worship You well.', ar: 'اللهم أعني على ذكرك وشكرك وحسن عبادتك' },
  { en: 'O Allah, You are forgiving and love forgiveness, so forgive me.', ar: 'اللهم إنك عفو تحب العفو فاعف عني' },
  { en: 'Our Lord, give us good in this world and good in the Hereafter.', ar: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة' },
];

export default function Settings() {
  const {
    userProfile,
    saveProfile,
    setLocale,
    setThemeMode,
    resetData,
    syncData,
    logout,
    signInFromGuest,
    isAuthenticated,
    isGuestMode,
    isOnline,
    syncing,
    locale,
    themeMode,
    allLogs,
    currentDayNumber,
    currentStreak,
    t,
  } = useApp();

  const [name, setName] = useState(userProfile?.name || '');
  const [nameSaved, setNameSaved] = useState(false);
  const [resetPhase, setResetPhase] = useState(0);

  // Pick a dua based on current day
  const dua = useMemo(() => DUAS[currentDayNumber % DUAS.length], [currentDayNumber]);

  // Quick summary stats
  const logs = useMemo(() => Object.values(allLogs), [allLogs]);
  const totalDaysTracked = logs.filter(l => calculateDayProgress(l) > 0).length;
  const perfectDays = logs.filter(l => calculateDayProgress(l) >= 90).length;

  function handleSaveName() {
    if (name.trim()) {
      saveProfile({ name: name.trim(), email: userProfile?.email || '', ramadanStartDate: userProfile?.ramadanStartDate || '' });
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
  }

  function handleReset() {
    if (resetPhase === 0) {
      setResetPhase(1);
    } else {
      resetData();
      setResetPhase(0);
    }
  }

  const themes: { mode: ThemeMode; label: string; Icon: React.ElementType }[] = [
    { mode: 'light', label: t.lightMode, Icon: FiSun },
    { mode: 'dark', label: t.darkMode, Icon: FiMoon },
    { mode: 'auto', label: t.auto, Icon: FiMonitor },
  ];

  return (
    <div className="fade-in">
      {/* Profile Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-950 rounded-2xl p-5 mb-4 shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/30">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-14 h-14 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Avatar + Info */}
        <div className="relative flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-black text-white border-2 border-white/20 shrink-0">
            {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">
              {userProfile?.name || (locale === 'ar' ? 'ضيف' : 'Guest')}
            </h1>
            {isAuthenticated && userProfile?.email ? (
              <p className="text-xs text-emerald-200/70 truncate">{userProfile.email}</p>
            ) : (
              <div className="flex items-center gap-1 mt-0.5">
                <FiShield className="w-3 h-3 text-amber-300/70" />
                <span className="text-[10px] text-amber-200/80 font-medium">
                  {locale === 'ar' ? 'وضع الضيف — البيانات محلية' : 'Guest mode — data stored locally'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mini journey stats */}
        <div className="relative flex gap-3">
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(totalDaysTracked, locale)}</div>
            <div className="text-[9px] text-emerald-200/70 font-medium">
              {locale === 'ar' ? 'أيام متتبعة' : 'Tracked'}
            </div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(currentStreak, locale)}</div>
            <div className="text-[9px] text-emerald-200/70 font-medium">
              {locale === 'ar' ? 'السلسلة' : 'Streak'}
            </div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(perfectDays, locale)}</div>
            <div className="text-[9px] text-emerald-200/70 font-medium">
              {locale === 'ar' ? 'أيام مثالية' : 'Perfect'}
            </div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(Math.max(0, 30 - currentDayNumber), locale)}</div>
            <div className="text-[9px] text-emerald-200/70 font-medium">
              {locale === 'ar' ? 'متبقية' : 'Left'}
            </div>
          </div>
        </div>
      </div>

      {/* Account / Auth card */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200/50 dark:border-blue-800/30 rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <FiLogIn className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {locale === 'ar' ? 'سجّل دخولك' : 'Sign in to sync'}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                {locale === 'ar' ? 'أنشئ حسابًا لحفظ تقدمك عبر الأجهزة' : 'Create an account to save your progress across devices'}
              </p>
            </div>
            <button
              onClick={signInFromGuest}
              className="shrink-0 flex items-center gap-1 px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
            >
              {locale === 'ar' ? 'دخول' : 'Sign in'}
              <FiChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sync & auth for authenticated users */}
      {isAuthenticated && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? <FiWifi className="w-4 h-4 text-emerald-500" /> : <FiWifiOff className="w-4 h-4 text-gray-400" />}
              <span className="text-sm text-gray-600 dark:text-gray-300">{isOnline ? (locale === 'ar' ? 'متصل' : 'Online') : (locale === 'ar' ? 'غير متصل' : 'Offline')}</span>
            </div>
            <button
              onClick={() => syncData()}
              disabled={!isOnline || syncing}
              className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 disabled:opacity-40"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {locale === 'ar' ? 'مزامنة' : 'Sync'}
            </button>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full py-2 text-sm text-red-500 border border-red-200 dark:border-red-900 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            {locale === 'ar' ? 'تسجيل خروج' : 'Log out'}
          </button>
        </div>
      )}

      {/* Dua of the day */}
      <div className="bg-amber-50/70 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 rounded-2xl p-4 mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <FiHeart className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            {locale === 'ar' ? 'دعاء اليوم' : "Today's Dua"}
          </span>
        </div>
        <p className="text-sm text-amber-900 dark:text-amber-200 font-medium leading-relaxed" style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
          {locale === 'ar' ? dua.ar : dua.en}
        </p>
      </div>

      {/* Name */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <FiUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t.yourName}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSaveName()}
            placeholder={t.enterName}
            className="w-full sm:flex-1 min-w-0 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSaveName}
            className="w-full sm:w-auto sm:shrink-0 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
          >
            {nameSaved ? <><FiCheck className="w-3.5 h-3.5 inline" /> {t.saved}</> : t.save}
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <FiGlobe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t.language}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLocale('en')}
            className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all ${locale === 'en' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            {t.english}
          </button>
          <button
            onClick={() => setLocale('ar')}
            className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all ${locale === 'ar' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            {t.arabic}
          </button>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <FiMoon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t.theme}</span>
        </div>
        <div className="flex gap-2">
          {themes.map(({ mode, label, Icon }) => (
            <button
              key={mode}
              onClick={() => setThemeMode(mode)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${themeMode === mode ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <FiInfo className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t.about}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t.aboutDescription}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t.dataStoredLocally}</p>
      </div>

      {/* Reset */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm p-4 mb-6">
        <span className="text-sm font-semibold text-red-500 block mb-2">{t.resetData}</span>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{t.resetWarning}</p>
        <button
          onClick={handleReset}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${resetPhase === 1 ? 'bg-red-600 text-white' : 'border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
        >
          <FiTrash2 className="w-4 h-4" />
          {resetPhase === 1 ? t.confirmReset : t.resetData}
        </button>
      </div>
    </div>
  );
}
