import React from 'react';
import { FiSun, FiMoon, FiCheck, FiList } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AzkarCard() {
  const { dailyLog, updateAzkar, t, locale } = useApp();

  if (!dailyLog) return null;
  const { azkar } = dailyLog;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <FiSun className="w-4 h-4 text-orange-500 dark:text-orange-400" />
          </div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">{t.azkar}</h2>
        </div>
        <Link
          to="/azkar"
          className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <FiList className="w-3 h-3" />
          {locale === 'ar' ? 'القائمة الكاملة' : 'Full list'}
        </Link>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => updateAzkar('morning', !azkar.morning)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-medium text-sm active:scale-95 ${
            azkar.morning
              ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-400'
          }`}
        >
          {azkar.morning ? <FiCheck className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
          {t.morningAzkar}
        </button>

        <button
          onClick={() => updateAzkar('evening', !azkar.evening)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-medium text-sm active:scale-95 ${
            azkar.evening
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400'
          }`}
        >
          {azkar.evening ? <FiCheck className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          {t.eveningAzkar}
        </button>
      </div>

      {azkar.morning && azkar.evening && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bounce-in">
          <FiCheck className="w-3.5 h-3.5" />
          {locale === 'ar' ? 'أحسنت! أكملت أذكارك' : 'Amazing! All azkar complete'}
        </div>
      )}
    </div>
  );
}
