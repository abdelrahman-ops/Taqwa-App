import React from 'react';
import { FiSun, FiSunrise, FiSunset, FiMoon, FiStar, FiCloudRain, FiCheck } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { PrayerStatus, isRamadanPeriod, toLocalizedNum, RAMADAN_DAYS } from '../types';

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

export default function PrayerCard() {
  const { dailyLog, updatePrayers, t, locale, currentDayNumber } = useApp();

  if (!dailyLog) return null;
  const { prayers } = dailyLog;

  // Taraweeh is only a Ramadan prayer — hide it outside Ramadan
  const inRamadan = isRamadanPeriod(currentDayNumber);
  const isLastNight = currentDayNumber === RAMADAN_DAYS;
  const prayerKeys = (Object.keys(prayers) as (keyof PrayerStatus)[]).filter(
    k => inRamadan || k !== 'taraweeh'
  );
  const doneCount = prayerKeys.filter(k => prayers[k]).length;

  // On the last night of Ramadan (day 30), taraweeh becomes Qiyam al-Layl
  function getPrayerLabel(key: keyof PrayerStatus): string {
    if (key === 'taraweeh' && isLastNight) {
      return locale === 'ar' ? 'قيام الليل' : 'Qiyam';
    }
    return locale === 'ar' ? PRAYER_LABEL_AR[key] : t[key as keyof typeof t] as string;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FiSun className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">{t.prayersTitle}</h2>
        </div>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {toLocalizedNum(doneCount, locale)}/{toLocalizedNum(prayerKeys.length, locale)}
        </span>
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
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all active:scale-95 ${
                done
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{label}</span>
              {done && <FiCheck className="w-3 h-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
