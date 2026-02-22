import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PrayerTimesData,
  fetchPrayerTimes,
  requestUserLocation,
  getCachedLocation,
  UserLocation,
} from '../services/prayerTimes';

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimesData | null;
  loading: boolean;
  error: string | null;
  locationGranted: boolean;
  /** Request location permission and fetch prayer times */
  requestPermission: () => Promise<void>;
  /** Refresh prayer times with current location */
  refresh: () => Promise<void>;
}

export function usePrayerTimes(): UsePrayerTimesResult {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<UserLocation | null>(getCachedLocation);
  const locationGranted = !!location;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTimes = useCallback(async (loc: UserLocation) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrayerTimes(loc);
      setPrayerTimes(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch prayer times');
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loc = await requestUserLocation();
      setLocation(loc);
      await fetchTimes(loc);
    } catch (err: any) {
      if (err?.code === 1) {
        setError('Location permission denied');
      } else {
        setError(err?.message || 'Failed to get location');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchTimes]);

  const refresh = useCallback(async () => {
    const loc = location || getCachedLocation();
    if (loc) {
      await fetchTimes(loc);
    }
  }, [location, fetchTimes]);

  // Auto-fetch on mount if we have a cached location
  useEffect(() => {
    if (location) {
      fetchTimes(location);
    }
  }, []);

  // Refresh the "next prayer" countdown every 30 seconds
  useEffect(() => {
    if (!location) return;
    intervalRef.current = setInterval(() => {
      fetchTimes(location);
    }, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [location, fetchTimes]);

  return { prayerTimes, loading, error, locationGranted, requestPermission, refresh };
}
