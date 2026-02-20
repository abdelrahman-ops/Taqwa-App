import React from 'react';
import { FiBookOpen, FiTarget, FiChevronRight, FiCheck, FiChevronLeft } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { toLocalizedNum } from '../types';

export default function QuranCard() {
  const { dailyLog, updateQuran, t, locale } = useApp();

  if (!dailyLog) return null;
  const { quran } = dailyLog;

  const progress = quran.targetPages > 0 ? Math.min((quran.pagesRead / quran.targetPages) * 100, 100) : 0;

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value) || 0;
    const clamped = Math.min(Math.max(val, 0), 604);
    updateQuran({ pagesRead: clamped, completed: clamped >= quran.targetPages });
  }

  function adjustPages(delta: number) {
    const next = Math.min(604, Math.max(0, quran.pagesRead + delta));
    updateQuran({ pagesRead: next, completed: next >= quran.targetPages });
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <FiBookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">{t.quranTracker}</h2>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <FiTarget className="w-3 h-3" />
          <span>{toLocalizedNum(quran.targetPages, locale)} {t.pages}</span>
        </div>
      </div>

      {/* Range info */}
      {quran.fromPage > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
          <span>{locale === 'ar' ? 'من صفحة' : 'From'} <strong>{quran.fromPage}</strong></span>
          {
            locale === 'ar' ? <FiChevronLeft className="w-3 h-3" /> : <FiChevronRight className="w-3 h-3" />
          }
          <span>{locale === 'ar' ? 'إلى صفحة' : 'to'} <strong>{quran.toPage}</strong></span>
        </div>
      )}

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Counter with -5 -1 input +1 +5 */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => adjustPages(-5)}
          className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-xs font-bold"
        >−5</button>
        <button
          onClick={() => adjustPages(-1)}
          className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold"
        >−</button>
        <input
          type="number"
          min={0}
          max={604}
          value={quran.pagesRead}
          onChange={handleInput}
          className="w-16 text-center text-sm font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-1.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => adjustPages(1)}
          className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors font-bold"
        >+</button>
        <button
          onClick={() => adjustPages(5)}
          className="w-9 h-9 rounded-lg bg-emerald-200 dark:bg-emerald-800/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-800/60 transition-colors text-xs font-bold"
        >+5</button>
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
        {t.pagesRead}: {toLocalizedNum(quran.pagesRead, locale)} / {toLocalizedNum(quran.targetPages, locale)}
      </p>

      {quran.completed && (
        <div className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl py-2.5 text-sm font-semibold bounce-in border border-emerald-200/50 dark:border-emerald-800/30">
          <FiBookOpen className="w-4 h-4" />
          {t.completed}
          <FiCheck className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
