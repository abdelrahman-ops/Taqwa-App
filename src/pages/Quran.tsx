import React, { useState } from 'react';
import { FiBookOpen, FiTarget, FiCalendar, FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { getQuranSchedule, RAMADAN_DAYS, toLocalizedNum } from '../types';

export default function Quran() {
  const { quranGoal, setQuranGoal, allLogs, t, locale } = useApp();
  const [showSchedule, setShowSchedule] = useState(false);

  const totalRead = Object.values(allLogs).reduce((s, l) => s + (l.quran?.pagesRead || 0), 0);
  const completions = Math.floor(totalRead / 604);
  const schedule = getQuranSchedule(quranGoal.targetCompletions);

  const overallPct = Math.min((totalRead / (604 * quranGoal.targetCompletions)) * 100, 100);

  return (
    <div className="fade-in">
      {/* Spiritual header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-950 rounded-2xl p-5 mb-4 shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/30">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-14 h-14 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-2 left-3 text-white/10"><FiStar className="w-6 h-6" /></div>
        <div className="relative flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <FiBookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{t.quranTracker}</h1>
              <p className="text-xs text-emerald-200/70">{t.quranGoal}</p>
            </div>
          </div>
        </div>
        <div className="relative flex gap-3">
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(totalRead, locale)}</div>
            <div className="text-[9px] text-emerald-200/70 font-medium">{locale === 'ar' ? 'صفحات' : 'Pages'}</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(completions, locale)}</div>
            <div className="text-[9px] text-emerald-200/70 font-medium">{locale === 'ar' ? 'ختمات' : 'Khatma'}</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(Math.round(overallPct), locale)}%</div>
            <div className="text-[9px] text-emerald-200/70 font-medium">{locale === 'ar' ? 'الهدف' : 'Goal'}</div>
          </div>
        </div>
      </div>

      {/* Goal card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FiTarget className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t.quranGoalQuestion}</span>
        </div>
        <div className="flex flex-col gap-3">
          {/* Quick presets */}
          <div className="flex gap-2">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setQuranGoal(n)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  quranGoal.targetCompletions === n
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400'
                }`}
              >
                {n}x
              </button>
            ))}
          </div>
          {/* Custom input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 flex-1">
              {locale === 'ar' ? 'أو أدخل عدداً مخصصاً:' : 'Or custom:'}
            </span>
            <button
              onClick={() => setQuranGoal(Math.max(1, quranGoal.targetCompletions - 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >−</button>
            <input
              type="number"
              min={1}
              value={quranGoal.targetCompletions}
              onChange={e => {
                const v = parseInt(e.target.value) || 1;
                if (v >= 1) setQuranGoal(v);
              }}
              className="w-16 text-center font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-1.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => setQuranGoal(quranGoal.targetCompletions + 1)}
              className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
            >+</button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2">
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">{toLocalizedNum(quranGoal.targetCompletions, locale)}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400">{t.khatma}</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2">
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">{toLocalizedNum(quranGoal.dailyPages, locale)}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400">{t.dailyPages}</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2">
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">{toLocalizedNum(completions, locale)}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400">{t.completions}</div>
          </div>
        </div>
      </div>

      {/* Total pages read */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t.totalPagesRead}</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{toLocalizedNum(totalRead, locale)}</span>
        </div>
        <div className="mt-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${Math.min((totalRead / (604 * quranGoal.targetCompletions)) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Reading schedule */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{t.readingPlan}</span>
          </div>
          {showSchedule ? <FiChevronUp className="w-4 h-4 text-gray-400" /> : <FiChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showSchedule && (
          <div className="px-4 pb-4 max-h-64 overflow-y-auto space-y-1">
            {schedule.map(day => (
              <div key={day.day} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <span className="font-medium text-gray-600 dark:text-gray-400 w-14">
                  {locale === 'ar' ? `يوم ${toLocalizedNum(day.day, locale)}` : `Day ${toLocalizedNum(day.day, locale)}`}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {locale === 'ar' ? `${toLocalizedNum(day.fromPage, locale)} - ${toLocalizedNum(day.toPage, locale)}` : `pp. ${toLocalizedNum(day.fromPage, locale)}–${toLocalizedNum(day.toPage, locale)}`}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{toLocalizedNum(day.dailyPages, locale)}p</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
