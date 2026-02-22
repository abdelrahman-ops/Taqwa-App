import React, { useMemo, useState, useEffect } from "react";
import {
  FiCalendar,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiHeart,
  FiZap,
  FiCheck,
  FiBookOpen,
  FiSun,
} from "react-icons/fi";
import { IoRestaurantOutline } from "react-icons/io5";
import { useApp } from "../context/AppContext";
import { calculateDayProgress, toLocalizedNum, RAMADAN_DAYS, getHijriDate } from '../types';
import { getDailyQuote } from "../data/dailyQuotes";
import { getVoluntaryFast, setVoluntaryFast } from "../services/storage";
import ProgressRing from "../components/ProgressRing";
import DaySelector from "../components/DaySelector";
import FastingCard from "../components/FastingCard";
import PrayerCard from "../components/PrayerCard";
import QuranCard from "../components/QuranCard";
import AzkarCard from "../components/AzkarCard";
import ExtrasCard from "../components/ExtrasCard";

function getMotivation(score: number, locale: string) {
  if (locale === "ar") {
    if (score >= 90) return { text: "ما شاء الله! يوم مثالي", icon: FiAward };
    if (score >= 70) return { text: "أحسنت! استمر بهذا الأداء", icon: FiTrendingUp };
    if (score >= 40) return { text: "بداية طيبة، واصل المسيرة", icon: FiHeart };
    return { text: "ابدأ يومك بالبركة", icon: FiZap };
  }
  if (score >= 90) return { text: "Masha’Allah! A perfect day", icon: FiAward };
  if (score >= 70) return { text: "Great progress! Keep it up", icon: FiTrendingUp };
  if (score >= 40) return { text: "Good start, keep going", icon: FiHeart };
  return { text: "Start your blessed day", icon: FiZap };
}

