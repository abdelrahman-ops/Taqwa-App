import React from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { formatDate, getRamadanDay, MAX_TRACKING_DAYS, toLocalizedNum, RAMADAN_DAYS } from '../types';

export default function DaySelector() {
  const { currentDate, setDate, currentDayNumber, t, locale } = useApp();

  const today = formatDate(new Date());

  function changeDay(delta: number) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + delta);
    const newDate = formatDate(date);
    const dayNum = getRamadanDay(newDate);
    if (dayNum >= 1 && dayNum <= MAX_TRACKING_DAYS) {
      setDate(newDate);
    }
  }

  const canGoBack = currentDayNumber > 1;
  const canGoForward = currentDayNumber < MAX_TRACKING_DAYS;
  const isToday = currentDate === today;

  const dateLabel = new Date(currentDate + 'T12:00:00').toLocaleDateString(
    locale === 'ar' ? 'ar-EG' : 'en-US',
    { weekday: 'short', month: 'short', day: 'numeric' }
  );

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-3 py-2 mb-4 shadow-sm">
      <button
        onClick={() => changeDay(-1)}
        disabled={!canGoBack}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
        aria-label="Previous day"
      >
        {locale === 'ar' ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
      </button>

      <button
        onClick={() => setDate(today)}
        className="flex flex-col items-center gap-0 flex-1"
      >
        <div className="flex items-center gap-1.5">
          <FiCalendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {currentDayNumber <= RAMADAN_DAYS
              ? locale === 'ar'
                ? `رمضان ${toLocalizedNum(currentDayNumber, locale)}`
                : `Ramadan ${toLocalizedNum(currentDayNumber, locale)}`
              : locale === 'ar'
                ? `شوال ${toLocalizedNum(currentDayNumber - RAMADAN_DAYS, locale)}`
                : `Shawwal ${toLocalizedNum(currentDayNumber - RAMADAN_DAYS, locale)}`
            }
            {isToday && (
              <span className="ml-1 text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                {t.today}
              </span>
            )}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{dateLabel}</span>
      </button>

      <button
        onClick={() => changeDay(1)}
        disabled={!canGoForward}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
        aria-label="Next day"
      >
        {locale === 'ar' ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
      </button>
    </div>
  );
}
