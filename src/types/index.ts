// ===== Data Types =====

export interface PrayerStatus {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  taraweeh: boolean;
}

export interface FastingStatus {
  completed: boolean;
  preDawnMeal: boolean;
  notes: string;
}

export interface QuranStatus {
  pagesRead: number;
  targetPages: number;
  fromPage: number;
  toPage: number;
  completed: boolean;
}

export interface AzkarStatus {
  morning: boolean;
  evening: boolean;
}

export interface ExtraDeed {
  id: string;
  description: string;
  completed: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  fasting: FastingStatus;
  prayers: PrayerStatus;
  quran: QuranStatus;
  azkar: AzkarStatus;
  extras: ExtraDeed[];
}

export interface QuranGoal {
  targetCompletions: number;
  totalPages: number;
  totalDays: number;
  dailyPages: number;
}

export interface QuranScheduleDay {
  day: number;
  fromPage: number;
  toPage: number;
  dailyPages: number;
  khatmaNumber: number;
}

export interface UserProfile {
  name: string;
  email: string;
  ramadanStartDate: string;
}

export interface AppStats {
  totalDaysTracked: number;
  fastingDays: number;
  totalPrayers: number;
  totalQuranPages: number;
  morningAzkar: number;
  eveningAzkar: number;
  totalExtras: number;
}

// ===== Ramadan Constants =====

export const RAMADAN_2026_START = '2026-02-19';
export const RAMADAN_2026_END = '2026-03-20';
export const QURAN_TOTAL_PAGES = 604;
export const RAMADAN_DAYS = 30;
/** Maximum tracking days — allows the app to work past Ramadan */
export const MAX_TRACKING_DAYS = 365;

// ===== Hijri Calendar Months After Ramadan 1447 AH =====
// Each entry: [monthNameEn, monthNameAr, numberOfDays]
// Ramadan itself is days 1-30 and not included here.
const HIJRI_MONTHS_AFTER_RAMADAN: [string, string, number][] = [
  ['Shawwal',     'شوال',       29],
  ["Dhul Qi'dah", 'ذو القعدة',  30],
  ['Dhul Hijjah', 'ذو الحجة',   30],
  ['Muharram',    'محرم',       30],
  ['Safar',       'صفر',        29],
  ["Rabi' al-Awwal", 'ربيع الأول', 30],
  ["Rabi' al-Thani", 'ربيع الآخر', 29],
  ['Jumada al-Ula',  'جمادى الأولى', 30],
  ['Jumada al-Thani','جمادى الآخرة', 29],
  ["Sha'ban",     'شعبان',      30],
  ['Ramadan',     'رمضان',      30],
];

export interface HijriDate {
  monthNameEn: string;
  monthNameAr: string;
  dayInMonth: number;
  daysInMonth: number;
}

/**
 * Convert a dayNumber (1-based from Ramadan start) to a Hijri month + day.
 * Days 1-30 → Ramadan. Days 31+ → subsequent months.
 */
export function getHijriDate(dayNumber: number): HijriDate {
  if (dayNumber <= RAMADAN_DAYS) {
    return { monthNameEn: 'Ramadan', monthNameAr: 'رمضان', dayInMonth: dayNumber, daysInMonth: RAMADAN_DAYS };
  }

  let remaining = dayNumber - RAMADAN_DAYS;
  for (const [en, ar, days] of HIJRI_MONTHS_AFTER_RAMADAN) {
    if (remaining <= days) {
      return { monthNameEn: en, monthNameAr: ar, dayInMonth: remaining, daysInMonth: days };
    }
    remaining -= days;
  }

  // Fallback (beyond a full year)
  return { monthNameEn: 'Day', monthNameAr: 'يوم', dayInMonth: dayNumber, daysInMonth: 30 };
}

export const PRAYER_NAMES: Record<keyof PrayerStatus, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
  taraweeh: 'Taraweeh',
};

// Prayer icons are handled by React icon components in PrayerCard and Prayers pages

// ===== Quran Data (Juz boundaries) =====
export const JUZ_PAGE_RANGES: { juz: number; fromPage: number; toPage: number }[] = [
  { juz: 1, fromPage: 1, toPage: 21 },
  { juz: 2, fromPage: 22, toPage: 41 },
  { juz: 3, fromPage: 42, toPage: 61 },
  { juz: 4, fromPage: 62, toPage: 81 },
  { juz: 5, fromPage: 82, toPage: 101 },
  { juz: 6, fromPage: 102, toPage: 121 },
  { juz: 7, fromPage: 122, toPage: 141 },
  { juz: 8, fromPage: 142, toPage: 161 },
  { juz: 9, fromPage: 162, toPage: 181 },
  { juz: 10, fromPage: 182, toPage: 201 },
  { juz: 11, fromPage: 202, toPage: 221 },
  { juz: 12, fromPage: 222, toPage: 241 },
  { juz: 13, fromPage: 242, toPage: 261 },
  { juz: 14, fromPage: 262, toPage: 281 },
  { juz: 15, fromPage: 282, toPage: 301 },
  { juz: 16, fromPage: 302, toPage: 321 },
  { juz: 17, fromPage: 322, toPage: 341 },
  { juz: 18, fromPage: 342, toPage: 361 },
  { juz: 19, fromPage: 362, toPage: 381 },
  { juz: 20, fromPage: 382, toPage: 401 },
  { juz: 21, fromPage: 402, toPage: 421 },
  { juz: 22, fromPage: 422, toPage: 441 },
  { juz: 23, fromPage: 442, toPage: 461 },
  { juz: 24, fromPage: 462, toPage: 481 },
  { juz: 25, fromPage: 482, toPage: 501 },
  { juz: 26, fromPage: 502, toPage: 521 },
  { juz: 27, fromPage: 522, toPage: 541 },
  { juz: 28, fromPage: 542, toPage: 561 },
  { juz: 29, fromPage: 562, toPage: 581 },
  { juz: 30, fromPage: 582, toPage: 604 },
];