function getTimeGreeting(locale: string): string {
  const hour = new Date().getHours();
  if (locale === "ar") {
    if (hour < 5)  return "قيام الليل نور";
    if (hour < 12) return "صباح الخير";
    if (hour < 17) return "مساء النور";
    return "مساء الخير";
  }
  if (hour < 5)  return "Blessed night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const {
    currentDayNumber,
    dailyLog,
    userProfile,
    currentStreak,
    longestStreak,
    t,
    locale,
    isPostRamadan,
    todayStr,
  } = useApp();

  const [voluntaryFast, setVoluntaryFastState] = useState(() => getVoluntaryFast(todayStr));

  function toggleVoluntaryFast() {
    const next = !voluntaryFast;
    setVoluntaryFastState(next);
    setVoluntaryFast(todayStr, next);
  }

  const progress = dailyLog ? calculateDayProgress(dailyLog) : 0;
  const motivation = getMotivation(progress, locale);
  const timeGreeting = getTimeGreeting(locale);
  const quote = useMemo(
    () => getDailyQuote(currentDayNumber),
    [currentDayNumber],
  );

  const [showCelebration, setShowCelebration] = useState(false);
  const prevProgressRef = React.useRef(progress);
  useEffect(() => {
    if (progress >= 100 && prevProgressRef.current < 100) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
    prevProgressRef.current = progress;
  }, [progress]);

  const fasted       = dailyLog?.fasting?.completed ?? false;
  const prayerCount  = dailyLog ? Object.values(dailyLog.prayers).filter(Boolean).length : 0;
  const totalPrayers = dailyLog ? Object.keys(dailyLog.prayers).length : 6;
  const quranDone    = dailyLog?.quran?.completed ?? false;
  const azkarMorning = dailyLog?.azkar?.morning ?? false;
  const azkarEvening = dailyLog?.azkar?.evening ?? false;

  const greeting = locale === "ar"
    ? userProfile?.name
      ? `أهلاً، ${userProfile.name}`
      : timeGreeting
    : userProfile?.name
      ? `Welcome, ${userProfile.name}`
      : timeGreeting;

  const daysRemaining = Math.max(0, 30 - currentDayNumber);
  void t;

  return (
    <div className="fade-in relative">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="celebrate-overlay text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3 celebrate">
              <FiAward className="w-8 h-8 text-white" />
            </div>
            <div className="bg-emerald-600/95 text-white text-lg font-bold px-6 py-3 rounded-2xl shadow-xl bounce-in">
              {locale === "ar"
                ? "ما شاء الله! يوم مثالي"
                : "Masha’Allah! Perfect Day!"}
            </div>
          </div>
        </div>
      )}

      {/* Bismillah */}
      <p className="bismillah text-emerald-800/80 dark:text-emerald-300/80 text-center mb-4 mt-1">
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </p>

      {/* Post-Ramadan banner */}
      {isPostRamadan && (
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 dark:from-amber-700 dark:via-orange-700 dark:to-red-700 rounded-2xl p-4 mb-4 shadow-lg">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-14 h-14 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <FiAward className="w-5 h-5 text-white" />
              <h2 className="text-base font-bold text-white">
                {locale === 'ar' ? 'عيد مبارك! أتممت رمضان كاملاً' : 'Eid Mubarak! Ramadan Complete'}
              </h2>
            </div>
            <p className="text-white/80 text-xs mb-3 leading-relaxed">
              {locale === 'ar'
                ? 'تقبل الله منك وأسأل الله أن يتقبل طاعتك في هذا الشهر الكريم. يمكنك الآن مراجعة أيام رمضان أدناه ، أو تسجيل صيام تطوعي اليوم من شوال.'
                : 'May Allah accept your worship this blessed month. Browse your Ramadan history below, or log a voluntary fast today.'}
            </p>
            {/* Voluntary fast toggle */}
            <button
              onClick={toggleVoluntaryFast}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                voluntaryFast
                  ? 'bg-white text-orange-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {voluntaryFast
                ? <FiCheck className="w-4 h-4" />
                : <IoRestaurantOutline className="w-4 h-4" />}
              {locale === 'ar'
                ? (voluntaryFast ? 'صائم اليوم من شوال' : 'صم اليوم تطوعاً (شوال)')
                : (voluntaryFast ? 'Fasting today (Shawwal)' : 'Fast today? (Shawwal sunnah)')}
            </button>
          </div>
        </div>
      )}

      {/* Header: greeting + day badge + streak flame */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 leading-tight truncate">
            {greeting}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {locale === "ar"
              ? "اجعل كل يوم أفضل من سابقه"
              : "Make every day better than the last"}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-3 shrink-0">

          {/* Streak flame badge — always visible, global streak based on today */}
          <div
  className={`relative flex items-center justify-center transition-all duration-500 ${
    currentStreak === 0 ? 'opacity-40 grayscale' : ''
  }`}
  style={{ width: 44, height: 56 }}
>
  <svg
    viewBox="0 0 44 56"
    width="44"
    height="56"
    aria-hidden="true"
    className="absolute inset-0"
    style={{ filter: 'drop-shadow(0 8px 16px rgba(249, 115, 22, 0.3))' }}
  >
    <defs>
      {/* Premium metallic gradient with realistic fire colors */}
      <linearGradient id="flameGradient" x1="22" y1="4" x2="22" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF">
          <animate attributeName="stopColor" values="#FFFFFF;#FFFBEB;#FFFFFF" dur="4s" repeatCount="indefinite" />
        </stop>
        <stop offset="20%" stopColor="#FDE68A">
          <animate attributeName="stopColor" values="#FDE68A;#FCD34D;#FDE68A" dur="4s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" stopColor="#F97316">
          <animate attributeName="stopColor" values="#F97316;#FB923C;#F97316" dur="4s" repeatCount="indefinite" />
        </stop>
        <stop offset="80%" stopColor="#DC2626">
          <animate attributeName="stopColor" values="#DC2626;#B91C1C;#DC2626" dur="4s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>

      {/* Dynamic glow effect */}
      <radialGradient id="flameGlow" cx="22" cy="40" r="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F97316" stopOpacity="0.6">
          <animate attributeName="stopOpacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" stopColor="#F97316" stopOpacity="0.2">
          <animate attributeName="stopOpacity" values="0.2;0.3;0.2" dur="2s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
      </radialGradient>

      {/* Inner core highlight */}
      <radialGradient id="coreHighlight" cx="22" cy="30" r="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="40%" stopColor="#FDE68A" stopOpacity="0.7" />
        <stop offset="80%" stopColor="#F97316" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
      </radialGradient>

      {/* Texture noise filter */}
      <filter id="noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence baseFrequency="0.65" numOctaves="1" stitchTiles="stitch" result="noise">
          <animate attributeName="baseFrequency" values="0.65;0.7;0.65" dur="5s" repeatCount="indefinite" />
        </feTurbulence>
        <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.08 0" result="noiseTransparent"/>
        <feComposite in="SourceGraphic" in2="noiseTransparent" operator="over" />
      </filter>
    </defs>

    {/* Base glow */}
    <ellipse cx="22" cy="50" rx="16" ry="6" fill="url(#flameGlow)">
      <animate
        attributeName="rx"
        values="16;17;16"
        dur="2.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="ry"
        values="6;7;6"
        dur="2.5s"
        repeatCount="indefinite"
      />
    </ellipse>

    {/* Main flame body with texture */}
    <g filter="url(#noise)">
      <path
        d="M22 4
           C15 10 6 20 6 30
           C6 38 12 46 22 48
           C32 46 38 38 38 30
           C38 20 29 10 22 4Z"
        fill="url(#flameGradient)"
      >
        <animate
          attributeName="d"
          values="
            M22 4 C15 10 6 20 6 30 C6 38 12 46 22 48 C32 46 38 38 38 30 C38 20 29 10 22 4Z;
            M22 3 C14 10 5 20 5 30 C5 39 11 47 22 49 C33 47 39 39 39 30 C39 20 30 10 22 3Z;
            M22 4 C15 10 6 20 6 30 C6 38 12 46 22 48 C32 46 38 38 38 30 C38 20 29 10 22 4Z"
          dur="3.5s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
        />
      </path>
    </g>

    {/* Inner flame core */}
    <path
      d="M22 18
         C18 24 14 30 14 35
         C14 39 17 43 22 44
         C27 43 30 39 30 35
         C30 30 26 24 22 18Z"
      fill="url(#coreHighlight)"
    >
      <animate
        attributeName="d"
        values="
          M22 18 C18 24 14 30 14 35 C14 39 17 43 22 44 C27 43 30 39 30 35 C30 30 26 24 22 18Z;
          M22 16 C17 24 13 30 13 35 C13 40 16 44 22 45 C28 44 31 40 31 35 C31 30 27 24 22 16Z;
          M22 18 C18 24 14 30 14 35 C14 39 17 43 22 44 C27 43 30 39 30 35 C30 30 26 24 22 18Z"
        dur="2.8s"
        repeatCount="indefinite"
      />
    </path>

    {/* Rising embers */}
    <g opacity="0.5">
      {[1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={15 + i * 6}
          cy={38 - i * 8}
          r={1.2 - i * 0.2}
          fill="#FCD34D"
        >
          <animate
            attributeName="cy"
            values={`${38 - i * 8};${28 - i * 8};${38 - i * 8}`}
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.9;0.5"
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values={`${1.2 - i * 0.2};${1.6 - i * 0.2};${1.2 - i * 0.2}`}
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>

    {/* Heat shimmer effect */}
    <path
      d="M12 36 Q22 40 32 36"
      stroke="#FDE68A"
      strokeWidth="2"
      fill="none"
      opacity="0.15"
    >
      <animate
        attributeName="d"
        values="
          M12 36 Q22 40 32 36;
          M12 34 Q22 42 32 34;
          M12 36 Q22 40 32 36"
        dur="2.2s"
        repeatCount="indefinite"
      />
    </path>

    {/* Secondary shimmer */}
    <path
      d="M16 40 Q22 43 28 40"
      stroke="#F97316"
      strokeWidth="1.5"
      fill="none"
      opacity="0.1"
    >
      <animate
        attributeName="d"
        values="
          M16 40 Q22 43 28 40;
          M16 38 Q22 44 28 38;
          M16 40 Q22 43 28 40"
        dur="1.8s"
        repeatCount="indefinite"
      />
    </path>
  </svg>

  <span
    className="relative z-10 text-white font-black text-sm leading-none select-none"
    style={{ 
      marginTop: 18,
      textShadow: `
        0 2px 4px rgba(0,0,0,0.4),
        0 0 20px rgba(249,115,22,0.6),
        0 0 40px rgba(249,115,22,0.3)
      `,
      fontWeight: 900,
      letterSpacing: '0.5px',
    }}
  >
    {toLocalizedNum(currentStreak, locale)}
  </span>

</div>

          {/* Day badge */}
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
            <FiCalendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {(() => {
                const hijri = getHijriDate(currentDayNumber);
                return locale === 'ar'
                  ? `${hijri.monthNameAr} ${toLocalizedNum(hijri.dayInMonth, locale)}`
                  : `${hijri.monthNameEn} ${hijri.dayInMonth}`;
              })()}
            </span>
          </div>

        </div>
      </div>

      {/* Daily Quote Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-950 rounded-2xl p-4 mb-4 shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/30">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Praying child illustration — recolored to app emerald/teal */}
        <div className={`absolute bottom-0 ${locale === 'ar' ? 'left-1' : 'right-1'} opacity-[0.4] pointer-events-none`}>
          <svg width="150" height="100" viewBox="99 0 290 235" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0 C95.7 0 191.4 0 290 0 C290 77.55 290 155.1 290 235 C194.3 235 98.6 235 0 235 C0 157.45 0 79.9 0 0 Z" fill="transparent" transform="translate(99,0)"/>
            <path d="M0 0 C4.02 0.63 7.21 1.95 10.88 3.69 C17.32 6.59 23.92 8.52 30.75 10.31 C32.19 10.69 32.19 10.69 33.65 11.08 C39.75 12.63 45.72 13.56 52 14 C51.73 21.18 49.3 26.25 45 32 C44.01 32.66 43.02 33.32 42 34 C41.67 34.99 41.34 35.98 41 37 C41.6 37.19 42.2 37.37 42.81 37.56 C46.02 39.67 46.57 42.49 48 46 C48.62 46.74 49.24 47.49 49.88 48.25 C53.11 52.44 54.98 57.13 57 62 C57.3 62.72 57.6 63.44 57.91 64.19 C62.86 77.39 64.42 94.48 59.73 107.87 C58.82 110.54 58.37 113.21 58 116 C58.99 116.68 58.99 116.68 60 117.38 C60.66 117.91 61.32 118.45 62 119 C62 119.66 62 120.32 62 121 C62.95 120.97 63.89 120.95 64.87 120.92 C68.43 120.83 71.99 120.77 75.55 120.73 C77.08 120.7 78.61 120.67 80.15 120.62 C97.82 120.13 97.82 120.13 105 126 C105.33 126.99 105.66 127.98 106 129 C45.94 129 -14.12 129 -76 129 C-76 128.34 -76 127.68 -76 127 C-65.66 120.13 -56.28 120.1 -44.25 120.13 C-42.47 120.11 -40.7 120.09 -38.92 120.06 C-34.61 120.01 -30.31 120 -26 120 C-25.93 116.31 -25.93 116.31 -26.21 113.89 C-26.55 109.31 -26.24 106.65 -23.25 103.06 C-21.06 100.72 -18.98 99.21 -16 98 C-15.01 98 -14.02 98 -13 98 C-13.8 97.28 -14.61 96.56 -15.44 95.81 C-18.02 92.97 -18.68 91.73 -19 88 C-17.68 88 -16.36 88 -15 88 C-15 87.01 -15 86.02 -15 85 C-14.24 85.02 -13.48 85.05 -12.7 85.07 C-11.71 85.09 -10.71 85.11 -9.69 85.13 C-8.7 85.15 -7.72 85.17 -6.7 85.2 C-3.78 85.21 -3.78 85.21 -1 83 C1.02 82.83 3.04 82.73 5.06 82.69 C12.6 82.21 18.84 80.32 24.14 74.75 C26.25 71.62 27.22 68.82 28.25 65.19 C28.59 64.03 28.92 62.86 29.27 61.67 C29.51 60.79 29.75 59.91 30 59 C29.34 59 28.68 59 28 59 C27.9 59.72 27.8 60.45 27.7 61.2 C26.79 67.12 25.88 71.37 22 76 C21.67 76 21.34 76 21 76 C21.48 71.1 22.33 66.47 23.5 61.69 C24.91 55.8 25.65 50.04 26 44 C24.71 44.1 24.71 44.1 23.4 44.21 C12.89 44.71 12.89 44.71 8.94 41.63 C4.21 36.66 2.37 30.15 1.13 23.56 C0.36 19.76 0.36 19.76 -3 18.19 C-3.99 17.8 -4.98 17.4 -6 17 C-8.16 13.76 -8.64 12.76 -8 9 C-5.69 7 -5.69 7 -3 5 C-1.21 2.38 -1.21 2.38 0 0 Z" fill="#6ee7b7" transform="translate(225,78)"/>
            <path d="M0 0 C2.31 -0.19 2.31 -0.19 5 0 C5.44 0.49 5.88 0.98 6.34 1.48 C8.63 3.58 10.25 3.37 13.31 3.44 C18.45 3.76 21.16 4.57 25 8 C25 8.66 25 9.32 25 10 C25.95 9.97 26.89 9.95 27.87 9.92 C31.43 9.83 34.99 9.77 38.55 9.73 C40.08 9.7 41.61 9.67 43.15 9.62 C60.82 9.13 60.82 9.13 68 15 C68.33 15.99 68.66 16.98 69 18 C8.94 18 -51.12 18 -113 18 C-113 17.34 -113 16.68 -113 16 C-102.6 9.05 -93.05 9.1 -80.94 9.13 C-79.14 9.11 -77.34 9.09 -75.54 9.06 C-71.03 9.01 -66.51 9 -62 9 C-61.01 9 -60.02 9 -59 9 C-58.34 9.33 -57.68 9.66 -57 10 C-55.03 10.12 -53.06 10.18 -51.08 10.21 C-49.22 10.24 -49.22 10.24 -47.32 10.27 C-45.96 10.28 -44.6 10.3 -43.24 10.32 C-41.85 10.34 -40.47 10.36 -39.08 10.38 C-35.43 10.43 -31.77 10.48 -28.12 10.53 C-24.39 10.58 -20.67 10.64 -16.94 10.69 C-9.63 10.8 -2.31 10.9 5 11 C5 8.03 5 5.06 5 2 C3.35 2 1.7 2 0 2 C0 1.34 0 0.68 0 0 Z" fill="#065f46" transform="translate(262,189)"/>
            <path d="M0 0 C6.95 -0.45 11.6 -0.67 17 4 C16.01 5.49 16.01 5.49 15 7 C14.47 6.36 13.94 5.71 13.39 5.05 C10.4 2.48 8.64 2.42 4.75 2.25 C3.67 2.19 2.59 2.14 1.48 2.08 C0.25 2.04 0.25 2.04 -1 2 C-0.67 1.34 -0.34 0.68 0 0 Z" fill="#047857" transform="translate(270,193)"/>
            <path d="M0 0 C6.95 4.42 11.15 9.2 13.48 17.15 C14.18 20.65 14.13 23.87 13.94 27.44 C6.43 27.82 -0.08 26.8 -7.31 24.81 C-8.31 24.54 -9.32 24.28 -10.35 24 C-19.65 21.43 -29.45 18.59 -37.06 12.44 C-35.02 6.47 -32.19 2.83 -26.75 -0.38 C-18.15 -4.36 -8.46 -4.29 0 0 Z" fill="white" opacity="0.9" transform="translate(263.0625,64.5625)"/>
            <path d="M0 0 C4.02 0.63 7.21 1.95 10.88 3.69 C17.32 6.59 23.92 8.52 30.75 10.31 C32.19 10.69 32.19 10.69 33.65 11.08 C39.75 12.63 45.72 13.56 52 14 C51.73 21.17 49.34 26.28 45 32 C42.09 34.65 41.51 35.02 37.44 34.88 C34.01 34 33.04 33.73 31 31 C30.74 28.77 30.74 28.77 30.88 26.38 C30.95 24.92 30.99 23.46 31 22 C29.89 20.67 29.89 20.67 27.06 20.75 C26.05 20.83 25.04 20.92 24 21 C23.34 21.99 22.68 22.98 22 24 C21.34 24 20.68 24 20 24 C17 19.62 17 19.62 17 17 C15.72 17.49 15.72 17.49 14.41 17.98 C10.91 19.03 8.08 19.3 4.44 19.31 C3.34 19.33 2.25 19.35 1.12 19.36 C-2.38 18.96 -4.24 18.16 -7 16 C-8.13 12.56 -8.13 12.56 -8 9 C-5.75 6.88 -5.75 6.88 -3 5 C-1.21 2.38 -1.21 2.38 0 0 Z" fill="#047857" transform="translate(225,78)"/>
            <path d="M0 0 C-0.54 0.44 -1.09 0.87 -1.64 1.32 C-6.78 5.59 -10.53 8.81 -11.31 15.76 C-11.6 22.73 -10.53 27.04 -7 33 C-7 33.66 -7 34.32 -7 35 C-5.68 35.69 -4.34 36.35 -3 37 C-1.95 37.53 -1.95 37.53 -0.88 38.06 C5.86 40.26 12.36 40.73 19 38 C20.7 36.71 22.38 35.39 24 34 C24.66 34 25.32 34 26 34 C26.66 32.68 27.32 31.36 28 30 C28.85 32.38 29.18 33.55 28.21 35.93 C24.02 42.31 19.94 48.1 12.41 50.53 C4.57 52.06 -2.99 51.94 -10 48 C-10.85 47.63 -11.69 47.26 -12.56 46.88 C-18.2 42.54 -21.78 35.94 -23 29 C-23.79 20.11 -22.07 14.26 -16.31 7.31 C-11.93 2.59 -6.79 -2.25 0 0 Z" fill="white" opacity="0.85" transform="translate(198,25)"/>
            <path d="M0 0 C3 4.22 3 4.22 3 7 C3.54 6.34 4.07 5.68 4.63 5 C7 3 7 3 10.13 2.63 C13 3 13 3 15 5 C15.02 7.06 15.02 7.06 14.81 9.44 C14.7 11.83 14.7 11.83 15 14 C17.73 16.43 20.44 17.34 24 18 C24 18.66 24 19.32 24 20 C24.99 20.33 25.98 20.66 27 21 C27 22.32 27 23.64 27 25 C24.76 26.2 22.51 27.39 20.25 28.56 C19.62 28.9 18.98 29.25 18.33 29.6 C13.55 32.06 13.55 32.06 10.55 31.71 C10.04 31.48 9.53 31.24 9 31 C9 29.68 9 28.36 9 27 C8.14 27.07 7.29 27.14 6.4 27.21 C-4.11 27.71 -4.11 27.71 -8.06 24.63 C-13.84 18.55 -15.46 9.97 -17 2 C-16.24 1.94 -15.48 1.88 -14.7 1.82 C-13.71 1.73 -12.71 1.65 -11.69 1.56 C-10.7 1.48 -9.72 1.4 -8.7 1.32 C-5.61 0.95 -3.13 0 0 0 Z" fill="#34d399" transform="translate(242,95)"/>
            <path d="M0 0 C0.66 0 1.32 0 2 0 C0.68 9.6 -2.38 16.55 -10.05 22.69 C-18.78 28.56 -29.54 31.18 -40 31 C-40.99 30.34 -41.98 29.68 -43 29 C-44.26 29.04 -45.52 29.08 -46.81 29.13 C-51.24 29.23 -53.66 28.01 -57 25 C-57.88 22.25 -57.88 22.25 -58 20 C-56.68 20 -55.36 20 -54 20 C-54 19.01 -54 18.02 -54 17 C-53.23 17.01 -52.46 17.02 -51.66 17.04 C-50.16 17.05 -50.16 17.05 -48.63 17.06 C-47.13 17.08 -47.13 17.08 -45.6 17.1 C-43.02 17.18 -43.02 17.18 -41 16 C-40.67 20.29 -40.34 24.58 -40 29 C-36.83 28.43 -33.66 27.85 -30.5 27.25 C-29.61 27.09 -28.73 26.94 -27.81 26.77 C-18.75 25.04 -10.4 21.87 -5 14 C-3.01 9.41 -1.44 4.79 0 0 Z" fill="#34d399" transform="translate(264,146)"/>
          </svg>
        </div>

        <div className="relative">
          <div className="flex items-center gap-1.5 mb-2">
            <FiStar className="w-3 h-3 text-amber-300/80" />
            <span className="text-[10px] font-semibold text-amber-200/80 uppercase tracking-wider">
              {locale === "ar" ? "تذكير اليوم" : "Daily Reminder"}
            </span>
          </div>
          <p
            className="text-white/95 text-sm leading-relaxed font-medium mb-1.5"
            style={{ direction: locale === "ar" ? "rtl" : "ltr" }}
          >
            {locale === "ar" ? quote.ar : quote.en}
          </p>
          <p className="text-emerald-200/60 text-[10px] font-medium">
            {locale === "ar" ? quote.sourceAr : quote.source}
          </p>
        </div>
      </div>

      {/* Motivation + Progress Ring — ring always on the outer edge */}
      <div className={`flex items-center gap-4 my-4 p-4 rounded-2xl  
        bg-white dark:bg-gray-900 shadow-sm
        align-center justify-center px-5 py-4
        `}>
        <ProgressRing
          progress={progress}
          size={82}
          strokeWidth={4}
          color={
            progress >= 70
              ? "#059669"
              : progress >= 40
                ? "#D97706"
                : "#9CA3AF"
          }
          bgColor="var(--color-border, #E5E7EB)"
        />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <motivation.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {motivation.text}
            </p>
          </div>
          {daysRemaining > 0 && daysRemaining <= 10 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
              {locale === "ar"
                ? `${toLocalizedNum(daysRemaining, locale)} يوم متبقي`
                : `${daysRemaining} days remaining`}
            </p>
          )}
          {longestStreak > 1 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {locale === "ar"
                ? `أفضل سلسلة: ${toLocalizedNum(longestStreak, locale)} يوم`
                : `Best streak: ${longestStreak} days`}
            </p>
          )}
        </div>
      </div>

      {/* Quick status pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
            fasted
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          {fasted
            ? <FiCheck className="w-3.5 h-3.5" />
            : <IoRestaurantOutline className="w-3.5 h-3.5" />}
          {locale === "ar" ? "صيام" : "Fasting"}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
            prayerCount === totalPrayers
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : prayerCount > 0
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          <FiSun className="w-3.5 h-3.5" />
          {toLocalizedNum(prayerCount, locale)}/{toLocalizedNum(totalPrayers, locale)}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
            quranDone
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          {quranDone ? <FiCheck className="w-3.5 h-3.5" /> : <FiBookOpen className="w-3.5 h-3.5" />}
          {locale === "ar" ? "قرآن" : "Quran"}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
            (azkarMorning || azkarEvening)
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          <FiHeart className="w-3.5 h-3.5" />
          {locale === "ar" ? "أذكار" : "Azkar"}
        </span>
      </div>

      <DaySelector />
      <FastingCard />
      <PrayerCard />
      <QuranCard />
      <AzkarCard />
      <ExtrasCard />
    </div>
  );
}
