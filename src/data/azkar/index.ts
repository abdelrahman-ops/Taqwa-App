/**
 * Azkar data loader — imports the comprehensive JSON data and filters
 * by type: 0 = both morning & evening, 1 = morning only, 2 = evening only.
 */

import arData from './ar.json';
import enData from './en.json';

export interface AzkarItem {
  order: number;
  content: string;           // Arabic text
  translation?: string;      // English translation (en.json only)
  transliteration?: string;  // Transliteration (en.json only)
  count: number;
  countDescription: string;
  fadl: string;              // Virtue / reward
  source: string;            // Hadith source
  type: 0 | 1 | 2;          // 0 = both, 1 = morning, 2 = evening
  audio: string;
  hadithText: string;
}

function normalizeItem(raw: any): AzkarItem {
  return {
    order: raw.order,
    content: raw.content,
    translation: raw.translation,
    transliteration: raw.transliteration,
    count: raw.count,
    countDescription: raw.count_description,
    fadl: raw.fadl,
    source: raw.source,
    type: raw.type,
    audio: raw.audio,
    hadithText: raw.hadith_text,
  };
}

const arItems: AzkarItem[] = (arData as any[]).map(normalizeItem);
const enItems: AzkarItem[] = (enData as any[]).map(normalizeItem);

/**
 * Get azkar list for the given locale and time of day.
 * Morning = type 0 (both) + type 1 (morning-only)
 * Evening = type 0 (both) + type 2 (evening-only)
 */
export function getAzkarList(locale: 'ar' | 'en', time: 'morning' | 'evening'): AzkarItem[] {
  const items = locale === 'ar' ? arItems : enItems;
  const typeFilter = time === 'morning' ? [0, 1] : [0, 2];
  return items
    .filter(item => typeFilter.includes(item.type))
    .sort((a, b) => a.order - b.order);
}

/** Get all azkar items for a given locale. */
export function getAllAzkar(locale: 'ar' | 'en'): AzkarItem[] {
  return locale === 'ar' ? arItems : enItems;
}