// ===== Morning Azkar =====
export const MORNING_AZKAR = [
  { id: 1, text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', translation: 'We have reached the morning and at this very time the kingdom belongs to Allah', count: 1 },
  { id: 2, text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', translation: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection', count: 1 },
  { id: 3, text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', translation: 'Glory is to Allah and praise is to Him', count: 100 },
  { id: 4, text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', translation: 'None has the right to be worshipped except Allah, alone, without partner', count: 10 },
  { id: 5, text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', translation: 'I seek forgiveness from Allah and repent to Him', count: 100 },
  { id: 6, text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', translation: 'In the name of Allah with whose name nothing is harmed on earth nor in the heavens', count: 3 },
];

export const EVENING_AZKAR = [
  { id: 1, text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', translation: 'We have reached the evening and at this very time the kingdom belongs to Allah', count: 1 },
  { id: 2, text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ', translation: 'O Allah, by Your leave we have reached the evening, by Your leave we live and die and unto You is our return', count: 1 },
  { id: 3, text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', translation: 'Glory is to Allah and praise is to Him', count: 100 },
  { id: 4, text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', translation: 'None has the right to be worshipped except Allah, alone, without partner', count: 10 },
  { id: 5, text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created', count: 3 },
  { id: 6, text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', translation: 'In the name of Allah with whose name nothing is harmed on earth nor in the heavens', count: 3 },
];

// ===== Helper Functions =====

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getRamadanDay(dateStr: string, startDate: string = RAMADAN_2026_START): number {
  const date = new Date(dateStr);
  const start = new Date(startDate);
  const diffTime = date.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export function isRamadanDay(dateStr: string): boolean {
  const day = getRamadanDay(dateStr);
  return day >= 1 && day <= MAX_TRACKING_DAYS;
}

/** Returns true if the given day number falls within the Ramadan fasting period (days 1-30). */
export function isRamadanPeriod(dayNumber: number): boolean {
  return dayNumber >= 1 && dayNumber <= RAMADAN_DAYS;
}

/**
 * Convert a number to localised digit string.
 * Arabic locale → Arabic-Indic numerals (٠-٩); others → ASCII digits.
 */
export function toLocalizedNum(n: number | string, locale: string): string {
  if (locale !== 'ar') return String(n);
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
}

export function getQuranSchedule(targetCompletions: number): QuranScheduleDay[] {
  const totalPages = QURAN_TOTAL_PAGES;
  const dailyPages = Math.ceil((totalPages * targetCompletions) / RAMADAN_DAYS);
  const schedule: QuranScheduleDay[] = [];

  for (let day = 1; day <= RAMADAN_DAYS; day++) {
    const startPage = ((day - 1) * dailyPages) % totalPages + 1;
    const endPage = Math.min(startPage + dailyPages - 1, totalPages);
    const khatmaNumber = Math.floor(((day - 1) * dailyPages) / totalPages) + 1;

    schedule.push({
      day,
      fromPage: startPage,
      toPage: endPage > totalPages ? totalPages : endPage,
      dailyPages,
      khatmaNumber,
    });
  }

  return schedule;
}

export function createEmptyDailyLog(date: string, dayNumber: number, quranGoal?: QuranGoal): DailyLog {
  const schedule = quranGoal ? getQuranSchedule(quranGoal.targetCompletions) : null;
  const daySchedule = schedule?.find((s) => s.day === dayNumber);

  return {
    date,
    dayNumber,
    fasting: {
      completed: false,
      preDawnMeal: false,
      notes: '',
    },
    prayers: {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      taraweeh: false,
    },
    quran: {
      pagesRead: 0,
      targetPages: daySchedule?.dailyPages || Math.ceil(QURAN_TOTAL_PAGES / RAMADAN_DAYS),
      fromPage: daySchedule?.fromPage || 1,
      toPage: daySchedule?.toPage || 20,
      completed: false,
    },
    azkar: {
      morning: false,
      evening: false,
    },
    extras: [],
  };
}

export function calculateDayProgress(log: DailyLog): number {
  let total = 0;
  let completed = 0;

  // Fasting — always counts (Ramadan = obligation, post-Ramadan = voluntary)
  total += 1;
  if (log.fasting.completed) completed += 1;

  // Prayers — taraweeh/qiyam always counts
  const prayers = log.prayers;
  const prayerList: (keyof PrayerStatus)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'taraweeh'];
  total += prayerList.length;
  prayerList.forEach(k => { if (prayers[k]) completed += 1; });

  // Quran (weight: 1)
  total += 1;
  if (log.quran.completed || log.quran.pagesRead >= log.quran.targetPages) completed += 1;

  // Azkar (weight: 2)
  total += 2;
  if (log.azkar.morning) completed += 1;
  if (log.azkar.evening) completed += 1;

  return Math.round((completed / total) * 100);
}
