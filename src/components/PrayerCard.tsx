import React from "react";
import {
  FiSun,
  FiSunrise,
  FiSunset,
  FiMoon,
  FiStar,
  FiCloudRain,
  FiCheck,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import { PrayerStatus, isRamadanPeriod, toLocalizedNum } from "../types";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import { formatCountdown } from "../services/prayerTimes";

const PRAYER_ICON_MAP: Record<keyof PrayerStatus, React.ElementType> = {
  fajr: FiSunrise,
  dhuhr: FiSun,
  asr: FiCloudRain,
  maghrib: FiSunset,
  isha: FiMoon,
  taraweeh: FiStar,
};

/** Distinct colors per prayer — gives each icon a "live" time-of-day feel */
const PRAYER_ICON_COLOR: Record<keyof PrayerStatus, string> = {
  fajr: "text-amber-400",
  dhuhr: "text-yellow-500",
  asr: "text-orange-400",
  maghrib: "text-rose-500",
  isha: "text-indigo-400",
  taraweeh: "text-violet-400",
};

const PRAYER_ICON_COLOR_DONE: Record<keyof PrayerStatus, string> = {
  fajr: "text-amber-200",
  dhuhr: "text-yellow-200",
  asr: "text-orange-200",
  maghrib: "text-rose-200",
  isha: "text-indigo-200",
  taraweeh: "text-violet-200",
};

const PRAYER_LABEL_AR: Record<keyof PrayerStatus, string> = {
  fajr: "الفجر",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
  taraweeh: "التراويح",
};

/** Map PrayerStatus keys to Aladhan timing keys */
const PRAYER_TIME_KEY: Partial<Record<keyof PrayerStatus, string>> = {
  fajr: "fajr",
  dhuhr: "dhuhr",
  asr: "asr",
  maghrib: "maghrib",
  isha: "isha",
};

/** Convert "HH:MM" (24 h) → "h:mm:ss AM/PM" in 12-hour format with localised digits */
function to12Hour(time24: string, locale: string): string {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, "0");
  const period =
    h >= 12 ? (locale === "ar" ? "م" : "PM") : locale === "ar" ? "ص" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  const formatted = `${h}:${m}:${toLocalizedNum("00", locale)} ${period}`;
  return locale === "ar"
    ? toLocalizedNum(formatted.replace(/ /g, "\u00A0"), locale)
    : formatted;
}

export default function PrayerCard() {
  const { dailyLog, updatePrayers, t, locale, currentDayNumber } = useApp();
  const {
    prayerTimes,
    loading: timesLoading,
    locationGranted,
    requestPermission,
  } = usePrayerTimes();

  if (!dailyLog) return null;
  const { prayers } = dailyLog;

  const inRamadan = isRamadanPeriod(currentDayNumber);
  // Always show all prayers including taraweeh/qiyam
  const prayerKeys = Object.keys(prayers) as (keyof PrayerStatus)[];
  const doneCount = prayerKeys.filter((k) => prayers[k]).length;

  // Outside Ramadan, taraweeh becomes Qiyam al-Layl
  function getPrayerLabel(key: keyof PrayerStatus): string {
    if (key === "taraweeh" && !inRamadan) {
      return locale === "ar" ? "قيام الليل" : "Qiyam al-Layl";
    }
    return locale === "ar"
      ? PRAYER_LABEL_AR[key]
      : (t[key as keyof typeof t] as string);
  }

  function getPrayerTime(key: keyof PrayerStatus): string | null {
    if (!prayerTimes) return null;
    const timeKey = PRAYER_TIME_KEY[key];
    if (!timeKey) return null;
    const raw: string | undefined = (prayerTimes as any)[timeKey];
    if (!raw) return null;
    return to12Hour(raw, locale);
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {t.prayersTitle}
        </span>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {toLocalizedNum(doneCount, locale)}/
          {toLocalizedNum(prayerKeys.length, locale)}
        </span>
      </div>

      {/* Next prayer countdown */}
      {prayerTimes?.nextPrayer && (
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 mb-3">
          <FiClock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            {locale === "ar"
              ? `${prayerTimes.nextPrayer.nameAr} بعد ${formatCountdown(prayerTimes.nextPrayer.remainingMs, "ar")}`
              : `${prayerTimes.nextPrayer.name} in ${formatCountdown(prayerTimes.nextPrayer.remainingMs, "en")}`}
          </span>
        </div>
      )}

      {/* Location prompt */}
      {!locationGranted && !timesLoading && (
        <button
          onClick={requestPermission}
          className="flex items-center gap-2 w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 mb-3 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiMapPin className="w-3.5 h-3.5" />
          {locale === "ar"
            ? "فعّل الموقع لعرض مواقيت الصلاة"
            : "Enable location for prayer times"}
        </button>
      )}

      <div className="grid grid-cols-3 gap-2">
        {prayerKeys.map((key) => {
          const Icon = PRAYER_ICON_MAP[key];
          const done = prayers[key];
          const label = getPrayerLabel(key);
          const time = getPrayerTime(key);
          const iconColor = done
            ? PRAYER_ICON_COLOR_DONE[key]
            : PRAYER_ICON_COLOR[key];
          return (
            <button
              key={key}
              onClick={() => updatePrayers(key, !done)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                done
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-400"
              }`}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
              <span className="text-xs font-medium">{label}</span>
              {time && (
                <span
                  className={`text-sm leading-tight ${done ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}
                >
                  {time}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
