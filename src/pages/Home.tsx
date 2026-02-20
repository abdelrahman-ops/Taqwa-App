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
import { calculateDayProgress, toLocalizedNum, RAMADAN_DAYS } from "../types";
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
              {currentDayNumber <= RAMADAN_DAYS
                ? locale === 'ar'
                  ? `رمضان ${toLocalizedNum(currentDayNumber, locale)}`
                  : `Ramadan ${currentDayNumber}`
                : locale === 'ar'
                  ? `شوال ${toLocalizedNum(currentDayNumber - RAMADAN_DAYS, locale)}`
                  : `Shawwal ${currentDayNumber - RAMADAN_DAYS}`
              }
            </span>
          </div>

        </div>
      </div>

      {/* Daily Quote Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-950 rounded-2xl p-4 mb-4 shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/30">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-1.5 mb-2">
            <FiStar className="w-3 h-3 text-amber-300/80" />
            <span className="text-[10px] font-semibold text-amber-200/80 uppercase tracking-wider">
              {locale === "ar"
                ? "آية اليوم"
                : "Verse of the Day"}
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
