import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getRamadanPhase, isLast10Days, isLaylatAlQadrCandidate, getLaylatAlQadrNight, RamadanPhase, RAMADAN_DAYS } from '../types';

export interface RamadanPhaseInfo {
  /** Current phase: 'normal', 'last-ten', or 'laylat-qadr' */
  phase: RamadanPhase;
  /** True if we're in the last 10 days (20-30) */
  isLastTenDays: boolean;
  /** True if tonight is an odd Laylat al-Qadr candidate night */
  isOddNight: boolean;
  /** The night number for display, e.g. 21 when day is 20 */
  nightNumber: number;
  /** English label e.g. "Night 21" */
  nightLabel: string;
  /** Arabic label e.g. "ليلة 21" */
  nightLabelAr: string;
  /** Days remaining in Ramadan */
  daysRemaining: number;
}

export function useRamadanPhase(): RamadanPhaseInfo {
  const { currentDayNumber, locale } = useApp();

  return useMemo(() => {
    const phase = getRamadanPhase(currentDayNumber);
    const isLastTen = isLast10Days(currentDayNumber);
    const isOddNight = isLaylatAlQadrCandidate(currentDayNumber);
    const nightNum = isOddNight ? getLaylatAlQadrNight(currentDayNumber) : 0;
    const daysRemaining = Math.max(0, RAMADAN_DAYS - currentDayNumber);

    return {
      phase,
      isLastTenDays: isLastTen,
      isOddNight,
      nightNumber: nightNum,
      nightLabel: isOddNight ? `Night ${nightNum}` : '',
      nightLabelAr: isOddNight ? `ليلة ${nightNum}` : '',
      daysRemaining,
    };
  }, [currentDayNumber, locale]);
}
