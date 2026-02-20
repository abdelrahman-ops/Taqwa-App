import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBookOpen, FiSun, FiBarChart2, FiSettings } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { calculateDayProgress } from '../types';

const NAV_ITEMS = [
  { to: '/', key: 'home' as const, Icon: FiHome, ar: 'الرئيسية' },
  { to: '/quran', key: 'quran' as const, Icon: FiBookOpen, ar: 'القرآن' },
  { to: '/prayers', key: 'prayers' as const, Icon: FiSun, ar: 'الصلاة' },
  { to: '/progress', key: 'progress' as const, Icon: FiBarChart2, ar: 'التقدم' },
  { to: '/settings', key: 'settings' as const, Icon: FiSettings, ar: 'الإعدادات' },
];

export default function BottomNav() {
  const { t, locale, dailyLog } = useApp();

  const progress = dailyLog ? calculateDayProgress(dailyLog) : 0;
  const hasIncomplete = progress < 100 && progress > 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#111B11]/95 backdrop-blur-md border-t border-gray-200/60 dark:border-emerald-900/30 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-[480px] mx-auto px-2">
        {NAV_ITEMS.map(({ to, key, Icon, ar }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-0 transition-all duration-200 ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/40' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-105' : ''}`} />
                  {key === 'home' && hasIncomplete && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-[#111B11]" />
                  )}
                </div>
                <span className="text-[10px] font-semibold truncate leading-tight">
                  {locale === 'ar' ? ar : t[key]}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
