import React from 'react';
import { FiSun, FiSunrise, FiSunset, FiMoon, FiStar, FiCloudRain, FiList } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PrayerStatus, isRamadanPeriod, RAMADAN_DAYS, toLocalizedNum } from '../types';

const PRAYER_ICON_MAP: Record<keyof PrayerStatus, React.ElementType> = {
  fajr: FiSunrise,
  dhuhr: FiSun,
  asr: FiCloudRain,
  maghrib: FiSunset,
  isha: FiMoon,
  taraweeh: FiStar,
};

const PRAYER_LABEL_AR: Record<keyof PrayerStatus, string> = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
  taraweeh: 'التراويح',
};

export default function Prayers() {
  const { dailyLog, updatePrayers, updateAzkar, allLogs, t, locale, currentDayNumber } = useApp();

  if (!dailyLog) return (
    <div className="flex items-center justify-center h-32 text-gray-400">{t.noData}</div>
  );

  const { prayers, azkar } = dailyLog;
  const inRamadan = isRamadanPeriod(currentDayNumber);
  const isLastNight = currentDayNumber === RAMADAN_DAYS;

  // Filter taraweeh once Ramadan ends
  const prayerKeys = (Object.keys(prayers) as (keyof PrayerStatus)[]).filter(
    k => inRamadan || k !== 'taraweeh'
  );
  const doneCount = prayerKeys.filter(k => prayers[k]).length;

  function getPrayerLabel(key: keyof PrayerStatus): string {
    if (key === 'taraweeh' && isLastNight) {
      return locale === 'ar' ? 'قيام الليل' : 'Qiyam';
    }
    return locale === 'ar' ? PRAYER_LABEL_AR[key] : t[key as keyof typeof t] as string;
  }

  // Prayer stats across all logs
  const prayerStats: Partial<Record<keyof PrayerStatus, number>> = {};
  prayerKeys.forEach(key => {
    prayerStats[key] = Object.values(allLogs).filter(l => l.prayers?.[key]).length;
  });

  return (
    <div className="fade-in">
      {/* Spiritual header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950 rounded-2xl p-5 mb-4 shadow-lg shadow-blue-900/10 dark:shadow-blue-900/30">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-14 h-14 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <FiSun className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{t.prayersAndAzkar}</h1>
              <p className="text-xs text-blue-200/70">{t.trackPrayers}</p>
            </div>
          </div>
          <div className="bg-white/15 rounded-xl px-3 py-1.5">
            <span className="text-lg font-black text-white">{toLocalizedNum(doneCount, locale)}/{toLocalizedNum(prayerKeys.length, locale)}</span>
          </div>
        </div>
      </div>

      {/* Today's prayers */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t.prayersTitle}</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{toLocalizedNum(doneCount, locale)}/{toLocalizedNum(prayerKeys.length, locale)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {prayerKeys.map(key => {
            const Icon = PRAYER_ICON_MAP[key];
            const done = prayers[key];
            const label = getPrayerLabel(key);
            return (
              <button
                key={key}
                onClick={() => updatePrayers(key, !done)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                  done
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Azkar summary */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t.azkar}</span>
          <Link
            to="/azkar"
            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <FiList className="w-3 h-3" />
            {locale === 'ar' ? 'القائمة الكاملة' : 'Full Azkar list'}
          </Link>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => updateAzkar('morning', !azkar.morning)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
              azkar.morning
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-400'
            }`}
          >
            <FiSun className="w-4 h-4" />
            {t.morningAzkar}
          </button>
          <button
            onClick={() => updateAzkar('evening', !azkar.evening)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
              azkar.evening
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400'
            }`}
          >
            <FiMoon className="w-4 h-4" />
            {t.eveningAzkar}
          </button>
        </div>
      </div>

      {/* Prayer stats */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-3">{t.prayerBreakdown}</span>
        <div className="space-y-2">
          {prayerKeys.map(key => {
            const count = prayerStats[key] ?? 0;
            const pct = Math.min((count / 30) * 100, 100);
            const label = getPrayerLabel(key);
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-16">{label}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right">{count}/30</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
