/**
 * Prayer Times Service
 * Uses the Aladhan API (https://aladhan.com/prayer-times-api)
 * to fetch accurate prayer times based on user's geolocation.
 */

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  /** Seconds remaining until the next prayer, or null if unavailable */
  nextPrayer: {
    name: string;
    nameAr: string;
    time: string;
    remainingMs: number;
  } | null;
  /** Date for which these times are valid */
  date: string;
  /** Location used */
  location: { latitude: number; longitude: number } | null;
}

interface AladhanResponse {
  code: number;
  data: {
    timings: Record<string, string>;
    date: { readable: string; gregorian: { date: string } };
  };
}

const CACHE_KEY = 'taqwa_prayer_times';
const LOCATION_CACHE_KEY = 'taqwa_user_location';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// ===== Geolocation =====

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export function getCachedLocation(): UserLocation | null {
  try {
    const raw = localStorage.getItem(LOCATION_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function cacheLocation(loc: UserLocation): void {
  localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(loc));
}

export function requestUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: UserLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        cacheLocation(loc);
        resolve(loc);
      },
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  });
}

// ===== Prayer Times Fetching =====

function getCachedPrayerTimes(dateStr: string): PrayerTimesData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (cached.date === dateStr && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  } catch { /* ignore */ }
  return null;
}

function cachePrayerTimes(dateStr: string, data: PrayerTimesData): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ date: dateStr, data, timestamp: Date.now() }));
}

const PRAYER_NAME_MAP: Record<string, { en: string; ar: string }> = {
  Fajr: { en: 'Fajr', ar: 'الفجر' },
  Sunrise: { en: 'Sunrise', ar: 'الشروق' },
  Dhuhr: { en: 'Dhuhr', ar: 'الظهر' },
  Asr: { en: 'Asr', ar: 'العصر' },
  Maghrib: { en: 'Maghrib', ar: 'المغرب' },
  Isha: { en: 'Isha', ar: 'العشاء' },
};

function parseTime(timeStr: string): Date {
  // Aladhan returns "HH:mm (TZ)" — strip timezone text
  const clean = timeStr.replace(/\s*\(.*\)/, '').trim();
  const [h, m] = clean.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function computeNextPrayer(timings: Record<string, string>): PrayerTimesData['nextPrayer'] {
  const now = new Date();
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const name of prayerOrder) {
    const time = parseTime(timings[name]);
    if (time > now) {
      const meta = PRAYER_NAME_MAP[name];
      return {
        name: meta?.en ?? name,
        nameAr: meta?.ar ?? name,
        time: timings[name].replace(/\s*\(.*\)/, '').trim(),
        remainingMs: time.getTime() - now.getTime(),
      };
    }
  }

  // All prayers have passed — next is tomorrow's Fajr
  const tomorrowFajr = parseTime(timings.Fajr);
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
  return {
    name: 'Fajr',
    nameAr: 'الفجر',
    time: timings.Fajr.replace(/\s*\(.*\)/, '').trim(),
    remainingMs: tomorrowFajr.getTime() - now.getTime(),
  };
}

/**
 * Fetch prayer times for today from Aladhan API.
 * Falls back to cached data when offline.
 * Uses calculation method 5 (Egyptian General Authority of Survey).
 */
export async function fetchPrayerTimes(
  location: UserLocation,
  dateStr?: string
): Promise<PrayerTimesData> {
  const today = dateStr || new Date().toISOString().split('T')[0];

  // Check cache first
  const cached = getCachedPrayerTimes(today);
  if (cached) {
    // Recompute next prayer since time has shifted
    return { ...cached, nextPrayer: cached.nextPrayer ? computeNextPrayer({
      Fajr: cached.fajr, Dhuhr: cached.dhuhr, Asr: cached.asr,
      Maghrib: cached.maghrib, Isha: cached.isha,
    }) : null };
  }

  const [year, month, day] = today.split('-');
  const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${location.latitude}&longitude=${location.longitude}&method=5`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);

  const json: AladhanResponse = await res.json();
  const t = json.data.timings;

  const clean = (s: string) => s.replace(/\s*\(.*\)/, '').trim();

  const data: PrayerTimesData = {
    fajr: clean(t.Fajr),
    sunrise: clean(t.Sunrise),
    dhuhr: clean(t.Dhuhr),
    asr: clean(t.Asr),
    maghrib: clean(t.Maghrib),
    isha: clean(t.Isha),
    nextPrayer: computeNextPrayer(t),
    date: today,
    location,
  };

  cachePrayerTimes(today, data);
  return data;
}

/**
 * Format remaining milliseconds into a human-readable countdown string.
 */
export function formatCountdown(ms: number, locale: 'ar' | 'en'): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  if (locale === 'ar') {
    // Arabic: always show h ساعة m دقيقة s ثانية (with Arabic numerals)
    if (h > 0) return `${h} ساعة ${pad(m)} دقيقة ${pad(s)} ثانية`;
    if (m > 0) return `${m} دقيقة ${pad(s)} ثانية`;
    return `${s} ثانية`;
  }
  // English: compact timer
  if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`;
  if (m > 0) return `${m}m ${pad(s)}s`;
  return `${s}s`;
}
