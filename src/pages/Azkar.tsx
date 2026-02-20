import React, { useState, useCallback } from 'react';
import { FiSun, FiMoon, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { MORNING_AZKAR, EVENING_AZKAR } from '../types';
import { useApp } from '../context/AppContext';

type Tab = 'morning' | 'evening';

interface DhikrState {
  current: number;
  done: boolean;
}

function initCounters(azkar: typeof MORNING_AZKAR): Record<number, DhikrState> {
  return Object.fromEntries(azkar.map(a => [a.id, { current: 0, done: false }]));
}

export default function Azkar() {
  const { locale, updateAzkar, dailyLog } = useApp();
  const [tab, setTab] = useState<Tab>('morning');
  const [morningCounts, setMorningCounts] = useState<Record<number, DhikrState>>(() => initCounters(MORNING_AZKAR));
  const [eveningCounts, setEveningCounts] = useState<Record<number, DhikrState>>(() => initCounters(EVENING_AZKAR));

  const activeAzkar = tab === 'morning' ? MORNING_AZKAR : EVENING_AZKAR;
  const activeCounts = tab === 'morning' ? morningCounts : eveningCounts;
  const setActiveCounts = tab === 'morning' ? setMorningCounts : setEveningCounts;

  const doneCount = Object.values(activeCounts).filter(s => s.done).length;
  const totalCount = activeAzkar.length;
  const allDone = doneCount === totalCount;

  function tap(id: number, target: number) {
    setActiveCounts(prev => {
      const cur = prev[id]?.current ?? 0;
      const next = cur + 1;
      const done = next >= target;
      if (done && !prev[id]?.done) {
        // Mark whole session done if all are done
      }
      return { ...prev, [id]: { current: Math.min(next, target), done } };
    });
  }

  function resetOne(id: number) {
    setActiveCounts(prev => ({ ...prev, [id]: { current: 0, done: false } }));
  }

  function resetAll() {
    setActiveCounts(initCounters(activeAzkar));
  }

  // When all done, mark azkar in daily log
  React.useEffect(() => {
    if (allDone && dailyLog) {
      updateAzkar(tab, true);
    }
  }, [allDone, tab]);

  // Tab progress pct
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-black text-gray-800 dark:text-gray-100">
          {locale === 'ar' ? 'الأذكار اليومية' : 'Daily Azkar'}
        </h1>
        <button
          onClick={resetAll}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <FiRefreshCw className="w-3.5 h-3.5" />
          {locale === 'ar' ? 'إعادة' : 'Reset'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('morning')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${tab === 'morning' ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-400'}`}
        >
          <FiSun className="w-4 h-4" />
          {locale === 'ar' ? 'أذكار الصباح' : 'Morning'}
        </button>
        <button
          onClick={() => setTab('evening')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${tab === 'evening' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400'}`}
        >
          <FiMoon className="w-4 h-4" />
          {locale === 'ar' ? 'أذكار المساء' : 'Evening'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
          <span>{doneCount}/{totalCount} {locale === 'ar' ? 'مكتملة' : 'completed'}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${tab === 'morning' ? 'bg-orange-500' : 'bg-indigo-600'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* All done banner */}
      {allDone && (
        <div className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl p-3 mb-4 text-sm font-medium">
          <FiCheckCircle className="w-5 h-5" />
          {locale === 'ar' ? 'أحسنت! أكملت جميع الأذكار' : 'MashaAllah! All azkar complete!'}
        </div>
      )}

      {/* Dhikr cards */}
      <div className="space-y-3">
        {activeAzkar.map(dhikr => {
          const state = activeCounts[dhikr.id] ?? { current: 0, done: false };
          const progressPct = Math.min((state.current / dhikr.count) * 100, 100);

          return (
            <div
              key={dhikr.id}
              className={`bg-white dark:bg-gray-900 rounded-2xl border-2 shadow-sm transition-all ${state.done ? 'border-emerald-200 dark:border-emerald-800 opacity-80' : 'border-gray-100 dark:border-gray-800'}`}
            >
              {/* Arabic text */}
              <div className="p-4 pb-2">
                <p className="arabic-text text-right text-lg leading-loose text-gray-800 dark:text-gray-100">
                  {dhikr.text}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
                  {dhikr.translation}
                </p>
              </div>

              {/* Counter progress */}
              {dhikr.count > 1 && (
                <div className="px-4 pb-2">
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${tab === 'morning' ? 'bg-orange-400' : 'bg-indigo-500'}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tap button + counter */}
              <div className="flex items-center gap-3 px-4 pb-4 pt-1">
                <button
                  onClick={() => tap(dhikr.id, dhikr.count)}
                  disabled={state.done}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    state.done
                      ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default'
                      : tab === 'morning'
                      ? 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
                  }`}
                >
                  {state.done ? (
                    <span className="flex items-center justify-center gap-1">
                      <FiCheckCircle className="w-4 h-4" />
                      {locale === 'ar' ? 'تم' : 'Done'}
                    </span>
                  ) : (
                    <span>
                      {state.current}/{dhikr.count}
                      {' '}
                      <span className="opacity-75 text-xs">{locale === 'ar' ? '(اضغط)' : 'tap'}</span>
                    </span>
                  )}
                </button>
                <button
                  onClick={() => resetOne(dhikr.id)}
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Reset this dhikr"
                >
                  <FiRefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-4" />
    </div>
  );
}
