import React from 'react';
import { FiSun, FiSunrise, FiSunset, FiMoon, FiStar, FiCloudRain, FiList, FiClock, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PrayerStatus, isRamadanPeriod, toLocalizedNum, getHijriDate } from '../types';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { formatCountdown } from '../services/prayerTimes';
import PrayerCard from '../components/PrayerCard';
import AzkarCard from '../components/AzkarCard';

const PRAYER_ICON_MAP: Record<keyof PrayerStatus, React.ElementType> = {
  fajr: FiSunrise,
  dhuhr: FiSun,
  asr: FiCloudRain,
  maghrib: FiSunset,
  isha: FiMoon,
  taraweeh: FiStar,
};

/** Distinct colors per prayer — gives each icon a "live" time-of-day feel */
const PRAYER_ICON_COLOR: Record<keyof PrayerStatus, string> = {
  fajr:     'text-amber-400',          // soft sunrise gold
  dhuhr:    'text-yellow-500',         // bright midday sun
  asr:      'text-orange-400',         // warm afternoon
  maghrib:  'text-rose-500',           // sunset red-pink
  isha:     'text-indigo-400',         // deep night blue
  taraweeh: 'text-violet-400',         // spiritual night purple
};

const PRAYER_ICON_COLOR_DONE: Record<keyof PrayerStatus, string> = {
  fajr:     'text-amber-200',
  dhuhr:    'text-yellow-200',
  asr:      'text-orange-200',
  maghrib:  'text-rose-200',
  isha:     'text-indigo-200',
  taraweeh: 'text-violet-200',
};

const PRAYER_LABEL_AR: Record<keyof PrayerStatus, string> = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
  taraweeh: 'التراويح',
};

/** Map PrayerStatus keys to Aladhan timing keys */
const PRAYER_TIME_KEY: Partial<Record<keyof PrayerStatus, string>> = {
  fajr: 'fajr',
  dhuhr: 'dhuhr',
  asr: 'asr',
  maghrib: 'maghrib',
  isha: 'isha',
};

/** Convert "HH:MM" (24 h) → "h:mm:ss AM/PM" in 12-hour format with localised digits */
function to12Hour(time24: string, locale: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');
  const period = h >= 12 ? (locale === 'ar' ? 'م' : 'PM') : (locale === 'ar' ? 'ص' : 'AM');
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  const formatted = `${h}:${m}:${toLocalizedNum('00', locale)} ${period}`;
  return locale === 'ar' ? toLocalizedNum(formatted.replace(/ /g, '\u00A0'), locale) : formatted;
}

export default function Prayers() {
  const { dailyLog, updatePrayers, updateAzkar, allLogs, t, locale, currentDayNumber } = useApp();
  const { prayerTimes, loading: timesLoading, locationGranted, requestPermission } = usePrayerTimes();

  if (!dailyLog) return (
    <div className="flex items-center justify-center h-32 text-gray-400">{t.noData}</div>
  );

  const { prayers, azkar } = dailyLog;
  const inRamadan = isRamadanPeriod(currentDayNumber);

  // Always show all prayers including taraweeh/qiyam
  const prayerKeys = Object.keys(prayers) as (keyof PrayerStatus)[];
  const doneCount = prayerKeys.filter(k => prayers[k]).length;

  function getPrayerLabel(key: keyof PrayerStatus): string {
    if (key === 'taraweeh' && !inRamadan) {
      return locale === 'ar' ? 'قيام الليل' : 'Qiyam al-Layl';
    }
    return locale === 'ar' ? PRAYER_LABEL_AR[key] : t[key as keyof typeof t] as string;
  }

  function getPrayerTime(key: keyof PrayerStatus): string | null {
    if (!prayerTimes) return null;
    const timeKey = PRAYER_TIME_KEY[key];
    if (!timeKey) return null;
    const raw: string | undefined = (prayerTimes as any)[timeKey];
    if (!raw) return null;
    return to12Hour(raw, locale);
  }

  // Prayer stats — scoped to current Hijri month only
  const currentHijri = getHijriDate(currentDayNumber);
  const monthStartDay = currentDayNumber - currentHijri.dayInMonth + 1;
  const totalDays = currentHijri.daysInMonth; // full month length (29 or 30)

  const prayerStats: Partial<Record<keyof PrayerStatus, number>> = {};
  prayerKeys.forEach(key => {
    prayerStats[key] = Object.values(allLogs).filter(
      l => l.dayNumber >= monthStartDay && l.dayNumber <= currentDayNumber && l.prayers?.[key]
    ).length;
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

      <PrayerCard />
      <AzkarCard />

      {/* Prayer stats */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t.prayerBreakdown}</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
            {locale === 'ar' ? currentHijri.monthNameAr : currentHijri.monthNameEn}
          </span>
        </div>
        <div className="space-y-2">
          {prayerKeys.map(key => {
            const count = prayerStats[key] ?? 0;
            const pct = Math.min((count / totalDays) * 100, 100);
            const label = getPrayerLabel(key);
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-16">{label}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-right">{toLocalizedNum(count, locale)}/{toLocalizedNum(totalDays, locale)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
