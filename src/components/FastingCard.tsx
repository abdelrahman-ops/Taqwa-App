import React, { useState } from 'react';
import { FiEdit3, FiCheck, FiMoon, FiFileText } from 'react-icons/fi';
import { IoRestaurantOutline } from 'react-icons/io5';
import { useApp } from '../context/AppContext';
import { isRamadanPeriod } from '../types';

export default function FastingCard() {
  const { dailyLog, updateFasting, t, locale, currentDayNumber } = useApp();
  const [showNotes, setShowNotes] = useState(false);

  if (!dailyLog) return null;
  const { fasting } = dailyLog;
  const inRamadan = isRamadanPeriod(currentDayNumber);

  const fastingTitle = inRamadan
    ? t.fasting
    : locale === 'ar' ? 'صيام تطوعي' : 'Voluntary Fasting';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${inRamadan ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-teal-100 dark:bg-teal-900/30'}`}>
          <IoRestaurantOutline className={`w-4 h-4 ${inRamadan ? 'text-amber-600 dark:text-amber-400' : 'text-teal-600 dark:text-teal-400'}`} />
        </div>
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{fastingTitle}</h2>
        {!inRamadan && (
          <span className="text-[10px] bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full font-medium">
            {locale === 'ar' ? 'سنة' : 'Sunnah'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Fasted */}
        <button
          onClick={() => updateFasting({ completed: !fasting.completed })}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-medium text-sm ${
            fasting.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-400 active:scale-95'
          }`}
        >
          {fasting.completed ? <FiCheck className="w-4 h-4 shrink-0" /> : <IoRestaurantOutline className="w-4 h-4 shrink-0" />}
          <span>{t.fasted}</span>
        </button>

        {/* Suhoor */}
        <button
          onClick={() => updateFasting({ preDawnMeal: !fasting.preDawnMeal })}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-medium text-sm ${
            fasting.preDawnMeal
              ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-400 active:scale-95'
          }`}
        >
          <FiMoon className="w-4 h-4 shrink-0" />
          <span>{t.hadSuhoor}</span>
        </button>
      </div>

      {/* Notes toggle */}
      <button
        onClick={() => setShowNotes(!showNotes)}
        className="flex items-center gap-1.5 mt-3 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <FiEdit3 className="w-3 h-3" />
        {t.fastingNotes}
        <FiFileText className="w-3 h-3 ml-auto" />
      </button>

      {showNotes && (
        <textarea
          value={fasting.notes}
          onChange={e => updateFasting({ notes: e.target.value })}
          placeholder={t.fastingNotesPlaceholder}
          rows={2}
          className="mt-2 w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
        />
      )}
    </div>
  );
}
