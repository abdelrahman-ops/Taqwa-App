import React from 'react';
import {
  FiBarChart2, FiCalendar, FiBookOpen, FiSun, FiHeart,
} from 'react-icons/fi';
import { IoRestaurantOutline } from 'react-icons/io5';
import { useApp } from '../context/AppContext';
import { RAMADAN_DAYS, calculateDayProgress, toLocalizedNum } from '../types';

function DayCell({ score, day, locale }: { score: number; day: number; locale: string }) {
  const bg =
    score >= 90 ? 'bg-emerald-500' :
    score >= 70 ? 'bg-emerald-400' :
    score >= 40 ? 'bg-amber-400' :
    score > 0  ? 'bg-gray-300 dark:bg-gray-600' :
                 'bg-gray-100 dark:bg-gray-800';

  return (
    <div
      title={`Day ${day}`}
      className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center text-[9px] font-bold ${score > 0 ? 'text-white' : 'text-gray-400 dark:text-gray-600'}`}
    >
      {toLocalizedNum(day, locale)}
    </div>
  );
}

/* Static color maps so Tailwind doesn't purge them */
const STAT_STYLES = {
  amber:   { iconBg: 'bg-amber-100 dark:bg-amber-900/30',   iconText: 'text-amber-600 dark:text-amber-400' },
  blue:    { iconBg: 'bg-blue-100 dark:bg-blue-900/30',     iconText: 'text-blue-600 dark:text-blue-400' },
  emerald: { iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconText: 'text-emerald-600 dark:text-emerald-400' },
  purple:  { iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconText: 'text-purple-600 dark:text-purple-400' },
  orange:  { iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconText: 'text-orange-600 dark:text-orange-400' },
  pink:    { iconBg: 'bg-pink-100 dark:bg-pink-900/30',     iconText: 'text-pink-600 dark:text-pink-400' },
} as const;

export default function Progress() {
  const { allLogs, currentStreak, longestStreak, t, locale } = useApp();

  const logs = Object.values(allLogs);
  const fastingDays = logs.filter(l => l.fasting?.completed).length;
  const totalPrayers = logs.reduce((s, l) => s + Object.values(l.prayers || {}).filter(Boolean).length, 0);
  const totalQuranPages = logs.reduce((s, l) => s + (l.quran?.pagesRead || 0), 0);
  const morningAzkar = logs.filter(l => l.azkar?.morning).length;
  const eveningAzkar = logs.filter(l => l.azkar?.evening).length;
  const totalExtras = logs.reduce((s, l) => s + (l.extras?.filter(e => e.completed).length || 0), 0);
  const perfectDays = logs.filter(l => calculateDayProgress(l) >= 90).length;

  const STATS = [
    { label: t.daysFasted, value: fastingDays, Icon: IoRestaurantOutline, color: 'amber' as const },
    { label: t.prayersPrayed, value: totalPrayers, Icon: FiSun, color: 'blue' as const },
    { label: t.totalPagesRead, value: totalQuranPages, Icon: FiBookOpen, color: 'emerald' as const },
    { label: t.perfectDays, value: perfectDays, Icon: FiBarChart2, color: 'purple' as const },
    { label: t.morningAzkar, value: morningAzkar, Icon: FiSun, color: 'orange' as const },
    { label: t.goodDeeds, value: totalExtras, Icon: FiHeart, color: 'pink' as const },
  ];

  const overallAvg = logs.length > 0
    ? Math.round(logs.reduce((s, l) => s + calculateDayProgress(l), 0) / logs.length)
    : 0;

  const trendData = Array.from({ length: 7 }, (_, index) => {
    const day = RAMADAN_DAYS - (6 - index);
    const log = Object.values(allLogs).find(l => l.dayNumber === day);
    return {
      day,
      score: log ? calculateDayProgress(log) : 0,
    };
  });

  const categoryCompletion = [
    {
      label: t.fasting,
      value: Math.round((fastingDays / RAMADAN_DAYS) * 100),
      color: 'bg-amber-500',
    },
    {
      label: t.prayersTitle,
      value: Math.round((totalPrayers / (RAMADAN_DAYS * 6)) * 100),
      color: 'bg-blue-500',
    },
    {
      label: t.quran,
      value: Math.min(100, Math.round((totalQuranPages / 604) * 100)),
      color: 'bg-emerald-500',
    },
    {
      label: t.azkar,
      value: Math.round(((morningAzkar + eveningAzkar) / (RAMADAN_DAYS * 2)) * 100),
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="fade-in">
      {/* Spiritual header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 dark:from-purple-800 dark:via-purple-900 dark:to-indigo-950 rounded-2xl p-5 mb-4 shadow-lg shadow-purple-900/10 dark:shadow-purple-900/30">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-14 h-14 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <FiBarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{t.yourProgress}</h1>
            <p className="text-xs text-purple-200/70">{t.seeProgress}</p>
          </div>
        </div>
        <div className="relative flex gap-3">
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(overallAvg, locale)}%</div>
            <div className="text-[9px] text-purple-200/70 font-medium">{locale === 'ar' ? 'المعدل' : 'Average'}</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(currentStreak, locale)}</div>
            <div className="text-[9px] text-purple-200/70 font-medium">{locale === 'ar' ? 'السلسلة' : 'Streak'}</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{toLocalizedNum(longestStreak, locale)}</div>
            <div className="text-[9px] text-purple-200/70 font-medium">{locale === 'ar' ? 'الأطول' : 'Best'}</div>
          </div>
        </div>
      </div>

      {/* Stats grid — static classes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {STATS.map(({ label, value, Icon, color }) => {
          const style = STAT_STYLES[color];
          return (
            <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{label}</div>
                  <div className="text-3xl leading-none font-black text-gray-800 dark:text-gray-100 mt-1">{toLocalizedNum(value, locale)}</div>
                </div>
                <div className={`w-8 h-8 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${style.iconText}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend graph */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {locale === 'ar' ? 'اتجاه آخر ٧ أيام' : 'Last 7 Days Trend'}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{toLocalizedNum(overallAvg, locale)}%</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 items-end h-24">
          {trendData.map(item => (
            <div key={item.day} className="flex flex-col items-center justify-end gap-1 h-full">
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-md h-full flex items-end overflow-hidden">
                <div
                  className="w-full bg-purple-500/90 rounded-md"
                  style={{ height: `${Math.max(item.score, 4)}%` }}
                />
              </div>
              <span className="text-[9px] text-gray-400 dark:text-gray-500">{toLocalizedNum(item.day, locale)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category graph */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
          {locale === 'ar' ? 'نسبة الإنجاز حسب الفئة' : 'Completion by Category'}
        </div>
        <div className="space-y-2.5">
          {categoryCompletion.map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{toLocalizedNum(item.value, locale)}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${Math.max(0, Math.min(100, item.value))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar heatmap */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <FiCalendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t.ramadanCalendar}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: RAMADAN_DAYS }, (_, i) => i + 1).map(day => {
            const log = Object.values(allLogs).find(l => l.dayNumber === day);
            const score = log ? calculateDayProgress(log) : 0;
            return <DayCell key={day} day={day} score={score} locale={locale} />;
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-3 mt-3">
          {[
            { label: locale === 'ar' ? 'ممتاز' : t.excellent, cn: 'bg-emerald-500' },
            { label: locale === 'ar' ? 'جيد' : t.good, cn: 'bg-emerald-400' },
            { label: locale === 'ar' ? 'متوسط' : t.fair, cn: 'bg-amber-400' },
            { label: locale === 'ar' ? 'أقل' : t.low, cn: 'bg-gray-300 dark:bg-gray-600' },
          ].map(({ label, cn }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-sm ${cn}`} />
              <span className="text-[10px] text-gray-400 dark:text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
